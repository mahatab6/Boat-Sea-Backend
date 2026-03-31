import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";
import { cookieUtils } from "../../utils/cookie";
import status from "http-status";
import AppErrors from "../../errorHandler/AppErrors";
import { envVariables } from "../../../config/env";
import { auth } from "../../lib/auth";


const register = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await AuthService.register(payload);

  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Account created successfully. Please verify your email.",
    data: result,
  });
});


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

  const { accessToken, refreshToken, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Email verified successfully",
    data: {
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

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
    const email = req.body.email?.toLowerCase().trim();
  
  if (!email) {
    throw new AppErrors(status.BAD_REQUEST, "Email is required");
  }
  await AuthService.forgotPassword(email);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "If this email exists, a reset link has been sent",
    data: null,
  });
});


const googleLogin = catchAsync(async (req: Request, res: Response) => {
    const redirectPath = req.query.redirect || "/dashboard";

    const encodedRedirectPath = encodeURIComponent(redirectPath as string);

    const callbackURL = `${envVariables.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;

    res.render("googleRedirect", { callbackURL, betterAuthUrl: envVariables.BETTER_AUTH_URL });
});

const goolgeLoginSuccess = catchAsync(async (req: Request, res: Response) => {
    const redirectPath = req.query.redirect as string || "/dashboard";
    
    const sessionToken = req.cookies["better-auth.session_token"];

    if (!sessionToken) { 
        return res.redirect(`${envVariables.FRONTEND_URL}/login?error=oauth_failed`);
    }

    const session = await auth.api.getSession({
        headers: {
            "Cookie": `better-auth.session_token=${sessionToken}`,
        },
    });

     if (!session) {
        return res.redirect(`${envVariables.FRONTEND_URL}/login?error=no_session_found`);
    }

    if (session && !session.user) {
        return res.redirect(`${envVariables.FRONTEND_URL}/login?error=oauth_failed`);
    }

    const result = await AuthService.goolgeLoginSuccess(session)

    const { accessToken, refreshToken } = result;
    
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);

    const isValidRedirect = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
    const finalRedirect = isValidRedirect ? `${envVariables.FRONTEND_URL}${redirectPath}` : envVariables.FRONTEND_URL;
    res.redirect(finalRedirect);
});

const handleAuthError = catchAsync(async (req: Request, res: Response) => {
    const error = req.query.error as string || "oauth_failed";
    res.redirect(`${envVariables.FRONTEND_URL}/login?error=${error}`);
});

const getMe = catchAsync(async (req: Request, res: Response) => {

    const userId = req.user?.id;

    const result = await AuthService.getMe(userId as string)

    sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "get your user Info",
    data: result,
  });
})



export const AuthController = {
    register,
    login,
    verifyEmail,
    refreshToken,
    logout,
    forgotPassword,
    googleLogin,
    goolgeLoginSuccess,
    handleAuthError,
    getMe
}