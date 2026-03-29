import status from "http-status";
import AppErrors from "../../errorHandler/AppErrors";
import { prisma } from "../../lib/prisma";
import { ICreateBooking } from "./booking.interface";
import { v7 as uuidv7 } from 'uuid';
import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums";


const createBooking = async (userId: string, payload: ICreateBooking) => {
  return await prisma.$transaction(async (tx) => {
    
    const boats =  await tx.boat.findFirst({
      where: {
        id: payload.boatId,
        status: "AVAILABLE"
    }})

    if (boats && boats.capacity <= payload.totalGuests) {
      throw new AppErrors(status.BAD_REQUEST, "Beyond the boat's capacity");
    }

  
    const booking = await tx.booking.create({
      data: {
        id: uuidv7(),
        bookingNumber: `BOAT-${Date.now()}`,
        userId,
        scheduleId: payload.scheduleId,
        boatId: payload.boatId,
        totalGuests: payload.totalGuests,
        totalAmount: payload.totalAmount,
        passengerDetails: payload.passengerDetails,
        bookingStatus: BookingStatus.PENDING, 
        paymentStatus: PaymentStatus.PENDING,
      },
    });

    
    // 4. Create a Payment Record (Without Transaction ID yet)
    // await tx.payments.create({
    //   data: {
    //     id: uuidv7(),
    //     bookingId: booking.id,
    //     amount: Math.round(payload.totalAmount),
    //     currency: "BDT",
    //     paymentMethod: "STRIPE",
    //     transactionId: "PENDING_" + booking.id, // Placeholder
    //     paymentStatus: "PENDING",
    //   }
    // });

    // 5. Integrate Stripe (Pseudo code)
    // const session = await stripe.checkout.sessions.create({...});
    // return { booking, checkoutUrl: session.url };
    
    return booking;
  });
};

export const bookingService = {
    createBooking
}