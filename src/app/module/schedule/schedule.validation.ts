import { z } from "zod";

export const createScheduleZodSchema = z.object({
  boatId: z.string("Boat ID is required"),
  routeId: z.string("Route ID is required"),
  startDate: z.string("Start date is required"),
  endDate: z.string().optional(),
  departureTime: z.string("Departure time is required"),
  arrivalTime: z.string("Arrival time is required"),
  availableSeats: z.number().min(1, "Available seats must be at least 1"),
  recurringPattern: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
});


export const updateScheduleZodSchema = createScheduleZodSchema.partial();
