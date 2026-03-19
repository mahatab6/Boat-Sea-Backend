import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";


const registerCustomer = catchAsync( async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await AuthService.registerCustomer(payload);

    const {accessToken, refreshToken, token, ...rest} = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthCookie(res, token as string);

    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        message: "Customer account created",
        data: {
            accessToken,
            refreshToken,
            token,
            ...rest
        }
    })
})

const login = catchAsync( async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await AuthService.login(payload);

    const {accessToken, refreshToken, token, ...rest} = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthCookie(res, token as string);

    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        message: "Login successfully",
        data: {
            accessToken,
            refreshToken,
            token,
            ...rest
        }
    })
})





export const AuthController = {
    registerCustomer,
    login
}