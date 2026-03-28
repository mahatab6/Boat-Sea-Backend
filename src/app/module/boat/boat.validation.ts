import z from "zod";

export const createBoatSchema = z.object({
  boatName: z.string().max(150),
  boatType: z.enum(["SPEEDBOAT", "FERRY", "LAUNCH", "PRIVATE"]),
  status: z.enum(["AVAILABLE", "UNAVAILABLE", "MAINTENANCE", "SUSPENDED"]),
  capacity: z.number().int().positive(),
  boatCondition: z.string(),
  location: z.string(),
  pricePerTrip: z.number().int(),
  length: z.number(),
  width: z.number(),
  engineCapacity: z.number().int(),
  manufacturer: z.string(),
  manufacturingYear: z.number().int(),
  amenities: z.array(z.string()),
  cancellationPolicy: z.string(),
});


export const updateBoatSchema = z
  .object({
    boatName: z.string().max(150),
    boatType: z.enum(["SPEEDBOAT", "FERRY", "LAUNCH", "PRIVATE"]),
    status: z.enum(["AVAILABLE", "UNAVAILABLE", "MAINTENANCE", "SUSPENDED"]),
    capacity: z.number().int().positive(),
    boatCondition: z.string(),
    location: z.string(),
    pricePerTrip: z.number().int(),
    length: z.number(),
    width: z.number(),
    engineCapacity: z.number().int(),
    manufacturer: z.string(),
    manufacturingYear: z.number().int(),
    amenities: z.array(z.string()),
    cancellationPolicy: z.string(),
  })
  .partial();


