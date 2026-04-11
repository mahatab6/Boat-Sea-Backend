import { z } from "zod";


const RouteDifficultyEnum = z.enum(["EASY", "MODERATE", "HARD"]);

export const createRouteZodSchema = z.object({
  name: z.string().min(3).max(150),
  difficulty: RouteDifficultyEnum,
  duration: z.string().min(3),
  distance: z.string().min(2),
  scenicHighlights: z.string().min(5),
  description: z.string().optional(),
  image: z.string().optional(), 
});


export const updateRouteZodSchema = createRouteZodSchema.partial();