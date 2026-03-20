import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";
import { cookieUtils } from "../../utils/cookie";
import status from "http-status";


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

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await AuthService.verifyEmail(email, otp);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Email verified successfully",
        data: result
    });

})

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refreshToken(refreshToken);

    tokenUtils.setAccessTokenCookie(res, tokens.accessToken);
    tokenUtils.setRefreshTokenCookie(res, tokens.refreshToken);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Refresh token generated",
        data: tokens,
    });
});

const logout = catchAsync(async (req: Request, res: Response) => {
    const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");
    await AuthService.logout(sessionToken);

    cookieUtils.clearCookie(res, "accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    });
    cookieUtils.clearCookie(res, "refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    });
    cookieUtils.clearCookie(res, "better-auth.session_token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    });

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Logged out successfully",
        data: { success: true },
    });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Password reset email sent',
        data: result,
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;
    const result = await AuthService.resetPassword(token as string, password);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset successful",
        data: result,
    });
});



export const AuthController = {
    registerCustomer,
    login,
    verifyEmail,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,

}