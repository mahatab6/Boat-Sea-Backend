import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const result =
      await bookingService.createBooking(
        userId as string,
        req.body
      );

    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  }
);


export const bookingController = {
    createBooking
}