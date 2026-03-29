import { NextFunction, Request, Response } from "express";
import { cookieUtils } from "../utils/cookie";
import AppErrors from "../errorHandler/AppErrors";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { jewUtils } from "../utils/jwt";
import { envVariables } from "../../config/env";

export const checkAuth =
  (...authRole: UserRole[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session_token = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!session_token) {
        throw new AppErrors(status.NOT_FOUND, "No session token provided");
      }

      if (session_token) {
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
      
        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;
         
          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());
          }

          if(user.role === UserStatus.BANNED || user.role === UserStatus.SUSPENDED) {
            throw new AppErrors(status.UNAUTHORIZED, "Unauthorized access! User is deleted")
          }

          if(authRole.length > 0 && !authRole.includes(user.role as UserRole)) {
            throw new AppErrors(status.FORBIDDEN, "User access Forbidded")
          }

          req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as UserRole
          }
        };
        

      }

       const accessToken = cookieUtils.getCookie(req, "accessToken");

        if (!accessToken) {
          throw new AppErrors(status.NOT_FOUND, "No session token provided");
        }

        const verifyToken = jewUtils.verifyToken(
          accessToken,
          envVariables.ACCESS_TOKEN_SECRET,
        );

         if (!verifyToken.success) {
          throw new AppErrors(
            status.UNAUTHORIZED,
            "Unauthorized access! Invalid access token.",
          );
        }

        if (
          authRole.length > 0 &&
          !authRole.includes(verifyToken.data!.role as UserRole)
        ) {
          throw new AppErrors(
            status.FORBIDDEN,
            "Forbidden access! You do not have permission to access this resource.",
          );
        }

        next()

    } catch (error) {
        next(error);
    }
  };
