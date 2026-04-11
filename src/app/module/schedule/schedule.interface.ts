import z from "zod";
import { updateScheduleZodSchema } from "./schedule.validation";

export type RecurringPattern = 'NONE' | 'DAILY' | 'WEEKLY';
export type ScheduleStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface ISchedule {
  boatId: string;
  routeId: string;
  startDate: string; // ISO date string
  endDate?: string;  // For range creation
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  recurringPattern?: RecurringPattern;
  status?: ScheduleStatus;
}


export type IScheduleUpdate = z.infer<typeof updateScheduleZodSchema>;