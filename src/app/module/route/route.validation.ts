import { z } from "zod";


const BoatStatusEnum = z.enum(["EASY", "MODERATE", "HARD"]);

export const createRouteZodSchema = z.object({
  name: z
    .string()
    .min(3, "Route name must be at least 3 characters")
    .max(150),

  difficulty: BoatStatusEnum,

  duration: z
    .string()
    .min(3, "Duration required")
    .max(50),

  distance: z
    .string()
    .min(2, "Distance required")
    .max(20),

  scenicHighlights: z
    .string()
    .min(5, "Add scenic highlights"),

  description: z
    .string()
    .optional(),

  image: z
    .string()
    .url("Must be valid image URL")
    .optional(),
});


export const updateRouteZodSchema = createRouteZodSchema.partial();