import status from "http-status";
import AppErrors from "../../errorHandler/AppErrors";
import { prisma } from "../../lib/prisma";
import { ICreateBooking } from "./booking.interface";
import { v7 as uuidv7 } from 'uuid';
import { nanoid } from "nanoid";
import { stripe } from "../../../config/stripe.config";
import { envVariables } from "../../../config/env";
import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums";

const createBooking = async (userId: string, userEmail: string, payload: ICreateBooking) => {
  // We wrap the DB logic and Stripe logic 
  return await prisma.$transaction(async (tx) => {
    
    // 1. Check Boat Availability & Capacity
    const boat = await tx.boat.findUnique({
      where: { id: payload.boatId }
    });

    if (!boat || boat.status !== "AVAILABLE") {
      throw new AppErrors(status.NOT_FOUND, "Boat is not available for booking");
    }

    if (boat.capacity < payload.totalGuests) {
      throw new AppErrors(status.BAD_REQUEST, `Beyond boat capacity. Max: ${boat.capacity}`);
    }

    // 2. Create the Booking Record
    const booking = await tx.booking.create({
      data: {
        id: uuidv7(),
        bookingNumber: `BT-${nanoid(7).toUpperCase()}`,
        userId,
        scheduleId: payload.scheduleId,
        boatId: payload.boatId,
        totalGuests: payload.totalGuests,
        totalAmount: payload.totalAmount,
        passengerDetails: payload.passengerDetails,
        bookingStatus: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        tripDate: payload.tripDate
      },
    });

    // 3. Create the Payment Record (Linked to Booking)
    // We generate a temporary transactionId until Stripe provides one via webhook
    const payment = await tx.payments.create({
      data: {
        id: uuidv7(),
        bookingId: booking.id,
        amount: payload.totalAmount,
        currency: "USD",
        paymentMethod: "STRIPE",
        transactionId: `temp_${nanoid(10)}`, // Will be updated by webhook
        paymentStatus: PaymentStatus.PENDING,
      },
    });

    // 4. Create Stripe Checkout Session
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: userEmail, 
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Boat Trip: ${boat.boatName}`,
                description: `Booking for ${payload.totalGuests} guests`,
              },
              unit_amount: Math.round(payload.totalAmount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        metadata: {
          bookingId: booking.id,
          scheduleId: payload.scheduleId,
          paymentId: payment.id, // CRITICAL: This links the webhook back to this record
        },
        success_url: `${envVariables.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${envVariables.FRONTEND_URL}/booking-cancelled`,
      });

      return {
        booking,
        payment,
        paymentUrl: session.url,
      };
    } catch (stripeError: any) {
      console.error("Stripe Session Error:", stripeError);
      throw new AppErrors(status.INTERNAL_SERVER_ERROR, "Failed to initialize payment gateway");
    }
  });
};

export const bookingService = {
  createBooking
};