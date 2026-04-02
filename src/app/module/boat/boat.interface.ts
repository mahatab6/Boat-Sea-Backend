import z from "zod";
import { createBoatSchema, createScheduleSchema, updateBoatSchema } from "./boat.validation";
import { BoatStatus, BoatType } from "../../../generated/prisma/enums";

export interface ICreateBoat {
  boatName: string;
  boatType: BoatType;
  status: BoatStatus; 
  capacity: number;
  boatCondition: string;
  location: string;
  pricePerTrip: number;
  description: string;
  length: number;
  width: number;
  engineCapacity: number;
  manufacturer: string;
  manufacturingYear: number;
  specifications: string;
  amenities: string[];
  cancellationPolicy: string;
  primary_img?: string | null;
}

export type IUpdateBoat = z.infer<typeof updateBoatSchema>;

export type ICreateSchedule = z.infer<typeof createScheduleSchema>;