import { Schedule } from "../../../generated/prisma/client";
import { IQueryParams } from "../../interface/query.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/QueryBuilder";
import {
  scheduleFilterableFields,
  scheduleSearchableFields,
} from "./schedule.constant";
import { ISchedule, IScheduleUpdate } from "./schedule.interface";

const createScheduleIntoDB = async (ownerId: string, payload: ISchedule) => {
  const { startDate, endDate, recurringPattern, ...rest } = payload;

  const start = new Date(startDate);

  if (!recurringPattern || !endDate) {
    return await prisma.schedule.create({
      data: {
        ...rest,
        userId: ownerId,
        startDate: start,
        endDate: endDate ? new Date(endDate) : null,
      },
    });
  }

  const end = new Date(endDate);
  const schedules = [];

  let current = new Date(start);

  while (current <= end) {
    schedules.push({
      ...rest,
      startDate: new Date(current),
      userId: ownerId,
      endDate: end,
      recurringPattern: null,
    });

    // increment based on pattern
    switch (recurringPattern) {
      case "DAILY":
        current.setDate(current.getDate() + 1);
        break;

      case "WEEKLY":
        current.setDate(current.getDate() + 7);
        break;
    }
  }

  return await prisma.schedule.createMany({
    data: schedules,
  });
};

const getMySchedules = async (ownerId: string, query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<Schedule>(prisma.schedule, query, {
    searchableFields: scheduleSearchableFields,
    filterableFields: scheduleFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({ userId: ownerId })
    .paginate()
    .sort()
    .include({
      boat: {
        select: {
          boatName: true,
        },
      },
      route: {
        select: {
          name: true,
        },
      },
    })
    .execute();

  return result;
};

const updateSchedule = async (
  id: string,
  ownerId: string,
  payload: IScheduleUpdate
) => {
  const existingSchedule = await prisma.schedule.findFirst({
    where: {
      id,
      userId: ownerId,
    },
  });

  if (!existingSchedule) {
    throw new Error("Schedule not found or unauthorized");
  }

  return await prisma.schedule.update({
    where: { id },
    data: payload,
  });
};

const deleteSchedule = async (id: string) => {
  return await prisma.schedule.delete({ where: { id } });
};

export const ScheduleService = {
  createScheduleIntoDB,
  deleteSchedule,
  getMySchedules,
  updateSchedule
};
