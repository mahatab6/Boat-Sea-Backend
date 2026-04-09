import status from "http-status";
import AppErrors from "../../errorHandler/AppErrors";
import { prisma } from "../../lib/prisma";
import { ICreateBooking } from "./booking.interface";
import { v7 as uuidv7 } from "uuid";
import { nanoid } from "nanoid";
import { stripe } from "../../../config/stripe.config";
import { envVariables } from "../../../config/env";
import { BoatStatus, BookingStatus, PaymentStatus, ScheduleStatus } from "../../../generated/prisma/enums";
import { IQueryParams } from "../../interface/query.interface";
import { Booking } from "../../../generated/prisma/client";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { bookingFilterableFields, bookingSearchableFields } from "./bookin.constant";

const createBooking = async (
  userId: string,
  userEmail: string,
  payload: ICreateBooking,
) => {
  // We wrap the DB logic and Stripe logic
  return await prisma.$transaction(async (tx) => {
    //  Check Boat Availability & Capacity
    const boat = await tx.boat.findUnique({
      where: { id: payload.boatId },
    });

    if (!boat || boat.status !== "AVAILABLE") {
      throw new AppErrors(
        status.NOT_FOUND,
        "Boat is not available for booking",
      );
    }

    if (boat.capacity < payload.totalGuests) {
      throw new AppErrors(
        status.BAD_REQUEST,
        `Beyond boat capacity. Max: ${boat.capacity}`,
      );
    }

    //  Create the Booking Record
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
        tripDate: payload.tripDate,
      },
    });

    //  Create the Payment Record (Linked to Booking)
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

    //  Create Stripe Checkout Session
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
          boatId: payload.boatId,
          paymentId: payment.id,
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
      throw new AppErrors(
        status.INTERNAL_SERVER_ERROR,
        "Failed to initialize payment gateway",
      );
    }
  });
};

const getAllBookings = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<Booking>(prisma.booking, query, {
    searchableFields: bookingSearchableFields,
    filterableFields: bookingFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .paginate()
    .sort()
    .execute();

  return result;
};

const getMyBookings = async (userId: string) => {
  const result = await prisma.booking.findFirst({
    where: {
      userId: userId,
    },
    include: {
      schedule: true,
      payments: true,
      boat: true,
    },
  });

  return result;
};

const cancelBooking = async (userId: string, bookingId: string) => {
  // 1. Verify the booking exists AND belongs to the requesting user
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new AppErrors(status.NOT_FOUND, "Booking not found");
  }

  if(booking.bookingStatus == BookingStatus.COMPLETED){
    throw new AppErrors(status.BAD_REQUEST, "Booking All ready Completed")
  }

  if (booking.userId !== userId) {
    throw new AppErrors(status.FORBIDDEN, "You are not authorized to cancel this booking");
  }

  // 2. Perform updates in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Update Booking Status
    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        bookingStatus: BookingStatus.CANCELLED,
        paymentStatus: PaymentStatus.PENDING, // Or REFUNDED depending on your logic
      },
    });

    // Make the Boat available again
    await tx.boat.update({
      where: { id: booking.boatId },
      data: { status: BoatStatus.AVAILABLE },
    });

    // Update the Schedule status
    await tx.schedule.update({
      where: { id: booking.scheduleId },
      data: { status: ScheduleStatus.CANCELLED },
    });

    return updatedBooking;
  });

  return result;
};

export const bookingService = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings
};
