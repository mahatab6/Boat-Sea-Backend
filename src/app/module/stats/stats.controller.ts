import { Request, Response } from "express";
import httpStatus from "http-status";
import { statsService } from "./stats.service";
import { IRequestUser } from "../../interface/requestUser.interface";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IRequestUser;
  const result = await statsService.getDashboardStatsData(user);


  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Dashboard statistics retrieved successfully",
    data: result,
  });
});

export const statsController = {
  getDashboardStats,
};