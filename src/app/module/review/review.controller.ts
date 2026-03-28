import { Request, Response } from "express";
import status from "http-status";

import { ReviewService } from "./review.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id ;

  const result = await ReviewService.createReview(
    userId as string,
    req.body
  );

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getAllReviews();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result,
  });
});

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getSingleReview(
    req.params.id as string
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Review fetched successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  
  console.log(reviewId, data)
  const result = await ReviewService.updateReview(reviewId as string, data);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.deleteReview(
    req.params.id as string
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};