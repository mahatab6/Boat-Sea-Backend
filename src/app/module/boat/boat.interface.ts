import z from "zod";
import { createBoatSchema, updateBoatSchema } from "./boat.validation";


export type IUpdateBoat = z.infer<typeof updateBoatSchema>;
export type ICreateBoat = z.infer<typeof createBoatSchema>;