import z from "zod";

const BoatTypeEnum = z.enum(["SPEEDBOAT", "FERRY", "LAUNCH", "PRIVATE", "YACHT", "CATAMARAN"]);
const BoatStatusEnum = z.enum(["AVAILABLE", "UNAVAILABLE", "MAINTENANCE", "SUSPENDED"]);

export const createBoatSchema = z.object({
  boatName: z.string().min(1).max(150),
  boatType: BoatTypeEnum,
  status: BoatStatusEnum,
  // Added optional primary image (usually a URL string from a file upload)
  primary_img: z.string().url().optional().nullable(),
  capacity: z.coerce.number().int().positive(),
  boatCondition: z.string().min(1),
  location: z.string().min(1),
  pricePerTrip: z.coerce.number().int().nonnegative(),
  
  description: z.string().min(10, "Description should be more detailed"),
  length: z.coerce.number().positive(),
  width: z.coerce.number().positive(),
  engineCapacity: z.coerce.number().int().positive(),
  manufacturer: z.string().min(1),
  manufacturingYear: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  specifications: z.string().min(1),
  amenities: z.array(z.string()).default([]),
  cancellationPolicy: z.string().min(1),
});

export const updateBoatSchema = createBoatSchema.partial();


export const createScheduleSchema = z.object({
  routeId: z.string(),

  departureDate: z.string().datetime(),

  departureTime: z.string(),

  arrivalTime: z.string(),

  availableSeats: z.number().int().positive(),

  recurringPattern: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional(),
});
