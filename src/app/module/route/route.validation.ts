import { z } from "zod";

export const createRouteZodSchema = z.object({
  routeName: z.string("Route name is required"),
  startLocation: z.string(),
  endLocation: z.string(),
  startLat: z.number(),
  startLng: z.number(),
  endLat: z.number(),
  endLng: z.number(),
  waypoints: z.any().optional(),
  distance: z.number().positive(),
  estimatedDuration: z.number().int().positive(),
  difficulty: z.enum(["EASY", "MODERATE", "HARD"]).optional(),
  isActive: z.boolean().optional(),
  description: z.string().optional(),
  popularTimes: z.array(z.string()).optional(),
});


export const updateRouteZodSchema = z.object({
    routeName: z.string().optional(),
    startLocation: z.string().optional(),
    endLocation: z.string().optional(),
    startLat: z.number().optional(),
    startLng: z.number().optional(),
    endLat: z.number().optional(),
    endLng: z.number().optional(),
    waypoints: z.any().optional(),
    distance: z.number().positive().optional(),
    estimatedDuration: z.number().int().positive().optional(),
    difficulty: z.enum(['EASY','MODERATE','HARD']).optional(),
    isActive: z.boolean().optional(),
    description: z.string().optional(),
    popularTimes: z.array(z.string()).optional(),
});