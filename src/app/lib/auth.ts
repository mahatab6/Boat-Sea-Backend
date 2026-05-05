import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { envVariables } from "../../config/env";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import ms from "ms";
import { emailOTP, oAuthProxy } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
import { waitUntil } from "@vercel/functions";

const parseMs = (value: string) => ms(value as import("ms").StringValue);

export const auth = betterAuth({
  baseURL: envVariables.BETTER_AUTH_URL,
  secret: envVariables.BETTER_AUTH_SECRET,
  trustedOrigins: [envVariables.FRONTEND_URL],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
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
    requireEmailVerification: false,
    autoSignIn: true,

    async sendResetPassword({ user, token }) {
      const resetLink = `${envVariables.FRONTEND_URL}/reset-password/${token}`;

      waitUntil(
        sendEmail({
          to: user.email,
          subject: "Reset Your Password",
          templateName: "password-reset",
          templateData: {
            name: user.name,
            otp: token,
            resetLink,
          },
        }).catch((err) => {
          console.error("Background reset password email failed:", err);
        }),
      );
    },
    expiresIn: 5 * 60,
  },

  session: {
    expiresIn: parseMs(envVariables.BETTER_AUTH_TOKEN_EXPIRES_IN) / 1000,
    updateAge: ms("1d") / 1000,
    cookieOptions: {
      sameSite: "none",
      secure: true,
    },
    cookieCache: {
      enabled: true,
      maxAge: parseMs(envVariables.BETTER_AUTH_TOKEN_EXPIRES_IN) / 1000,
    },
  },

  cookies: {
    sessionToken: {
      name: "better-auth.session_token",
      options: {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      },
    },
  },

  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,

      async sendVerificationOTP({ email, otp, type }) {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          console.error(`User with email ${email} not found.`);
          return;
        }

        if (user.role === UserRole.SUPER_ADMIN) return;

        let subject = "Verify Your Email";
        let templateName = "otp";
        let templateData: Record<string, any> = {
          name: user.name,
          otp: otp,
        };

        if (type === "forget-password") {
          subject = "Reset Your Password";
        }

        waitUntil(
          sendEmail({
            to: email,
            subject: subject,
            templateName: templateName,
            templateData: templateData,
          }).catch((err) => {
            console.error(`Background ${type} email failed:`, err);
          }),
        );
      },
      expiresIn: 5 * 60,
      otpLength: 6,
    }),
    oAuthProxy(),
  ],

  socialProviders: {
    google: {
      clientId: envVariables.Client_ID,
      clientSecret: envVariables.Client_Secret,
      prompt: "select_account consent",
      accessType: "offline",
      mapProfileToUser: () => ({
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
        isDeleted: false,
        deletedAt: null,
      }),
    },
  },

  redirectURIs: {
    signIn: `${envVariables.BETTER_AUTH_URL}/api/v1/auth/google/success`,
  },

  advanced: {
    cookies: {
      state: {
        attributes: {
          secure: true,
          sameSite: "none",
          httpOnly: true,
          path: "/",
        },
      },
      sessionToken: {
        attributes: {
          secure: true,
          sameSite: "none",
          httpOnly: true,
          path: "/",
        },
      },
    },
  },
});
