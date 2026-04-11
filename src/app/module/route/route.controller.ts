import { Request, Response } from "express";
import status from "http-status";
import { RouteService } from "./route.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { IQueryParams } from "../../interface/query.interface";

const createRoute = catchAsync(async (req: Request, res: Response) => {
   const routeData = {
    ...req.body,
    image: req.file?.path
  }
  const result = await RouteService.createRoute(routeData);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Route created successfully",
    data: result,
  });
});

const getAllRoutes = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await RouteService.getAllRoutes(query as IQueryParams);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Routes fetched successfully",
    data: result.data,
    meta: result.meta
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

   const routeData = {
    ...req.body,
    image: req.file?.path
  }
  
  const result = await RouteService.updateRoute(
    req.params.id as string,
    routeData
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