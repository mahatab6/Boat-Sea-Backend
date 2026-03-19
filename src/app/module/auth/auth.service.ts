import status from "http-status";
import AppErrors from "../../errorHandler/AppErrors";
import { auth } from "../../lib/auth";
import { Ilogin, IregisterCustomer } from "./auth.interface";
import { tokenUtils } from "../../utils/token";
import { prisma } from "../../lib/prisma";

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

export const AuthService = {
  registerCustomer,
  login,
  verifyEmail,
};
