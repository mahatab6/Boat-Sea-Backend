import { Request, Response } from "express";
import { ScheduleService } from "./schedule.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { IQueryParams } from "../../interface/query.interface";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const ownerId = req.user?.id;
  const result = await ScheduleService.createScheduleIntoDB(
    ownerId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});

const getMySchedules = catchAsync(async (req: Request, res: Response) => {
  const ownerId = req.user?.id;
  const query = req.query;
  const result = await ScheduleService.getMySchedules(
    ownerId as string,
    query as IQueryParams,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Schedules fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.updateSchedule(
    req.params?.id as string,
    req.user?.id as string,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Schedule updated successfully",
    data: result,
  });
});

const availableRoute = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ScheduleService.availableRoute(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Available Route find successfully",
    data: result,
  });
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ScheduleService.deleteSchedule(id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Schedules delete successfully",
    data: result,
  });
});

export const ScheduleController = {
  createSchedule,
  getMySchedules,
  deleteSchedule,
  updateSchedule,
  availableRoute,
};
