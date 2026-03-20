import status from "http-status";
import AppErrors from "../../errorHandler/AppErrors";
import { auth } from "../../lib/auth";
import { jewUtils } from "../../utils/jwt";

import { Ilogin, IregisterCustomer } from "./auth.interface";
import { tokenUtils } from "../../utils/token";
import { prisma } from "../../lib/prisma";
import { envVariables } from "../../../config/env";

const registerCustomer = async (payload: IregisterCustomer) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (!data.user) {
    throw new AppErrors(
      status.INTERNAL_SERVER_ERROR,
      "Faild to register Customar",
    );
  }

  const user = data.user;

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = tokenUtils.getAccessToken(jwtPayload);
  const refreshToken = tokenUtils.getRefreshToken(jwtPayload);

  return {
    ...data,
    token: data.token,
    accessToken,
    refreshToken,
  };
};

const login = async (payload: Ilogin) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (!data.user) {
    throw new AppErrors(
      status.INTERNAL_SERVER_ERROR,
      "Faild to register Customar",
    );
  }

  const user = data.user;

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = tokenUtils.getAccessToken(jwtPayload);
  const refreshToken = tokenUtils.getRefreshToken(jwtPayload);

  return {
    ...data,
    token: data.token,
    accessToken,
    refreshToken,
  };
};

const verifyEmail = async (email: string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });

  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        emailVerified: true,
      },
    });
  }

  return result;
};

const refreshToken = async (currentRefreshToken: string) => {
  if (!currentRefreshToken) {
    throw new AppErrors(status.BAD_REQUEST, "Refresh token is required");
  }

  const verifyResult = jewUtils.verifyToken(currentRefreshToken, envVariables.REFRESH_TOKEN_SECRET);

  if (!verifyResult.success) {
    throw new AppErrors(status.UNAUTHORIZED, "Invalid or expired refresh token");
  }

  const payload = verifyResult.data as { userId?: string; email?: string; role?: string };

  if (!payload?.userId || !payload?.email || !payload?.role) {
    throw new AppErrors(status.UNAUTHORIZED, "Invalid token payload");
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  });

  return {
    accessToken,
    refreshToken,
  };
};

const logout = async (sessionToken?: string) => {
  if (!sessionToken) {
    throw new AppErrors(status.BAD_REQUEST, "Session token is required for logout");
  }

  await prisma.session.deleteMany({
    where: {
      token: sessionToken,
    },
  });

  return {
    success: true,
  };
};

const forgotPassword = async (email: string) => {
  if (!email) {
    throw new AppErrors(status.BAD_REQUEST, "Email is required for forgot password");
  }

  const result = await auth.api.requestPasswordReset({
    body: {
      email,
      redirectTo: `${envVariables.FRONTEND_URL}/reset-password`,
    },
  });

  return result;
};

const resetPassword = async (token: string, newPassword: string) => {
  if (!token || !newPassword) {
    throw new AppErrors(status.BAD_REQUEST, "Token and new password are required");
  }

  const result = await auth.api.resetPassword({
    body: {
      token,
      newPassword,
    },
  });

  return result;
};



export const AuthService = {
  registerCustomer,
    login,
    verifyEmail,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword,
};
