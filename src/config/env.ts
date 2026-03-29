import dotenv from "dotenv";
import status from "http-status";
import AppErrors from "../app/errorHandler/AppErrors";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
  FRONTEND_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  BETTER_AUTH_TOKEN_EXPIRES_IN: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_FROM: string;
  Client_ID: string;
  Client_Secret: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEB_HOOK: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requireEnvVariables = [
    "PORT",
    "DATABASE_URL",
    "FRONTEND_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_TOKEN_EXPIRES_IN",
    "EMAIL_USER",
    "EMAIL_PASS",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_FROM",
    "Client_ID",
    "Client_Secret",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEB_HOOK",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  requireEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppErrors(
        status.INTERNAL_SERVER_ERROR,
        `Environment veriable ${variable} is require but it not set`,
      );
    }
  });

  return {
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    BETTER_AUTH_TOKEN_EXPIRES_IN: process.env
      .BETTER_AUTH_TOKEN_EXPIRES_IN as string,
    EMAIL_USER: process.env.EMAIL_USER as string,
    EMAIL_PASS: process.env.EMAIL_PASS as string,
    SMTP_HOST: process.env.SMTP_HOST as string,
    SMTP_PORT: process.env.SMTP_PORT as string,
    SMTP_FROM: process.env.SMTP_FROM as string,
    Client_ID: process.env.Client_ID as string,
    Client_Secret: process.env.Client_Secret as string,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
    STRIPE_WEB_HOOK: process.env.STRIPE_WEB_HOOK as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
  };
};

export const envVariables = loadEnvVariables();
