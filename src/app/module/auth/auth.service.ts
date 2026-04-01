import status from "http-status";
import AppErrors from "../../errorHandler/AppErrors";
import { auth } from "../../lib/auth";
import { jwtUtils } from "../../utils/jwt";

import { Ilogin, Iregister } from "./auth.interface";
import { tokenUtils } from "../../utils/token";
import { prisma } from "../../lib/prisma";
import { envVariables } from "../../../config/env";
import { UserStatus } from "../../../generated/prisma/enums";

const register = async (payload: Iregister) => {
  const { name, email, password, role } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role,
    },
  });

  if (!data.user) {
    throw new AppErrors(
      status.INTERNAL_SERVER_ERROR,
      "Failed to register customer"
    );
  }

  return {
    user: data.user,
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

  if (!result.user) {
    throw new AppErrors(
      status.BAD_REQUEST,
      "Invalid OTP or email"
    );
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

  const verifyResult = jwtUtils.verifyToken(currentRefreshToken, envVariables.REFRESH_TOKEN_SECRET);

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
  await auth.api.requestPasswordReset({
    body: {
      email,
      redirectTo: `${envVariables.FRONTEND_URL}/reset-password`,
    },
  });

  return { success: true };
};

const getMe = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where:{
      id: userId
    }
  })

  return result
}

const goolgeLoginSuccess = async (session: Record<string, any>) => {

  const isCustomerExists = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if(!isCustomerExists) {
    await prisma.user.create({
      data: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
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
    refreshToken
  }
}

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
    resendVerificationEmail
};
