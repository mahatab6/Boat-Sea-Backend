import status from "http-status";
import AppErrors from "../../errorHandler/AppErrors";
import { auth } from "../../lib/auth";
import { jwtUtils } from "../../utils/jwt";
import { Request } from "express";

import { Ilogin, Iregister } from "./auth.interface";
import { tokenUtils } from "../../utils/token";
import { prisma } from "../../lib/prisma";
import { envVariables } from "../../../config/env";
import { UserStatus } from "../../../generated/prisma/enums";
import { IchangepasswordPayload } from "./auth.validation";
import { hashPassword } from "better-auth/crypto";
import { verifyPassword } from "../../shared/password";

const register = async (payload: Iregister) => {
  let { name, email, password, role } = payload;
  
  // Normalize email to lowercase to avoid case-sensitivity issues
  email = email.toLowerCase().trim();

  try {
    const data = await auth.api.signUpEmail({
      body: { name, email, password, role },
    });

    if (!data || !data.user) {
      throw new AppErrors(status.INTERNAL_SERVER_ERROR, "Failed to register");
    }

    console.log("User created by better-auth:", {
      id: data.user.id,
      email: data.user.email,
      emailVerified: data.user.emailVerified,
      status: (data.user as any).status,
    });

    let updatedUser;
    try {
      updatedUser = await prisma.user.update({
        where: { email },
        data: {
          emailVerified: true,
          status: UserStatus.ACTIVE,
        },
      });
      console.log("User updated successfully:", {
        id: updatedUser.id,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        status: updatedUser.status,
      });
    } catch (updateError: any) {
      console.error("Error updating user status:", {
        error: updateError.message,
        code: updateError.code,
        email,
        meta: updateError.meta,
      });
      // Fallback: fetch the user from database
      const dbUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (!dbUser) {
        throw new AppErrors(
          status.INTERNAL_SERVER_ERROR,
          "Could not retrieve created user"
        );
      }
      
      updatedUser = dbUser;
    }

    const jwtPayload = {
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    };

    const accessToken = tokenUtils.getAccessToken(jwtPayload);
    const refreshToken = tokenUtils.getRefreshToken(jwtPayload);

    if (!accessToken || !refreshToken) {
      console.error("Token generation failed:", {
        accessTokenExists: !!accessToken,
        refreshTokenExists: !!refreshToken,
        payload: jwtPayload,
      });
      throw new AppErrors(
        status.INTERNAL_SERVER_ERROR,
        "Failed to generate authentication tokens"
      );
    }

    return {
      user: updatedUser,
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    console.error("Register service error:", {
      error: error.message,
      code: error.code,
      email,
    });
    throw error;
  }
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

  const isDeleted = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (isDeleted?.isDeleted) {
    throw new AppErrors(status.FORBIDDEN, "Your account is deleted");
  }

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

  if (!result.user) {
    throw new AppErrors(status.BAD_REQUEST, "Invalid OTP or email");
  }

  let user = result.user;

  if (!user.emailVerified) {
    user = await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        status: UserStatus.ACTIVE,
      },
    });
  }

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = tokenUtils.getAccessToken(jwtPayload);
  const refreshToken = tokenUtils.getRefreshToken(jwtPayload);

  return {
    user,
    accessToken,
    refreshToken,
  };
};


const refreshToken = async (currentRefreshToken: string) => {
  if (!currentRefreshToken) {
    throw new AppErrors(status.BAD_REQUEST, "Refresh token is required");
  }

  const verifyResult = jwtUtils.verifyToken(
    currentRefreshToken,
    envVariables.REFRESH_TOKEN_SECRET,
  );

  if (!verifyResult.success) {
    throw new AppErrors(
      status.UNAUTHORIZED,
      "Invalid or expired refresh token",
    );
  }

  const payload = verifyResult.data as {
    userId?: string;
    email?: string;
    role?: string;
  };

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
    throw new AppErrors(
      status.BAD_REQUEST,
      "Session token is required for logout",
    );
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
  await auth.api.requestPasswordReset({
    body: {
      email,
      redirectTo: `${envVariables.FRONTEND_URL}/reset-password`,
    },
  });

  return { success: true };
};


export const resetPassword = async (password: string, token: string) => {
  const result = await auth.api.resetPassword({
    body: {
      newPassword: password,
      token: token,
    },
  });

  if (!result) {
    throw new AppErrors(status.BAD_REQUEST, "Invalid or expired reset token");
  }

  return { success: true };
};

const getMe = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return result;
};

const goolgeLoginSuccess = async (session: Record<string, any>) => {
  const isCustomerExists = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!isCustomerExists) {
    await prisma.user.create({
      data: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    });
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
  });

  return {
    accessToken,
    refreshToken,
  };
};

const resendVerificationEmail = async (email: string) => {
  const result = await auth.api.sendVerificationEmail({
    body: {
      email,
    },
  });

  return {
    success: true,
    message: "Verification code resent successfully",
    data: result,
  };
};

export const AuthService = {
  register,
  login,
  verifyEmail,
  refreshToken,
  logout,
  forgotPassword,
  goolgeLoginSuccess,
  getMe,
  resetPassword,
  resendVerificationEmail,
};
