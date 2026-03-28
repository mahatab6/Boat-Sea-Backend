import z from "zod";
import { createBoatSchema, createScheduleSchema, updateBoatSchema } from "./boat.validation";


export type IUpdateBoat = z.infer<typeof updateBoatSchema>;
export type ICreateBoat = z.infer<typeof createBoatSchema>;
export type ICreateSchedule = z.infer<typeof createScheduleSchema>;