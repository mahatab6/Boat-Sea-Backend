import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";


const registerCustomer = catchAsync( async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await AuthService.registerCustomer(payload);

    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        message: "Customer account created",
        data: {
            result
        }
    })
})




export const AuthController = {
    registerCustomer
}