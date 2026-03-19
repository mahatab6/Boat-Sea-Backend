import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { envVariables } from "../../config/env";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import ms from "ms";
import { emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
// If your Prisma file is located elsewhere, you can change the path

const parseMs = (value: string) => ms(value as import("ms").StringValue);

export const auth = betterAuth({
  baseURL: envVariables.BETTER_AUTH_URL,
  secret: envVariables.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.CUSTOMER,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.PENDING_VERIFICATION,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  session: {
    expiresIn: parseMs(envVariables.BETTER_AUTH_TOKEN_EXPIRES_IN) / 1000,
    updateAge: ms("1d") / 1000,
    cookieCache: {
      enabled: true,
      maxAge: parseMs(envVariables.BETTER_AUTH_TOKEN_EXPIRES_IN) / 1000,
    },
  },

  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });

          if (!user) {
            console.error(
              `User with email ${email} not found. Cannot send verification OTP.`,
            );
            return;
          }

          if (user && user.role === UserRole.SUPER_ADMIN) {
            console.log(
              `User with email ${email} is a super admin. Skipping sending verification OTP.`,
            );
            return;
          }

          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Verify Your Email",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp: otp,
              },
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });

          if (user) {
          sendEmail({
            to: email,
            subject: "Reset Your Password",
            templateName: "otp",
            templateData: {
              name: user.name,
              otp: otp,
            },
          });
        }

        };
      },
      expiresIn: 2 * 60, 
      otpLength: 6,
    }),
  ],
});
