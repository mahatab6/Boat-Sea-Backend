import { Request, Response } from "express";
import status from "http-status";
import { RouteService } from "./route.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createRoute = catchAsync(async (req: Request, res: Response) => {
  const result = await RouteService.createRoute(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Route created successfully",
    data: result,
  });
});

const getAllRoutes = catchAsync(async (req: Request, res: Response) => {
  const result = await RouteService.getAllRoutes();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Routes fetched successfully",
    data: result,
  });
});


const getSingleRoute = catchAsync(async (req: Request, res: Response) => {
  const result = await RouteService.getSingleRoute(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Route fetched successfully",
    data: result,
  });
});

const updateRoute = catchAsync(async (req: Request, res: Response) => {
  const result = await RouteService.updateRoute(
    req.params.id as string,
    req.body
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Route updated successfully",
    data: result,
  });
});

const deleteRoute = catchAsync(async (req: Request, res: Response) => {
  const result = await RouteService.deleteRoute(req.params.id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Route deleted successfully",
    data: result,
  });
});

export const RouteController = {
createRoute,
  getAllRoutes,
  getSingleRoute,
  updateRoute,
  deleteRoute,
};