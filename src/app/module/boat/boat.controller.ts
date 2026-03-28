import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { boatService } from "./boat.service";
import { IRequestUser } from "../../interface/requestUser.interface";



const getAllBoats = catchAsync(async (req: Request, res: Response) => {
    const result = await boatService.getAllBoats();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Get all boat successful",
        data: result,
    });
});

const createBoat = catchAsync(async (req: Request, res: Response) => {
    const owner = req.user as IRequestUser
    const boatData = req.body;
    const result = await boatService.createBoat(owner, boatData)

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Boat created successfully",
        data: result,
    });
});

const getBoatById = catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset successful",
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
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset successful",
    });
});

const deleteBoat = catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset successful",
    });
});

const getMyBoats = catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset successful",
    });
});

const addSchedule = catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset successful",
    });
});

const checkAvailability = catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset successful",
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
    checkAvailability
}