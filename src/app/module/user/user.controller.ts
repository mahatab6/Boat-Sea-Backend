import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { userService } from "./user.service";


const getProfile = catchAsync(async (req: Request, res: Response) => {
    
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset successful",
        
    });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
   
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset successful",
        
    });
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
    
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset successful",
        
    });
});

const getMyReviews  = catchAsync(async (req: Request, res: Response) => {
    
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset successful",
        
    });
});

const getNotifications = catchAsync(async (req: Request, res: Response) => {
    
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset successful",
        
    });
});

const markNotificationRead = catchAsync(async (req: Request, res: Response) => {
    
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset successful",
        
    });
});

const deleteAccount = catchAsync(async (req: Request, res: Response) => {
    
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset successful",
        
    });
});


export const userController = {
    getProfile,
    updateProfile,
    getMyBookings,
    getMyReviews,
    getNotifications,
    markNotificationRead,
    deleteAccount
}