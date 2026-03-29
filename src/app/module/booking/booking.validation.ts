import { z } from "zod";

export const createBookingSchema = z.object({
  scheduleId: z.string(),

  boatId: z.string(),

  totalGuests: z.number().positive().min(1),

  totalAmount: z.number().positive(),

  paymentMethod: z.string(),

  passengerDetails: z.any(),

  emergencyContact: z.string().optional(),

  specialRequests: z.string().optional(),
});