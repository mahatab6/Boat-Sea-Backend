import z from "zod";
import { createRouteZodSchema, updateRouteZodSchema } from "./route.validation";


export type IRoute = z.infer<typeof createRouteZodSchema>;
export type updateRouteZodSchema = z.infer<typeof updateRouteZodSchema>;