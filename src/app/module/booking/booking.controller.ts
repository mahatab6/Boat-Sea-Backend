import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { bookingService } from "./booking.service";
import { IQueryParams } from "../../interface/query.interface";
import AppErrors from "../../errorHandler/AppErrors";

const createBooking = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const userEmail = req.user?.email;
    const result =
      await bookingService.createBooking(
        userId as string,
        userEmail as string,
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

const getMyBookings = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
  
    const result =
      await bookingService.getMyBookings(
        userId as string,
      );

    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Get all my Booking successfully",
      data: result,
    });
  }
);

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await bookingService.getAllBookings(query as IQueryParams);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "get all booking fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});


const getBookingRequest = catchAsync(async (req: Request, res: Response) => {
  const ownerid = req.user?.id
  const query = req.query;

  if (!ownerid) {
    throw new AppErrors(status.UNAUTHORIZED, "You are not authorized!");
  }
  const result = await bookingService.getBookingRequest(query as IQueryParams, ownerid );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "get all booking request fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const cancelBooking = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const bookingId = req.params.id;

    const result = await bookingService.cancelBooking(
      userId as string,
      bookingId as string
    );

    sendResponse(res, {
      httpStatusCode: status.OK, 
      success: true,
      message: "Booking cancelled successfully",
      data: result,
    });
  }
);


export const bookingController = {
    createBooking,
    getMyBookings,
    cancelBooking,
    getAllBookings,
    getBookingRequest
}