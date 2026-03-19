import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { envVariables } from "../../config/env";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import ms from "ms";
// If your Prisma file is located elsewhere, you can change the path

const parseMs = (value: string) => ms(value as import("ms").StringValue)

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
  },

  session: {
    expiresIn: parseMs(envVariables.BETTER_AUTH_TOKEN_EXPIRES_IN) / 1000,
    updateAge: ms("1d") / 1000,
    cookieCache: {
      enabled: true,
      maxAge: parseMs(envVariables.BETTER_AUTH_TOKEN_EXPIRES_IN) / 1000,
    },
  },
});
