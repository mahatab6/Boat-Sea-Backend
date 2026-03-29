import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { BookingStatus, PaymentStatus, ScheduleStatus } from "../../../generated/prisma/enums";
import { generateInvoicePdf } from "./payment.utils";
import { sendEmail } from "../../utils/email";
import { uploadFileToCloudinary } from "../../../config/cloudinary.config";

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  // 1. Idempotency Check
  const existingPayment = await prisma.payments.findFirst({
    where: { stripeEventId: event.id },
  });

  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed` };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;
      const scheduleId = session.metadata?.scheduleId;
      const paymentId = session.metadata?.paymentId;


      if (!bookingId || !paymentId) {
        console.error("Missing bookingId or paymentId in session metadata");
        return { message: "Missing metadata" };
      }

      // 2. Fetch Booking with Relations
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          user: true,
          schedule: true,
          boat: true,
        },
      });

      if (!booking) {
        console.error(`Booking with id ${bookingId} not found`);
        return { message: "Booking not found" };
      }

      const isPaid = session.payment_status === "paid";

      try {
        // 3. Atomic Transaction: Update Booking and Payment
        const updatedPayment = await prisma.$transaction(async (tx) => {
          // Update Booking Status
          await tx.booking.update({
            where: { id: bookingId },
            data: {
              paymentStatus: isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
              bookingStatus: isPaid
                ? BookingStatus.CONFIRMED
                : BookingStatus.PENDING,
            },
          });

          // Update schedul status
          await tx.schedule.update({
            where:{
              id: scheduleId
            },
            data: {
              status: ScheduleStatus.COMPLETED
            }
          })

          // Update Payment Record
          return await tx.payments.update({
            where: { id: paymentId },
            data: {
              stripeEventId: event.id,
              paymentStatus: isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
              paymentDate: new Date(),
              paymentDetails: JSON.stringify(session),
              transactionId:
                (session.payment_intent as string) || `stripe_${Date.now()}`,
            },
          });
        });

        // 4. Handle Post-Payment Logic (PDF & Email)
        if (isPaid) {
          try {
            const pdfBuffer = await generateInvoicePdf({
              invoiceId: updatedPayment.id,
              email: booking.user.email,

              bookingDate: booking.bookingDate,
              bookingNumber: booking.id,

              passengerName: booking.user.name,
              passengerEmail: booking.user.email,

              tripDate: booking.tripDate,
              boatName: booking.boat.boatName,

              amount: Number(updatedPayment.amount),
              currency: "BDT",

              transactionId: updatedPayment.transactionId,

              paymentDate: updatedPayment.createdAt.toISOString(),
            });

            const uploadFile = await uploadFileToCloudinary(
              pdfBuffer,
              `bookings/invoices/inv-${paymentId}.pdf`,
            );

            const invoiceUrl = uploadFile?.secure_url;

            // Save Invoice URL
            await prisma.payments.update({
              where: { id: paymentId },
              data: {
                paymentDetails: JSON.stringify({ ...session, invoiceUrl }),
              },
            });

            // Send Email
            await sendEmail({
              to: booking.user.email,
              subject: `Booking Confirmed: ${booking.bookingNumber}`,
              templateName: "booking-confirmation",
              templateData: {
                userName: booking.user.name,
                bookingNumber: booking.bookingNumber,
                amount: updatedPayment.amount,
                invoiceUrl: invoiceUrl,
              },
              attachments: [
                {
                  filename: `Invoice-${booking.bookingNumber}.pdf`,
                  content: pdfBuffer,
                  contentType: "application/pdf",
                },
              ],
            });
          } catch (err) {
            console.error("Post-processing (PDF/Email) failed:", err);
          }
        }
      } catch (error) {
        console.error("Transaction failed:", error);
        throw error; 
      }
      break;
    }

    case "checkout.session.expired":
    case "payment_intent.payment_failed": {
      const session = event.data.object as any;
      const paymentId = session.metadata?.paymentId;
      if (paymentId) {
        await prisma.payments.update({
          where: { id: paymentId },
          data: { paymentStatus: PaymentStatus.FAILED },
        });
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { message: "Success" };
};

export const PaymentService = {
  handlerStripeWebhookEvent,
};
