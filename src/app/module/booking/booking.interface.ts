import { z } from "zod";
import { createBookingSchema } from "./booking.validation";

export type ICreateBooking = z.infer<
  typeof createBookingSchema
>;