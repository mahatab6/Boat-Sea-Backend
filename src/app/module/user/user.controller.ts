import { Request, Response } from "express";
import status from "http-status";

import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { userService } from "./user.service";

const getProfile = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userService.getProfile(
      req.user?.id as string
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Profile fetched successfully",
      data: result,
    });
  }
);

const updateProfile = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userService.updateProfile(
      req.user?.id as string,
      req.body
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  }
);

const getMyBookings = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userService.getMyBookings(
      req.user?.id as string
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Bookings fetched successfully",
      data: result,
    });
  }
);

const getMyReviews = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userService.getMyReviews(
      req.user?.id as string
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Reviews fetched successfully",
      data: result,
    });
  }
);

const getNotifications = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await userService.getNotifications(req.user?.id as string);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Notifications fetched successfully",
      data: result,
    });
  }
);

const markNotificationRead = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await userService.markNotificationRead(
        req.params.id as string,
        req.user?.id as string
      );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Notification marked as read",
      data: result,
    });
  }
);

const deleteAccount = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userService.deleteAccount(
      req.user?.id as string
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Account deleted successfully",
      data: result,
    });
  }
);

export const userController = {
  getProfile,
  updateProfile,
  getMyBookings,
  getMyReviews,
  getNotifications,
  markNotificationRead,
  deleteAccount,
};