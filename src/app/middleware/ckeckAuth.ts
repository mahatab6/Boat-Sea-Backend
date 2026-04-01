import { NextFunction, Request, Response } from "express";
import { cookieUtils } from "../utils/cookie";
import AppErrors from "../errorHandler/AppErrors";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { envVariables } from "../../config/env";
import { jwtUtils } from "../utils/jwt";

export const checkAuth =
  (...authRole: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session_token = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      const accessToken = cookieUtils.getCookie(req, "accessToken");

      let userData: any = null;

      if (accessToken) {
        const verifyToken = jwtUtils.verifyToken(
          accessToken,
          envVariables.ACCESS_TOKEN_SECRET,
        );

        if (verifyToken.success) {
          userData = verifyToken.data;
        }
      }

      if (!userData && session_token) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: session_token,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (sessionExists?.user) {
          const { user } = sessionExists;

          if (
            user.status === UserStatus.BANNED ||
            user.status === UserStatus.SUSPENDED
          ) {
            throw new AppErrors(
              status.UNAUTHORIZED,
              "Your account is restricted.",
            );
          }

          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);

          const percentRemaining =
            ((expiresAt.getTime() - now.getTime()) /
              (expiresAt.getTime() - createdAt.getTime())) *
            100;

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
          }

          userData = user;
        }
      }

      if (!userData) {
        throw new AppErrors(
          status.UNAUTHORIZED,
          "Authentication required. Please login.",
        );
      }

      if (
        authRole.length > 0 &&
        !authRole.includes(userData.role as UserRole)
      ) {
        throw new AppErrors(
          status.FORBIDDEN,
          "You do not have permission to perform this action.",
        );
      }

      req.user = {
        id: userData.userId,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
