import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { boatService } from "./boat.service";
import { IRequestUser } from "../../interface/requestUser.interface";
import { IQueryParams } from "../../interface/query.interface";

const getAllBoats = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await boatService.getAllBoats(query as IQueryParams);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Boats fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const createBoat = catchAsync(async (req: Request, res: Response) => {
  const owner = req.user as IRequestUser;
  const boatData = req.body;
  const result = await boatService.createBoat(owner, boatData);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Boat created successfully",
    data: result,
  });
});

const getBoatById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await boatService.getBoatById(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Boat fetched successfully",
    data: result,
  });
});

const getBoatReviews = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Password reset successful",
  });
});

const updateBoat = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const ownerId = req.user?.id;

  const result = await boatService.updateBoat(
    id as string,
    req.body,
    ownerId as string,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Boat updated successfully",
    data: result,
  });
});

const deleteBoat = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const ownerId = req.user?.id;

  const result = await boatService.deleteBoat(id as string, ownerId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Boat deleted successfully",
    data: result,
  });
});

const getMyBoats = catchAsync(async (req: Request, res: Response) => {
  const ownerId = req.user?.id;
  const query = req.query;

  const result = await boatService.getMyBoats(
    ownerId as string,
    query as IQueryParams,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Your boats fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const addSchedule = catchAsync(async (req: Request, res: Response) => {
  const boatId = req.params.boatId;
  const ownerId = req.user?.id;

  const result = await boatService.addSchedule(
    boatId as string,
    ownerId as string,
    req.body
  );

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});



export const boatController = {
  getAllBoats,
  createBoat,
  getBoatById,
  getBoatReviews,
  updateBoat,
  deleteBoat,
  getMyBoats,
  addSchedule,
};
