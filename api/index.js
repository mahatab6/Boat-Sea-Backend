// src/app.ts
import express8 from "express";
import cors from "cors";

// src/config/env.ts
import dotenv from "dotenv";
import status from "http-status";

// src/app/errorHandler/AppErrors.ts
var AppErrors = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppErrors_default = AppErrors;

// src/config/env.ts
dotenv.config();
var loadEnvVariables = () => {
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
    "Open_Router_Api_key",
    "OPENROUTER_EMBEDDING_MODEL",
    "OPENROUTER_LLM_MODEL",
    "Google_CallBack_URL"
  ];
  requireEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppErrors_default(
        status.INTERNAL_SERVER_ERROR,
        `Environment veriable ${variable} is require but it not set`
      );
    }
  });
  return {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_TOKEN_EXPIRES_IN,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_FROM: process.env.SMTP_FROM,
    Client_ID: process.env.Client_ID,
    Client_Secret: process.env.Client_Secret,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEB_HOOK: process.env.STRIPE_WEB_HOOK,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    Open_Router_Api_key: process.env.Open_Router_Api_key,
    OPENROUTER_EMBEDDING_MODEL: process.env.OPENROUTER_EMBEDDING_MODEL,
    OPENROUTER_LLM_MODEL: process.env.OPENROUTER_LLM_MODEL,
    Google_CallBack_URL: process.env.Google_CallBack_URL
  };
};
var envVariables = loadEnvVariables();

// src/app.ts
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.7.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String         @id\n  name          String\n  email         String\n  emailVerified Boolean        @default(false)\n  image         String?\n  createdAt     DateTime       @default(now())\n  updatedAt     DateTime       @updatedAt\n  role          String         @default("CUSTOMER")\n  status        String         @default("PENDING_VERIFICATION")\n  isDeleted     Boolean        @default(false)\n  deletedAt     DateTime?\n  sessions      Session[]\n  accounts      Account[]\n  bookings      Booking[]\n  boats         Boat[]\n  reviews       Review[]\n  notifications Notification[]\n  schedules     Schedule[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Boat {\n  id                 String     @id @default(uuid())\n  boatName           String     @db.VarChar(150)\n  boatType           BoatType\n  status             BoatStatus\n  primary_img        String?\n  capacity           Int\n  ownerId            String\n  owner              User       @relation(fields: [ownerId], references: [id])\n  boatCondition      String\n  location           String\n  pricePerTrip       Int\n  description        String\n  width              Float\n  length             Float\n  engineCapacity     Int\n  manufacturer       String\n  manufacturingYear  Int\n  specifications     String\n  amenities          String[]\n  cancellationPolicy String\n  rating             Float      @default(0)\n  totalReviews       Int        @default(0)\n  isApproved         Boolean    @default(false)\n  createdAt          DateTime   @default(now())\n  updatedAt          DateTime   @updatedAt\n\n  schedules   Schedule[]\n  bookings    Booking[]\n  reviews     Review[]\n  license     License?\n  boat_images Boat_Images[]\n}\n\nmodel Boat_Images {\n  id     String @id @default(uuid(7))\n  boatId String @unique\n\n  imageUrl   String[]\n  isPrimary  Boolean\n  caption    String?\n  uploadedAt DateTime\n  boat       Boat     @relation(fields: [boatId], references: [id])\n}\n\nmodel Booking {\n  id            String @id @default(uuid())\n  bookingNumber String @unique\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  scheduleId String\n  schedule   Schedule @relation(fields: [scheduleId], references: [id])\n\n  boatId String\n  boat   Boat   @relation(fields: [boatId], references: [id])\n\n  totalGuests Int\n  totalAmount Float\n\n  bookingStatus BookingStatus @default(PENDING)\n  paymentStatus PaymentStatus @default(PENDING)\n\n  bookingDate      DateTime @default(now())\n  tripDate         DateTime\n  passengerDetails Json\n\n  specialRequests    String?\n  cancellationDate   DateTime?\n  cancellationReason String?\n  emergencyContact   String?\n  isInsured          Boolean   @default(false)\n\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n  payments  Payments[]\n  tickets   Ticket[]\n  seats     Seat[]\n}\n\nenum BoatType {\n  SPEEDBOAT\n  FERRY\n  LAUNCH\n  PRIVATE\n  YACHT\n  Speedboat\n  CATAMARAN\n}\n\nenum BoatStatus {\n  AVAILABLE\n  UNAVAILABLE\n  MAINTENANCE\n  SUSPENDED\n  Booked\n}\n\nenum VerificationStatus {\n  PENDING\n  UNDER_REVIEW\n  APPROVED\n  REJECTED\n  EXPIRED\n  SUSPENDED\n}\n\nenum UserRole {\n  CUSTOMER\n  BOAT_OWNER\n  ADMIN\n  SUPER_ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n  SUSPENDED\n  BANNED\n  PENDING_VERIFICATION\n}\n\nenum BookingStatus {\n  PENDING\n  CONFIRMED\n  CANCELLED\n  COMPLETED\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  REFUNDED\n  UNPAID\n}\n\nenum ScheduleStatus {\n  UPCOMING\n  ONGOING\n  COMPLETED\n  CANCELLED\n}\n\nenum RecurringPattern {\n  DAILY\n  WEEKLY\n  MONTHLY\n}\n\nenum RouteDifficulty {\n  EASY\n  MODERATE\n  HARD\n}\n\nenum Gender {\n  MALE\n  FEMALE\n  CHILD\n}\n\nenum TicketStatus {\n  VALID\n  USED\n  CANCELLED\n}\n\nmodel License {\n  id     String @id @default(uuid(7))\n  userId String\n  boatId String @unique\n\n  licenseType        String\n  licenseNumber      String\n  registrationNumber String @unique\n\n  issueDate  DateTime\n  expiryDate DateTime\n\n  documentUrl        String[]\n  verificationStatus VerificationStatus\n  verifiedAt         DateTime\n  isVerified         Boolean\n\n  boat Boat @relation(fields: [boatId], references: [id])\n}\n\nmodel Notification {\n  id        String    @id @default(uuid(7))\n  userId    String\n  user      User      @relation(fields: [userId], references: [id])\n  title     String\n  message   String\n  isRead    Boolean   @default(false)\n  createdAt DateTime  @default(now())\n  readAt    DateTime?\n}\n\nmodel Payments {\n  id             String        @id @default(uuid(7))\n  bookingId      String\n  booking        Booking       @relation(fields: [bookingId], references: [id])\n  stripeEventId  String?       @unique\n  amount         Decimal\n  currency       String        @default("USD")\n  paymentMethod  String\n  transactionId  String        @unique\n  paymentStatus  PaymentStatus @default(PENDING)\n  paymentDate    DateTime?\n  paymentDetails String?       @db.Text\n  refundId       String?\n  refundDate     DateTime?\n  createdAt      DateTime      @default(now())\n}\n\nmodel DocumentEmbedding {\n  id Int @id @default(autoincrement())\n\n  chunkKey    String  @unique\n  chunkIndex  Int\n  sourceType  String\n  sourceId    String\n  sourceLabel String?\n\n  content    String\n  tokenCount Int?\n\n  metadata Json?\n\n  embedding Unsupported("vector(2048)")\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([sourceType])\n  @@index([sourceId])\n}\n\nmodel Review {\n  id String @id @default(uuid(7))\n\n  userId String\n  boatId String\n\n  rating  Float\n  comment String?\n\n  images     String[]\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n  isVerified Boolean? @default(false)\n\n  boat Boat @relation(fields: [boatId], references: [id])\n  user User @relation(fields: [userId], references: [id])\n}\n\nmodel Route {\n  id String @id @default(uuid())\n\n  name String @db.VarChar(150)\n\n  difficulty RouteDifficulty @default(EASY)\n\n  duration String @db.VarChar(50)\n  distance String @db.VarChar(20)\n\n  scenicHighlights String @db.VarChar(255)\n\n  description String?\n\n  image String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  schedules Schedule[]\n}\n\nmodel Schedule {\n  id String @id @default(uuid(7))\n\n  boatId String\n  boat   Boat   @relation(fields: [boatId], references: [id])\n\n  routeId String\n  route   Route  @relation(fields: [routeId], references: [id])\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n\n  startDate DateTime\n  endDate   DateTime? //\n\n  departureTime String\n  arrivalTime   String\n\n  availableSeats   Int\n  status           ScheduleStatus    @default(UPCOMING)\n  recurringPattern RecurringPattern?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  bookings Booking[]\n  seats    Seat[]\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Seat {\n  id            String   @id @default(uuid(7))\n  scheduleId    String\n  schedule      Schedule @relation(fields: [scheduleId], references: [id])\n  totalGuests   Int\n  isAvailable   Boolean  @default(true)\n  passengerInfo Gender?\n  price         Decimal?\n\n  // Seat ti kon booking er under e ache\n  bookingId String?\n  booking   Booking? @relation(fields: [bookingId], references: [id])\n\n  @@unique([scheduleId, totalGuests]) // Ek schedule e seat double hobe na\n}\n\nmodel Ticket {\n  id        String  @id @default(uuid(7))\n  bookingId String\n  booking   Booking @relation(fields: [bookingId], references: [id])\n\n  seatId String @unique\n\n  ticketNumber String       @unique\n  qrCode       String?\n  issueDate    DateTime     @default(now())\n  status       TicketStatus @default(VALID)\n  isScanned    Boolean      @default(false)\n  scannedAt    DateTime?\n  scannedBy    String?\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToUser"},{"name":"boats","kind":"object","type":"Boat","relationName":"BoatToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"ScheduleToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Boat":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"boatName","kind":"scalar","type":"String"},{"name":"boatType","kind":"enum","type":"BoatType"},{"name":"status","kind":"enum","type":"BoatStatus"},{"name":"primary_img","kind":"scalar","type":"String"},{"name":"capacity","kind":"scalar","type":"Int"},{"name":"ownerId","kind":"scalar","type":"String"},{"name":"owner","kind":"object","type":"User","relationName":"BoatToUser"},{"name":"boatCondition","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"pricePerTrip","kind":"scalar","type":"Int"},{"name":"description","kind":"scalar","type":"String"},{"name":"width","kind":"scalar","type":"Float"},{"name":"length","kind":"scalar","type":"Float"},{"name":"engineCapacity","kind":"scalar","type":"Int"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"manufacturingYear","kind":"scalar","type":"Int"},{"name":"specifications","kind":"scalar","type":"String"},{"name":"amenities","kind":"scalar","type":"String"},{"name":"cancellationPolicy","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"isApproved","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"BoatToSchedule"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BoatToBooking"},{"name":"reviews","kind":"object","type":"Review","relationName":"BoatToReview"},{"name":"license","kind":"object","type":"License","relationName":"BoatToLicense"},{"name":"boat_images","kind":"object","type":"Boat_Images","relationName":"BoatToBoat_Images"}],"dbName":null},"Boat_Images":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"boatId","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"isPrimary","kind":"scalar","type":"Boolean"},{"name":"caption","kind":"scalar","type":"String"},{"name":"uploadedAt","kind":"scalar","type":"DateTime"},{"name":"boat","kind":"object","type":"Boat","relationName":"BoatToBoat_Images"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingNumber","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"BookingToUser"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"BookingToSchedule"},{"name":"boatId","kind":"scalar","type":"String"},{"name":"boat","kind":"object","type":"Boat","relationName":"BoatToBooking"},{"name":"totalGuests","kind":"scalar","type":"Int"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"bookingStatus","kind":"enum","type":"BookingStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"bookingDate","kind":"scalar","type":"DateTime"},{"name":"tripDate","kind":"scalar","type":"DateTime"},{"name":"passengerDetails","kind":"scalar","type":"Json"},{"name":"specialRequests","kind":"scalar","type":"String"},{"name":"cancellationDate","kind":"scalar","type":"DateTime"},{"name":"cancellationReason","kind":"scalar","type":"String"},{"name":"emergencyContact","kind":"scalar","type":"String"},{"name":"isInsured","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"payments","kind":"object","type":"Payments","relationName":"BookingToPayments"},{"name":"tickets","kind":"object","type":"Ticket","relationName":"BookingToTicket"},{"name":"seats","kind":"object","type":"Seat","relationName":"BookingToSeat"}],"dbName":null},"License":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"boatId","kind":"scalar","type":"String"},{"name":"licenseType","kind":"scalar","type":"String"},{"name":"licenseNumber","kind":"scalar","type":"String"},{"name":"registrationNumber","kind":"scalar","type":"String"},{"name":"issueDate","kind":"scalar","type":"DateTime"},{"name":"expiryDate","kind":"scalar","type":"DateTime"},{"name":"documentUrl","kind":"scalar","type":"String"},{"name":"verificationStatus","kind":"enum","type":"VerificationStatus"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"boat","kind":"object","type":"Boat","relationName":"BoatToLicense"}],"dbName":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"title","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"readAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Payments":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayments"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"paymentMethod","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"paymentDate","kind":"scalar","type":"DateTime"},{"name":"paymentDetails","kind":"scalar","type":"String"},{"name":"refundId","kind":"scalar","type":"String"},{"name":"refundDate","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"DocumentEmbedding":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"chunkKey","kind":"scalar","type":"String"},{"name":"chunkIndex","kind":"scalar","type":"Int"},{"name":"sourceType","kind":"scalar","type":"String"},{"name":"sourceId","kind":"scalar","type":"String"},{"name":"sourceLabel","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"tokenCount","kind":"scalar","type":"Int"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"boatId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"comment","kind":"scalar","type":"String"},{"name":"images","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"boat","kind":"object","type":"Boat","relationName":"BoatToReview"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"}],"dbName":null},"Route":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"difficulty","kind":"enum","type":"RouteDifficulty"},{"name":"duration","kind":"scalar","type":"String"},{"name":"distance","kind":"scalar","type":"String"},{"name":"scenicHighlights","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"schedules","kind":"object","type":"Schedule","relationName":"RouteToSchedule"}],"dbName":null},"Schedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"boatId","kind":"scalar","type":"String"},{"name":"boat","kind":"object","type":"Boat","relationName":"BoatToSchedule"},{"name":"routeId","kind":"scalar","type":"String"},{"name":"route","kind":"object","type":"Route","relationName":"RouteToSchedule"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ScheduleToUser"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"departureTime","kind":"scalar","type":"String"},{"name":"arrivalTime","kind":"scalar","type":"String"},{"name":"availableSeats","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"ScheduleStatus"},{"name":"recurringPattern","kind":"enum","type":"RecurringPattern"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToSchedule"},{"name":"seats","kind":"object","type":"Seat","relationName":"ScheduleToSeat"}],"dbName":null},"Seat":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"schedule","kind":"object","type":"Schedule","relationName":"ScheduleToSeat"},{"name":"totalGuests","kind":"scalar","type":"Int"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"passengerInfo","kind":"enum","type":"Gender"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToSeat"}],"dbName":null},"Ticket":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToTicket"},{"name":"seatId","kind":"scalar","type":"String"},{"name":"ticketNumber","kind":"scalar","type":"String"},{"name":"qrCode","kind":"scalar","type":"String"},{"name":"issueDate","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"TicketStatus"},{"name":"isScanned","kind":"scalar","type":"Boolean"},{"name":"scannedAt","kind":"scalar","type":"DateTime"},{"name":"scannedBy","kind":"scalar","type":"String"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","owner","schedules","bookings","boat","reviews","license","boat_images","_count","route","schedule","booking","seats","payments","tickets","boats","notifications","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Boat.findUnique","Boat.findUniqueOrThrow","Boat.findFirst","Boat.findFirstOrThrow","Boat.findMany","Boat.createOne","Boat.createMany","Boat.createManyAndReturn","Boat.updateOne","Boat.updateMany","Boat.updateManyAndReturn","Boat.upsertOne","Boat.deleteOne","Boat.deleteMany","_avg","_sum","Boat.groupBy","Boat.aggregate","Boat_Images.findUnique","Boat_Images.findUniqueOrThrow","Boat_Images.findFirst","Boat_Images.findFirstOrThrow","Boat_Images.findMany","Boat_Images.createOne","Boat_Images.createMany","Boat_Images.createManyAndReturn","Boat_Images.updateOne","Boat_Images.updateMany","Boat_Images.updateManyAndReturn","Boat_Images.upsertOne","Boat_Images.deleteOne","Boat_Images.deleteMany","Boat_Images.groupBy","Boat_Images.aggregate","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","Booking.groupBy","Booking.aggregate","License.findUnique","License.findUniqueOrThrow","License.findFirst","License.findFirstOrThrow","License.findMany","License.createOne","License.createMany","License.createManyAndReturn","License.updateOne","License.updateMany","License.updateManyAndReturn","License.upsertOne","License.deleteOne","License.deleteMany","License.groupBy","License.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Payments.findUnique","Payments.findUniqueOrThrow","Payments.findFirst","Payments.findFirstOrThrow","Payments.findMany","Payments.createOne","Payments.createMany","Payments.createManyAndReturn","Payments.updateOne","Payments.updateMany","Payments.updateManyAndReturn","Payments.upsertOne","Payments.deleteOne","Payments.deleteMany","Payments.groupBy","Payments.aggregate","DocumentEmbedding.findUnique","DocumentEmbedding.findUniqueOrThrow","DocumentEmbedding.findFirst","DocumentEmbedding.findFirstOrThrow","DocumentEmbedding.findMany","DocumentEmbedding.updateOne","DocumentEmbedding.updateMany","DocumentEmbedding.updateManyAndReturn","DocumentEmbedding.deleteOne","DocumentEmbedding.deleteMany","DocumentEmbedding.groupBy","DocumentEmbedding.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Route.findUnique","Route.findUniqueOrThrow","Route.findFirst","Route.findFirstOrThrow","Route.findMany","Route.createOne","Route.createMany","Route.createManyAndReturn","Route.updateOne","Route.updateMany","Route.updateManyAndReturn","Route.upsertOne","Route.deleteOne","Route.deleteMany","Route.groupBy","Route.aggregate","Schedule.findUnique","Schedule.findUniqueOrThrow","Schedule.findFirst","Schedule.findFirstOrThrow","Schedule.findMany","Schedule.createOne","Schedule.createMany","Schedule.createManyAndReturn","Schedule.updateOne","Schedule.updateMany","Schedule.updateManyAndReturn","Schedule.upsertOne","Schedule.deleteOne","Schedule.deleteMany","Schedule.groupBy","Schedule.aggregate","Seat.findUnique","Seat.findUniqueOrThrow","Seat.findFirst","Seat.findFirstOrThrow","Seat.findMany","Seat.createOne","Seat.createMany","Seat.createManyAndReturn","Seat.updateOne","Seat.updateMany","Seat.updateManyAndReturn","Seat.upsertOne","Seat.deleteOne","Seat.deleteMany","Seat.groupBy","Seat.aggregate","Ticket.findUnique","Ticket.findUniqueOrThrow","Ticket.findFirst","Ticket.findFirstOrThrow","Ticket.findMany","Ticket.createOne","Ticket.createMany","Ticket.createManyAndReturn","Ticket.updateOne","Ticket.updateMany","Ticket.updateManyAndReturn","Ticket.upsertOne","Ticket.deleteOne","Ticket.deleteMany","Ticket.groupBy","Ticket.aggregate","AND","OR","NOT","id","bookingId","seatId","ticketNumber","qrCode","issueDate","TicketStatus","status","isScanned","scannedAt","scannedBy","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","scheduleId","totalGuests","isAvailable","Gender","passengerInfo","price","boatId","routeId","userId","startDate","endDate","departureTime","arrivalTime","availableSeats","ScheduleStatus","RecurringPattern","recurringPattern","createdAt","updatedAt","name","RouteDifficulty","difficulty","duration","distance","scenicHighlights","description","image","every","some","none","rating","comment","images","isVerified","has","hasEvery","hasSome","chunkKey","chunkIndex","sourceType","sourceId","sourceLabel","content","tokenCount","metadata","isDeleted","deletedAt","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","stripeEventId","amount","currency","paymentMethod","transactionId","PaymentStatus","paymentStatus","paymentDate","paymentDetails","refundId","refundDate","title","message","isRead","readAt","licenseType","licenseNumber","registrationNumber","expiryDate","documentUrl","VerificationStatus","verificationStatus","verifiedAt","bookingNumber","totalAmount","BookingStatus","bookingStatus","bookingDate","tripDate","passengerDetails","specialRequests","cancellationDate","cancellationReason","emergencyContact","isInsured","imageUrl","isPrimary","caption","uploadedAt","boatName","BoatType","boatType","BoatStatus","primary_img","capacity","ownerId","boatCondition","location","pricePerTrip","width","length","engineCapacity","manufacturer","manufacturingYear","specifications","amenities","cancellationPolicy","totalReviews","isApproved","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","role","scheduleId_totalGuests","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "ngiTAfwBFQQAAJcEACAFAACYBAAgBwAA4AMAIAgAAJkEACAKAACbBAAgFAAAmgQAIBUAAJwEACCaAgAAlgQAMJsCAABKABCcAgAAlgQAMJ0CAQAAAAGkAgEA3AMAIcQCQADfAwAhxQJAAN8DACHGAgEA3AMAIc0CAQDeAwAh4AIgAPIDACHhAkAA8wMAIbIDAQAAAAGzAyAA8gMAIbQDAQDcAwAhAQAAAAEAIAwDAACeBAAgmgIAAL8EADCbAgAAAwAQnAIAAL8EADCdAgEA3AMAIbsCAQDcAwAhxAJAAN8DACHFAkAA3wMAIaUDQADfAwAhrwMBANwDACGwAwEA3gMAIbEDAQDeAwAhAwMAAKsHACCwAwAAwAQAILEDAADABAAgDAMAAJ4EACCaAgAAvwQAMJsCAAADABCcAgAAvwQAMJ0CAQAAAAG7AgEA3AMAIcQCQADfAwAhxQJAAN8DACGlA0AA3wMAIa8DAQAAAAGwAwEA3gMAIbEDAQDeAwAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAACeBAAgmgIAAL4EADCbAgAABwAQnAIAAL4EADCdAgEA3AMAIbsCAQDcAwAhxAJAAN8DACHFAkAA3wMAIaYDAQDcAwAhpwMBANwDACGoAwEA3gMAIakDAQDeAwAhqgMBAN4DACGrA0AA8wMAIawDQADzAwAhrQMBAN4DACGuAwEA3gMAIQgDAACrBwAgqAMAAMAEACCpAwAAwAQAIKoDAADABAAgqwMAAMAEACCsAwAAwAQAIK0DAADABAAgrgMAAMAEACARAwAAngQAIJoCAAC-BAAwmwIAAAcAEJwCAAC-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_BQAgoAMBAMQEACGhAwIA0QQAIaIDIADIBAAhAgAAADoAIBsAAK8BACAYnQIBAMQEACGkAgAA_gWTAyLEAkAAxgQAIcUCQADGBAAhzAIBAMQEACHRAggA-gQAIY8DAQDEBAAhkQMAAP0FkQMikwMBAMUEACGUAwIA0QQAIZUDAQDEBAAhlgMBAMQEACGXAwEAxAQAIZgDAgDRBAAhmQMIAPoEACGaAwgA-gQAIZsDAgDRBAAhnAMBAMQEACGdAwIA0QQAIZ4DAQDEBAAhnwMAAP8FACCgAwEAxAQAIaEDAgDRBAAhogMgAMgEACECAAAAOAAgGwAAsQEAIAIAAAA4ACAbAACxAQAgAwAAADoAICIAAKoBACAjAACvAQAgAQAAADoAIAEAAAA4ACAGDQAA-AUAICgAAPsFACApAAD6BQAgagAA-QUAIGsAAPwFACCTAwAAwAQAIBuaAgAAigQAMJsCAAC4AQAQnAIAAIoEADCdAgEAsgMAIaQCAACMBJMDIsQCQAC0AwAhxQJAALQDACHMAgEAsgMAIdECCADiAwAhjwMBALIDACGRAwAAiwSRAyKTAwEAswMAIZQDAgDHAwAhlQMBALIDACGWAwEAsgMAIZcDAQCyAwAhmAMCAMcDACGZAwgA4gMAIZoDCADiAwAhmwMCAMcDACGcAwEAsgMAIZ0DAgDHAwAhngMBALIDACGfAwAA4wMAIKADAQCyAwAhoQMCAMcDACGiAyAAtgMAIQMAAAA4ACABAAC3AQAwJwAAuAEAIAMAAAA4ACABAAA5ADACAAA6ACABAAAAHAAgAQAAABwAIAMAAAAaACABAAAbADACAAAcACADAAAAGgAgAQAAGwAwAgAAHAAgAwAAABoAIAEAABsAMAIAABwAIAcJAAD3BQAgnQIBAAAAAbkCAQAAAAGLAwAA9gUAIIwDIAAAAAGNAwEAAAABjgNAAAAAAQEbAADAAQAgBp0CAQAAAAG5AgEAAAABiwMAAPYFACCMAyAAAAABjQMBAAAAAY4DQAAAAAEBGwAAwgEAMAEbAADCAQAwBwkAAPUFACCdAgEAxAQAIbkCAQDEBAAhiwMAAPQFACCMAyAAyAQAIY0DAQDFBAAhjgNAAMYEACECAAAAHAAgGwAAxQEAIAadAgEAxAQAIbkCAQDEBAAhiwMAAPQFACCMAyAAyAQAIY0DAQDFBAAhjgNAAMYEACECAAAAGgAgGwAAxwEAIAIAAAAaACAbAADHAQAgAwAAABwAICIAAMABACAjAADFAQAgAQAAABwAIAEAAAAaACAEDQAA8QUAICgAAPMFACApAADyBQAgjQMAAMAEACAJmgIAAIkEADCbAgAAzgEAEJwCAACJBAAwnQIBALIDACG5AgEAsgMAIYsDAADjAwAgjAMgALYDACGNAwEAswMAIY4DQAC0AwAhAwAAABoAIAEAAM0BADAnAADOAQAgAwAAABoAIAEAABsAMAIAABwAIAEAAAANACABAAAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACADAAAACwAgAQAADAAwAgAADQAgGQMAAKYFACAJAACnBQAgDwAA8AUAIBEAAKoFACASAACoBQAgEwAAqQUAIJ0CAQAAAAGzAgEAAAABtAICAAAAAbkCAQAAAAG7AgEAAAABxAJAAAAAAcUCQAAAAAHuAgAAAO4CAv8CAQAAAAGAAwgAAAABggMAAACCAwKDA0AAAAABhANAAAAAAYUDgAAAAAGGAwEAAAABhwNAAAAAAYgDAQAAAAGJAwEAAAABigMgAAAAAQEbAADWAQAgE50CAQAAAAGzAgEAAAABtAICAAAAAbkCAQAAAAG7AgEAAAABxAJAAAAAAcUCQAAAAAHuAgAAAO4CAv8CAQAAAAGAAwgAAAABggMAAACCAwKDA0AAAAABhANAAAAAAYUDgAAAAAGGAwEAAAABhwNAAAAAAYgDAQAAAAGJAwEAAAABigMgAAAAAQEbAADYAQAwARsAANgBADAZAwAA_gQAIAkAAP8EACAPAADvBQAgEQAAggUAIBIAAIAFACATAACBBQAgnQIBAMQEACGzAgEAxAQAIbQCAgDRBAAhuQIBAMQEACG7AgEAxAQAIcQCQADGBAAhxQJAAMYEACHuAgAA_ATuAiL_AgEAxAQAIYADCAD6BAAhggMAAPsEggMigwNAAMYEACGEA0AAxgQAIYUDgAAAAAGGAwEAxQQAIYcDQADJBAAhiAMBAMUEACGJAwEAxQQAIYoDIADIBAAhAgAAAA0AIBsAANsBACATnQIBAMQEACGzAgEAxAQAIbQCAgDRBAAhuQIBAMQEACG7AgEAxAQAIcQCQADGBAAhxQJAAMYEACHuAgAA_ATuAiL_AgEAxAQAIYADCAD6BAAhggMAAPsEggMigwNAAMYEACGEA0AAxgQAIYUDgAAAAAGGAwEAxQQAIYcDQADJBAAhiAMBAMUEACGJAwEAxQQAIYoDIADIBAAhAgAAAAsAIBsAAN0BACACAAAACwAgGwAA3QEAIAMAAAANACAiAADWAQAgIwAA2wEAIAEAAAANACABAAAACwAgCQ0AAOoFACAoAADtBQAgKQAA7AUAIGoAAOsFACBrAADuBQAghgMAAMAEACCHAwAAwAQAIIgDAADABAAgiQMAAMAEACAWmgIAAIMEADCbAgAA5AEAEJwCAACDBAAwnQIBALIDACGzAgEAsgMAIbQCAgDHAwAhuQIBALIDACG7AgEAsgMAIcQCQAC0AwAhxQJAALQDACHuAgAA9gPuAiL_AgEAsgMAIYADCADiAwAhggMAAIQEggMigwNAALQDACGEA0AAtAMAIYUDAACFBAAghgMBALMDACGHA0AAtwMAIYgDAQCzAwAhiQMBALMDACGKAyAAtgMAIQMAAAALACABAADjAQAwJwAA5AEAIAMAAAALACABAAAMADACAAANACAQCQAAggQAIJoCAACABAAwmwIAABgAEJwCAACABAAwnQIBAAAAAaICQADfAwAhuQIBAAAAAbsCAQDcAwAh1AIgAPIDACH3AgEA3AMAIfgCAQDcAwAh-QIBAAAAAfoCQADfAwAh-wIAAOMDACD9AgAAgQT9AiL-AkAA3wMAIQEAAADnAQAgAQAAAOcBACABCQAA6QUAIAMAAAAYACABAADqAQAwAgAA5wEAIAMAAAAYACABAADqAQAwAgAA5wEAIAMAAAAYACABAADqAQAwAgAA5wEAIA0JAADoBQAgnQIBAAAAAaICQAAAAAG5AgEAAAABuwIBAAAAAdQCIAAAAAH3AgEAAAAB-AIBAAAAAfkCAQAAAAH6AkAAAAAB-wIAAOcFACD9AgAAAP0CAv4CQAAAAAEBGwAA7gEAIAydAgEAAAABogJAAAAAAbkCAQAAAAG7AgEAAAAB1AIgAAAAAfcCAQAAAAH4AgEAAAAB-QIBAAAAAfoCQAAAAAH7AgAA5wUAIP0CAAAA_QIC_gJAAAAAAQEbAADwAQAwARsAAPABADANCQAA5gUAIJ0CAQDEBAAhogJAAMYEACG5AgEAxAQAIbsCAQDEBAAh1AIgAMgEACH3AgEAxAQAIfgCAQDEBAAh-QIBAMQEACH6AkAAxgQAIfsCAADkBQAg_QIAAOUF_QIi_gJAAMYEACECAAAA5wEAIBsAAPMBACAMnQIBAMQEACGiAkAAxgQAIbkCAQDEBAAhuwIBAMQEACHUAiAAyAQAIfcCAQDEBAAh-AIBAMQEACH5AgEAxAQAIfoCQADGBAAh-wIAAOQFACD9AgAA5QX9AiL-AkAAxgQAIQIAAAAYACAbAAD1AQAgAgAAABgAIBsAAPUBACADAAAA5wEAICIAAO4BACAjAADzAQAgAQAAAOcBACABAAAAGAAgAw0AAOEFACAoAADjBQAgKQAA4gUAIA-aAgAA_AMAMJsCAAD8AQAQnAIAAPwDADCdAgEAsgMAIaICQAC0AwAhuQIBALIDACG7AgEAsgMAIdQCIAC2AwAh9wIBALIDACH4AgEAsgMAIfkCAQCyAwAh-gJAALQDACH7AgAA4wMAIP0CAAD9A_0CIv4CQAC0AwAhAwAAABgAIAEAAPsBADAnAAD8AQAgAwAAABgAIAEAAOoBADACAADnAQAgAQAAAD8AIAEAAAA_ACADAAAAPQAgAQAAPgAwAgAAPwAgAwAAAD0AIAEAAD4AMAIAAD8AIAMAAAA9ACABAAA-ADACAAA_ACAIAwAA4AUAIJ0CAQAAAAG7AgEAAAABxAJAAAAAAfMCAQAAAAH0AgEAAAAB9QIgAAAAAfYCQAAAAAEBGwAAhAIAIAedAgEAAAABuwIBAAAAAcQCQAAAAAHzAgEAAAAB9AIBAAAAAfUCIAAAAAH2AkAAAAABARsAAIYCADABGwAAhgIAMAgDAADfBQAgnQIBAMQEACG7AgEAxAQAIcQCQADGBAAh8wIBAMQEACH0AgEAxAQAIfUCIADIBAAh9gJAAMkEACECAAAAPwAgGwAAiQIAIAedAgEAxAQAIbsCAQDEBAAhxAJAAMYEACHzAgEAxAQAIfQCAQDEBAAh9QIgAMgEACH2AkAAyQQAIQIAAAA9ACAbAACLAgAgAgAAAD0AIBsAAIsCACADAAAAPwAgIgAAhAIAICMAAIkCACABAAAAPwAgAQAAAD0AIAQNAADcBQAgKAAA3gUAICkAAN0FACD2AgAAwAQAIAqaAgAA-wMAMJsCAACSAgAQnAIAAPsDADCdAgEAsgMAIbsCAQCyAwAhxAJAALQDACHzAgEAsgMAIfQCAQCyAwAh9QIgALYDACH2AkAAtwMAIQMAAAA9ACABAACRAgAwJwAAkgIAIAMAAAA9ACABAAA-ADACAAA_ACABAAAALgAgAQAAAC4AIAMAAAAsACABAAAtADACAAAuACADAAAALAAgAQAALQAwAgAALgAgAwAAACwAIAEAAC0AMAIAAC4AIA4QAADbBQAgnQIBAAAAAZ4CAQAAAAHEAkAAAAAB6AIBAAAAAekCEAAAAAHqAgEAAAAB6wIBAAAAAewCAQAAAAHuAgAAAO4CAu8CQAAAAAHwAgEAAAAB8QIBAAAAAfICQAAAAAEBGwAAmgIAIA2dAgEAAAABngIBAAAAAcQCQAAAAAHoAgEAAAAB6QIQAAAAAeoCAQAAAAHrAgEAAAAB7AIBAAAAAe4CAAAA7gIC7wJAAAAAAfACAQAAAAHxAgEAAAAB8gJAAAAAAQEbAACcAgAwARsAAJwCADAOEAAA2gUAIJ0CAQDEBAAhngIBAMQEACHEAkAAxgQAIegCAQDFBAAh6QIQAKIFACHqAgEAxAQAIesCAQDEBAAh7AIBAMQEACHuAgAA_ATuAiLvAkAAyQQAIfACAQDFBAAh8QIBAMUEACHyAkAAyQQAIQIAAAAuACAbAACfAgAgDZ0CAQDEBAAhngIBAMQEACHEAkAAxgQAIegCAQDFBAAh6QIQAKIFACHqAgEAxAQAIesCAQDEBAAh7AIBAMQEACHuAgAA_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_AgEAxAQAIcACAgDRBAAhwwIAAN4EwwIjxAJAAMYEACHFAkAAxgQAIQIAAAAPACAbAAD5AgAgAgAAAA8AIBsAAPkCACADAAAAEQAgIgAA8gIAICMAAPcCACABAAAAEQAgAQAAAA8AIAcNAADYBAAgKAAA2wQAICkAANoEACBqAADZBAAgawAA3AQAIL0CAADABAAgwwIAAMAEACAQmgIAANADADCbAgAAgAMAEJwCAADQAwAwnQIBALIDACGkAgAA0QPCAiK5AgEAsgMAIboCAQCyAwAhuwIBALIDACG8AkAAtAMAIb0CQAC3AwAhvgIBALIDACG_AgEAsgMAIcACAgDHAwAhwwIAANIDwwIjxAJAALQDACHFAkAAtAMAIQMAAAAPACABAAD_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-gMAICkAAPoDACBqAAD6AwAgawAA-gMAIKgCEAAAAAGpAhAAAAAEqgIQAAAABKsCEAAAAAGsAhAAAAABrQIQAAAAAa4CEAAAAAGvAhAA-QMAIQcNAAC8AwAgKAAA-AMAICkAAPgDACCoAgAAAO4CAqkCAAAA7gIIqgIAAADuAgivAgAA9wPuAiIHDQAAvAMAICgAAPgDACApAAD4AwAgqAIAAADuAgKpAgAAAO4CCKoCAAAA7gIIrwIAAPcD7gIiBKgCAAAA7gICqQIAAADuAgiqAgAAAO4CCK8CAAD4A-4CIg0NAAC8AwAgKAAA-gMAICkAAPoDACBqAAD6AwAgawAA-gMAIKgCEAAAAAGpAhAAAAAEqgIQAAAABKsCEAAAAAGsAhAAAAABrQIQAAAAAa4CEAAAAAGvAhAA-QMAIQioAhAAAAABqQIQAAAABKoCEAAAAASrAhAAAAABrAIQAAAAAa0CEAAAAAGuAhAAAAABrwIQAPoDACEKmgIAAPsDADCbAgAAkgIAEJwCAAD7AwAwnQIBALIDACG7AgEAsgMAIcQCQAC0AwAh8wIBALIDACH0AgEAsgMAIfUCIAC2AwAh9gJAALcDACEPmgIAAPwDADCbAgAA_AEAEJwCAAD8AwAwnQIBALIDACGiAkAAtAMAIbkCAQCyAwAhuwIBALIDACHUAiAAtgMAIfcCAQCyAwAh-AIBALIDACH5AgEAsgMAIfoCQAC0AwAh-wIAAOMDACD9AgAA_QP9AiL-AkAAtAMAIQcNAAC8AwAgKAAA_wMAICkAAP8DACCoAgAAAP0CAqkCAAAA_QIIqgIAAAD9AgivAgAA_gP9AiIHDQAAvAMAICgAAP8DACApAAD_AwAgqAIAAAD9AgKpAgAAAP0CCKoCAAAA_QIIrwIAAP4D_QIiBKgCAAAA_QICqQIAAAD9AgiqAgAAAP0CCK8CAAD_A_0CIhAJAACCBAAgmgIAAIAEADCbAgAAGAAQnAIAAIAEADCdAgEA3AMAIaICQADfAwAhuQIBANwDACG7AgEA3AMAIdQCIADyAwAh9wIBANwDACH4AgEA3AMAIfkCAQDcAwAh-gJAAN8DACH7AgAA4wMAIP0CAACBBP0CIv4CQADfAwAhBKgCAAAA_QICqQIAAAD9AgiqAgAAAP0CCK8CAAD_A_0CIiMGAACeBAAgBwAA4AMAIAgAAJkEACAKAACbBAAgCwAAowQAIAwAAKQEACCaAgAAnwQAMJsCAAA4ABCcAgAAnwQAMJ0CAQDcAwAhpAIAAKEEkwMixAJAAN8DACHFAkAA3wMAIcwCAQDcAwAh0QIIAKIEACGPAwEA3AMAIZEDAACgBJEDIpMDAQDeAwAhlAMCAO8DACGVAwEA3AMAIZYDAQDcAwAhlwMBANwDACGYAwIA7wMAIZkDCACiBAAhmgMIAKIEACGbAwIA7wMAIZwDAQDcAwAhnQMCAO8DACGeAwEA3AMAIZ8DAADjAwAgoAMBANwDACGhAwIA7wMAIaIDIADyAwAhtgMAADgAILcDAAA4ACAWmgIAAIMEADCbAgAA5AEAEJwCAACDBAAwnQIBALIDACGzAgEAsgMAIbQCAgDHAwAhuQIBALIDACG7AgEAsgMAIcQCQAC0AwAhxQJAALQDACHuAgAA9gPuAiL_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_AgEA3AMAIYADCACiBAAhggMAALoEggMigwNAAN8DACGEA0AA3wMAIYUDAAC7BAAghgMBAN4DACGHA0AA8wMAIYgDAQDeAwAhiQMBAN4DACGKAyAA8gMAIQSoAgAAAIIDAqkCAAAAggMIqgIAAACCAwivAgAAiASCAyIMqAKAAAAAAasCgAAAAAGsAoAAAAABrQKAAAAAAa4CgAAAAAGvAoAAAAAB4gIBAAAAAeMCAQAAAAHkAgEAAAAB5QKAAAAAAeYCgAAAAAHnAoAAAAABA84CAAAsACDPAgAALAAg0AIAACwAIAPOAgAAMAAgzwIAADAAINACAAAwACARAwAAngQAIJoCAAC-BAAwmwIAAAcAEJwCAAC-BAAwnQIBANwDACG7AgEA3AMAIcQCQADfAwAhxQJAAN8DACGmAwEA3AMAIacDAQDcAwAhqAMBAN4DACGpAwEA3gMAIaoDAQDeAwAhqwNAAPMDACGsA0AA8wMAIa0DAQDeAwAhrgMBAN4DACEMAwAAngQAIJoCAAC_BAAwmwIAAAMAEJwCAAC_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_wIBAAAAAYADCACiBAAhggMAALoEggMigwNAAN8DACGEA0AA3wMAIYUDAAC7BAAghgMBAN4DACGHA0AA8wMAIYgDAQDeAwAhiQMBAN4DACGKAyAA8gMAIQIAAAANACAbAAD9BAAgAgAAAPgEACAbAAD5BAAgFpoCAAD3BAAwmwIAAPgEABCcAgAA9wQAMJ0CAQDcAwAhswIBANwDACG0AgIA7wMAIbkCAQDcAwAhuwIBANwDACHEAkAA3wMAIcUCQADfAwAh7gIAAKoE7gIi_wIBANwDACGAAwgAogQAIYIDAAC6BIIDIoMDQADfAwAhhANAAN8DACGFAwAAuwQAIIYDAQDeAwAhhwNAAPMDACGIAwEA3gMAIYkDAQDeAwAhigMgAPIDACEWmgIAAPcEADCbAgAA-AQAEJwCAAD3BAAwnQIBANwDACGzAgEA3AMAIbQCAgDvAwAhuQIBANwDACG7AgEA3AMAIcQCQADfAwAhxQJAAN8DACHuAgAAqgTuAiL_AgEA3AMAIYADCACiBAAhggMAALoEggMigwNAAN8DACGEA0AA3wMAIYUDAAC7BAAghgMBAN4DACGHA0AA8wMAIYgDAQDeAwAhiQMBAN4DACGKAyAA8gMAIRKdAgEAxAQAIbQCAgDRBAAhuQIBAMQEACG7AgEAxAQAIcQCQADGBAAhxQJAAMYEACHuAgAA_ATuAiL_AgEAxAQAIYADCAD6BAAhggMAAPsEggMigwNAAMYEACGEA0AAxgQAIYUDgAAAAAGGAwEAxQQAIYcDQADJBAAhiAMBAMUEACGJAwEAxQQAIYoDIADIBAAhBbsDCAAAAAHCAwgAAAABwwMIAAAAAcQDCAAAAAHFAwgAAAABAbsDAAAAggMCAbsDAAAA7gICFwMAAP4EACAJAAD_BAAgEQAAggUAIBIAAIAFACATAACBBQAgnQIBAMQEACG0AgIA0QQAIbkCAQDEBAAhuwIBAMQEACHEAkAAxgQAIcUCQADGBAAh7gIAAPwE7gIi_wIBAMQEACGAAwgA-gQAIYIDAAD7BIIDIoMDQADGBAAhhANAAMYEACGFA4AAAAABhgMBAMUEACGHA0AAyQQAIYgDAQDFBAAhiQMBAMUEACGKAyAAyAQAIQUiAAD6BwAgIwAAgwgAILgDAAD7BwAguQMAAIIIACC-AwAAAQAgBSIAAPgHACAjAACACAAguAMAAPkHACC5AwAA_wcAIL4DAAA6ACALIgAAmAUAMCMAAJ0FADC4AwAAmQUAMLkDAACaBQAwugMAAJsFACC7AwAAnAUAMLwDAACcBQAwvQMAAJwFADC-AwAAnAUAML8DAACeBQAwwAMAAJ8FADALIgAAjAUAMCMAAJEFADC4AwAAjQUAMLkDAACOBQAwugMAAI8FACC7AwAAkAUAMLwDAACQBQAwvQMAAJAFADC-AwAAkAUAML8DAACSBQAwwAMAAJMFADALIgAAgwUAMCMAAIcFADC4AwAAhAUAMLkDAACFBQAwugMAAIYFACC7AwAA6AQAMLwDAADoBAAwvQMAAOgEADC-AwAA6AQAML8DAACIBQAwwAMAAOsEADAHDwAA1gQAIJ0CAQAAAAGzAgEAAAABtAICAAAAAbUCIAAAAAG3AgAAALcCA7gCEAAAAAECAAAAJwAgIgAAiwUAIAMAAAAnACAiAACLBQAgIwAAigUAIAEbAAD-BwAwAgAAACcAIBsAAIoFACACAAAA7AQAIBsAAIkFACAGnQIBAMQEACGzAgEAxAQAIbQCAgDRBAAhtQIgAMgEACG3AgAA0gS3AiO4AhAA0wQAIQcPAADUBAAgnQIBAMQEACGzAgEAxAQAIbQCAgDRBAAhtQIgAMgEACG3AgAA0gS3AiO4AhAA0wQAIQcPAADWBAAgnQIBAAAAAbMCAQAAAAG0AgIAAAABtQIgAAAAAbcCAAAAtwIDuAIQAAAAAQmdAgEAAAABnwIBAAAAAaACAQAAAAGhAgEAAAABogJAAAAAAaQCAAAApAICpQIgAAAAAaYCQAAAAAGnAgEAAAABAgAAADIAICIAAJcFACADAAAAMgAgIgAAlwUAICMAAJYFACABGwAA_QcAMA4QAACnBAAgmgIAAKUEADCbAgAAMAAQnAIAAKUEADCdAgEAAAABngIBANwDACGfAgEAAAABoAIBAAAAAaECAQDeAwAhogJAAN8DACGkAgAApgSkAiKlAiAA8gMAIaYCQADzAwAhpwIBAN4DACECAAAAMgAgGwAAlgUAIAIAAACUBQAgGwAAlQUAIA2aAgAAkwUAMJsCAACUBQAQnAIAAJMFADCdAgEA3AMAIZ4CAQDcAwAhnwIBANwDACGgAgEA3AMAIaECAQDeAwAhogJAAN8DACGkAgAApgSkAiKlAiAA8gMAIaYCQADzAwAhpwIBAN4DACENmgIAAJMFADCbAgAAlAUAEJwCAACTBQAwnQIBANwDACGeAgEA3AMAIZ8CAQDcAwAhoAIBANwDACGhAgEA3gMAIaICQADfAwAhpAIAAKYEpAIipQIgAPIDACGmAkAA8wMAIacCAQDeAwAhCZ0CAQDEBAAhnwIBAMQEACGgAgEAxAQAIaECAQDFBAAhogJAAMYEACGkAgAAxwSkAiKlAiAAyAQAIaYCQADJBAAhpwIBAMUEACEJnQIBAMQEACGfAgEAxAQAIaACAQDEBAAhoQIBAMUEACGiAkAAxgQAIaQCAADHBKQCIqUCIADIBAAhpgJAAMkEACGnAgEAxQQAIQmdAgEAAAABnwIBAAAAAaACAQAAAAGhAgEAAAABogJAAAAAAaQCAAAApAICpQIgAAAAAaYCQAAAAAGnAgEAAAABDJ0CAQAAAAHEAkAAAAAB6AIBAAAAAekCEAAAAAHqAgEAAAAB6wIBAAAAAewCAQAAAAHuAgAAAO4CAu8CQAAAAAHwAgEAAAAB8QIBAAAAAfICQAAAAAECAAAALgAgIgAApAUAIAMAAAAuACAiAACkBQAgIwAAowUAIAEbAAD8BwAwERAAAKcEACCaAgAAqAQAMJsCAAAsABCcAgAAqAQAMJ0CAQAAAAGeAgEA3AMAIcQCQADfAwAh6AIBAAAAAekCEACpBAAh6gIBANwDACHrAgEA3AMAIewCAQAAAAHuAgAAqgTuAiLvAkAA8wMAIfACAQDeAwAh8QIBAN4DACHyAkAA8wMAIQIAAAAuACAbAACjBQAgAgAAAKAFACAbAAChBQAgEJoCAACfBQAwmwIAAKAFABCcAgAAnwUAMJ0CAQDcAwAhngIBANwDACHEAkAA3wMAIegCAQDeAwAh6QIQAKkEACHqAgEA3AMAIesCAQDcAwAh7AIBANwDACHuAgAAqgTuAiLvAkAA8wMAIfACAQDeAwAh8QIBAN4DACHyAkAA8wMAIRCaAgAAnwUAMJsCAACgBQAQnAIAAJ8FADCdAgEA3AMAIZ4CAQDcAwAhxAJAAN8DACHoAgEA3gMAIekCEACpBAAh6gIBANwDACHrAgEA3AMAIewCAQDcAwAh7gIAAKoE7gIi7wJAAPMDACHwAgEA3gMAIfECAQDeAwAh8gJAAPMDACEMnQIBAMQEACHEAkAAxgQAIegCAQDFBAAh6QIQAKIFACHqAgEAxAQAIesCAQDEBAAh7AIBAMQEACHuAgAA_ATuAiLvAkAAyQQAIfACAQDFBAAh8QIBAMUEACHyAkAAyQQAIQW7AxAAAAABwgMQAAAAAcMDEAAAAAHEAxAAAAABxQMQAAAAAQydAgEAxAQAIcQCQADGBAAh6AIBAMUEACHpAhAAogUAIeoCAQDEBAAh6wIBAMQEACHsAgEAxAQAIe4CAAD8BO4CIu8CQADJBAAh8AIBAMUEACHxAgEAxQQAIfICQADJBAAhDJ0CAQAAAAHEAkAAAAAB6AIBAAAAAekCEAAAAAHqAgEAAAAB6wIBAAAAAewCAQAAAAHuAgAAAO4CAu8CQAAAAAHwAgEAAAAB8QIBAAAAAfICQAAAAAEXAwAApgUAIAkAAKcFACARAACqBQAgEgAAqAUAIBMAAKkFACCdAgEAAAABtAICAAAAAbkCAQAAAAG7AgEAAAABxAJAAAAAAcUCQAAAAAHuAgAAAO4CAv8CAQAAAAGAAwgAAAABggMAAACCAwKDA0AAAAABhANAAAAAAYUDgAAAAAGGAwEAAAABhwNAAAAAAYgDAQAAAAGJAwEAAAABigMgAAAAAQMiAAD6BwAguAMAAPsHACC-AwAAAQAgAyIAAPgHACC4AwAA-QcAIL4DAAA6ACAEIgAAmAUAMLgDAACZBQAwugMAAJsFACC-AwAAnAUAMAQiAACMBQAwuAMAAI0FADC6AwAAjwUAIL4DAACQBQAwBCIAAIMFADC4AwAAhAUAMLoDAACGBQAgvgMAAOgEADADIgAA9gcAILgDAAD3BwAgvgMAADoAIAMiAAD0BwAguAMAAPUHACC-AwAA1AIAIAMiAADyBwAguAMAAPMHACC-AwAAAQAgBCIAAPAEADC4AwAA8QQAMLoDAADzBAAgvgMAAPQEADAEIgAA5AQAMLgDAADlBAAwugMAAOcEACC-AwAA6AQAMAAAAAG7AwAAAMgCAgsiAAC1BQAwIwAAugUAMLgDAAC2BQAwuQMAALcFADC6AwAAuAUAILsDAAC5BQAwvAMAALkFADC9AwAAuQUAML4DAAC5BQAwvwMAALsFADDAAwAAvAUAMBADAACtBQAgCAAArgUAIAkAAKsFACARAACvBQAgnQIBAAAAAaQCAAAAwgICuQIBAAAAAbsCAQAAAAG8AkAAAAABvQJAAAAAAb4CAQAAAAG_AgEAAAABwAICAAAAAcMCAAAAwwIDxAJAAAAAAcUCQAAAAAECAAAAEQAgIgAAwAUAIAMAAAARACAiAADABQAgIwAAvwUAIAEbAADxBwAwFQMAAJ4EACAIAACZBAAgCQAAggQAIA4AALcEACARAAC4BAAgmgIAALQEADCbAgAADwAQnAIAALQEADCdAgEAAAABpAIAALUEwgIiuQIBANwDACG6AgEA3AMAIbsCAQDcAwAhvAJAAN8DACG9AkAA8wMAIb4CAQDcAwAhvwIBANwDACHAAgIA7wMAIcMCAAC2BMMCI8QCQADfAwAhxQJAAN8DACECAAAAEQAgGwAAvwUAIAIAAAC9BQAgGwAAvgUAIBCaAgAAvAUAMJsCAAC9BQAQnAIAALwFADCdAgEA3AMAIaQCAAC1BMICIrkCAQDcAwAhugIBANwDACG7AgEA3AMAIbwCQADfAwAhvQJAAPMDACG-AgEA3AMAIb8CAQDcAwAhwAICAO8DACHDAgAAtgTDAiPEAkAA3wMAIcUCQADfAwAhEJoCAAC8BQAwmwIAAL0FABCcAgAAvAUAMJ0CAQDcAwAhpAIAALUEwgIiuQIBANwDACG6AgEA3AMAIbsCAQDcAwAhvAJAAN8DACG9AkAA8wMAIb4CAQDcAwAhvwIBANwDACHAAgIA7wMAIcMCAAC2BMMCI8QCQADfAwAhxQJAAN8DACEMnQIBAMQEACGkAgAA3QTCAiK5AgEAxAQAIbsCAQDEBAAhvAJAAMYEACG9AkAAyQQAIb4CAQDEBAAhvwIBAMQEACHAAgIA0QQAIcMCAADeBMMCI8QCQADGBAAhxQJAAMYEACEQAwAA4QQAIAgAAOIEACAJAADfBAAgEQAA4wQAIJ0CAQDEBAAhpAIAAN0EwgIiuQIBAMQEACG7AgEAxAQAIbwCQADGBAAhvQJAAMkEACG-AgEAxAQAIb8CAQDEBAAhwAICANEEACHDAgAA3gTDAiPEAkAAxgQAIcUCQADGBAAhEAMAAK0FACAIAACuBQAgCQAAqwUAIBEAAK8FACCdAgEAAAABpAIAAADCAgK5AgEAAAABuwIBAAAAAbwCQAAAAAG9AkAAAAABvgIBAAAAAb8CAQAAAAHAAgIAAAABwwIAAADDAgPEAkAAAAABxQJAAAAAAQQiAAC1BQAwuAMAALYFADC6AwAAuAUAIL4DAAC5BQAwAAAAAAAAArsDAQAAAATBAwEAAAAFAbsDIAAAAAEFIgAA6QcAICMAAO8HACC4AwAA6gcAILkDAADuBwAgvgMAADoAIAUiAADnBwAgIwAA7AcAILgDAADoBwAguQMAAOsHACC-AwAAAQAgAbsDAQAAAAQDIgAA6QcAILgDAADqBwAgvgMAADoAIAMiAADnBwAguAMAAOgHACC-AwAAAQAgAAAAAAAFuwMCAAAAAcIDAgAAAAHDAwIAAAABxAMCAAAAAcUDAgAAAAEAAAAAAAUiAADiBwAgIwAA5QcAILgDAADjBwAguQMAAOQHACC-AwAADQAgAyIAAOIHACC4AwAA4wcAIL4DAAANACAAAAAFIgAA3QcAICMAAOAHACC4AwAA3gcAILkDAADfBwAgvgMAAAEAIAMiAADdBwAguAMAAN4HACC-AwAAAQAgAAAAArsDAQAAAATBAwEAAAAFAbsDAAAA_QICBSIAANgHACAjAADbBwAguAMAANkHACC5AwAA2gcAIL4DAAA6ACABuwMBAAAABAMiAADYBwAguAMAANkHACC-AwAAOgAgBwYAAKsHACAHAADCBQAgCAAApwcAIAoAAKkHACALAACsBwAgDAAArQcAIJMDAADABAAgAAAAAAAFIgAA0wcAICMAANYHACC4AwAA1AcAILkDAADVBwAgvgMAABEAIAMiAADTBwAguAMAANQHACC-AwAAEQAgAAAAArsDAQAAAATBAwEAAAAFBSIAAM4HACAjAADRBwAguAMAAM8HACC5AwAA0AcAIL4DAAA6ACABuwMBAAAABAMiAADOBwAguAMAAM8HACC-AwAAOgAgAAAAAAABuwMAAACRAwIBuwMAAACTAwICuwMBAAAABMEDAQAAAAUFIgAAxQcAICMAAMwHACC4AwAAxgcAILkDAADLBwAgvgMAAAEAIAsiAACsBgAwIwAAsAYAMLgDAACtBgAwuQMAAK4GADC6AwAArwYAILsDAAC5BQAwvAMAALkFADC9AwAAuQUAML4DAAC5BQAwvwMAALEGADDAAwAAvAUAMAsiAACjBgAwIwAApwYAMLgDAACkBgAwuQMAAKUGADC6AwAApgYAILsDAAD0BAAwvAMAAPQEADC9AwAA9AQAML4DAAD0BAAwvwMAAKgGADDAAwAA9wQAMAsiAACXBgAwIwAAnAYAMLgDAACYBgAwuQMAAJkGADC6AwAAmgYAILsDAACbBgAwvAMAAJsGADC9AwAAmwYAML4DAACbBgAwvwMAAJ0GADDAAwAAngYAMAciAACSBgAgIwAAlQYAILgDAACTBgAguQMAAJQGACC8AwAAGAAgvQMAABgAIL4DAADnAQAgCyIAAIYGADAjAACLBgAwuAMAAIcGADC5AwAAiAYAMLoDAACJBgAguwMAAIoGADC8AwAAigYAML0DAACKBgAwvgMAAIoGADC_AwAAjAYAMMADAACNBgAwBZ0CAQAAAAGLAwAA9gUAIIwDIAAAAAGNAwEAAAABjgNAAAAAAQIAAAAcACAiAACRBgAgAwAAABwAICIAAJEGACAjAACQBgAgARsAAMoHADAKCQAAggQAIJoCAACxBAAwmwIAABoAEJwCAACxBAAwnQIBAAAAAbkCAQAAAAGLAwAA4wMAIIwDIADyAwAhjQMBAN4DACGOA0AA3wMAIQIAAAAcACAbAACQBgAgAgAAAI4GACAbAACPBgAgCZoCAACNBgAwmwIAAI4GABCcAgAAjQYAMJ0CAQDcAwAhuQIBANwDACGLAwAA4wMAIIwDIADyAwAhjQMBAN4DACGOA0AA3wMAIQmaAgAAjQYAMJsCAACOBgAQnAIAAI0GADCdAgEA3AMAIbkCAQDcAwAhiwMAAOMDACCMAyAA8gMAIY0DAQDeAwAhjgNAAN8DACEFnQIBAMQEACGLAwAA9AUAIIwDIADIBAAhjQMBAMUEACGOA0AAxgQAIQWdAgEAxAQAIYsDAAD0BQAgjAMgAMgEACGNAwEAxQQAIY4DQADGBAAhBZ0CAQAAAAGLAwAA9gUAIIwDIAAAAAGNAwEAAAABjgNAAAAAAQudAgEAAAABogJAAAAAAbsCAQAAAAHUAiAAAAAB9wIBAAAAAfgCAQAAAAH5AgEAAAAB-gJAAAAAAfsCAADnBQAg_QIAAAD9AgL-AkAAAAABAgAAAOcBACAiAACSBgAgAwAAABgAICIAAJIGACAjAACWBgAgDQAAABgAIBsAAJYGACCdAgEAxAQAIaICQADGBAAhuwIBAMQEACHUAiAAyAQAIfcCAQDEBAAh-AIBAMQEACH5AgEAxAQAIfoCQADGBAAh-wIAAOQFACD9AgAA5QX9AiL-AkAAxgQAIQudAgEAxAQAIaICQADGBAAhuwIBAMQEACHUAiAAyAQAIfcCAQDEBAAh-AIBAMQEACH5AgEAxAQAIfoCQADGBAAh-wIAAOQFACD9AgAA5QX9AiL-AkAAxgQAIQkDAADOBQAgnQIBAAAAAbsCAQAAAAHEAkAAAAABxQJAAAAAAdECCAAAAAHSAgEAAAAB0wIAAMwFACDUAiAAAAABAgAAABYAICIAAKIGACADAAAAFgAgIgAAogYAICMAAKEGACABGwAAyQcAMA4DAACeBAAgCQAAggQAIJoCAACyBAAwmwIAABQAEJwCAACyBAAwnQIBAAAAAbkCAQDcAwAhuwIBANwDACHEAkAA3wMAIcUCQADfAwAh0QIIAKIEACHSAgEA3gMAIdMCAADjAwAg1AIgALMEACECAAAAFgAgGwAAoQYAIAIAAACfBgAgGwAAoAYAIAyaAgAAngYAMJsCAACfBgAQnAIAAJ4GADCdAgEA3AMAIbkCAQDcAwAhuwIBANwDACHEAkAA3wMAIcUCQADfAwAh0QIIAKIEACHSAgEA3gMAIdMCAADjAwAg1AIgALMEACEMmgIAAJ4GADCbAgAAnwYAEJwCAACeBgAwnQIBANwDACG5AgEA3AMAIbsCAQDcAwAhxAJAAN8DACHFAkAA3wMAIdECCACiBAAh0gIBAN4DACHTAgAA4wMAINQCIACzBAAhCJ0CAQDEBAAhuwIBAMQEACHEAkAAxgQAIcUCQADGBAAh0QIIAPoEACHSAgEAxQQAIdMCAADIBQAg1AIgAMkFACEJAwAAywUAIJ0CAQDEBAAhuwIBAMQEACHEAkAAxgQAIcUCQADGBAAh0QIIAPoEACHSAgEAxQQAIdMCAADIBQAg1AIgAMkFACEJAwAAzgUAIJ0CAQAAAAG7AgEAAAABxAJAAAAAAcUCQAAAAAHRAggAAAAB0gIBAAAAAdMCAADMBQAg1AIgAAAAARcDAACmBQAgDwAA8AUAIBEAAKoFACASAACoBQAgEwAAqQUAIJ0CAQAAAAGzAgEAAAABtAICAAAAAbsCAQAAAAHEAkAAAAABxQJAAAAAAe4CAAAA7gIC_wIBAAAAAYADCAAAAAGCAwAAAIIDAoMDQAAAAAGEA0AAAAABhQOAAAAAAYYDAQAAAAGHA0AAAAABiAMBAAAAAYkDAQAAAAGKAyAAAAABAgAAAA0AICIAAKsGACADAAAADQAgIgAAqwYAICMAAKoGACABGwAAyAcAMAIAAAANACAbAACqBgAgAgAAAPgEACAbAACpBgAgEp0CAQDEBAAhswIBAMQEACG0AgIA0QQAIbsCAQDEBAAhxAJAAMYEACHFAkAAxgQAIe4CAAD8BO4CIv8CAQDEBAAhgAMIAPoEACGCAwAA-wSCAyKDA0AAxgQAIYQDQADGBAAhhQOAAAAAAYYDAQDFBAAhhwNAAMkEACGIAwEAxQQAIYkDAQDFBAAhigMgAMgEACEXAwAA_gQAIA8AAO8FACARAACCBQAgEgAAgAUAIBMAAIEFACCdAgEAxAQAIbMCAQDEBAAhtAICANEEACG7AgEAxAQAIcQCQADGBAAhxQJAAMYEACHuAgAA_ATuAiL_AgEAxAQAIYADCAD6BAAhggMAAPsEggMigwNAAMYEACGEA0AAxgQAIYUDgAAAAAGGAwEAxQQAIYcDQADJBAAhiAMBAMUEACGJAwEAxQQAIYoDIADIBAAhFwMAAKYFACAPAADwBQAgEQAAqgUAIBIAAKgFACATAACpBQAgnQIBAAAAAbMCAQAAAAG0AgIAAAABuwIBAAAAAcQCQAAAAAHFAkAAAAAB7gIAAADuAgL_AgEAAAABgAMIAAAAAYIDAAAAggMCgwNAAAAAAYQDQAAAAAGFA4AAAAABhgMBAAAAAYcDQAAAAAGIAwEAAAABiQMBAAAAAYoDIAAAAAEQAwAArQUAIAgAAK4FACAOAACsBQAgEQAArwUAIJ0CAQAAAAGkAgAAAMICAroCAQAAAAG7AgEAAAABvAJAAAAAAb0CQAAAAAG-AgEAAAABvwIBAAAAAcACAgAAAAHDAgAAAMMCA8QCQAAAAAHFAkAAAAABAgAAABEAICIAALQGACADAAAAEQAgIgAAtAYAICMAALMGACABGwAAxwcAMAIAAAARACAbAACzBgAgAgAAAL0FACAbAACyBgAgDJ0CAQDEBAAhpAIAAN0EwgIiugIBAMQEACG7AgEAxAQAIbwCQADGBAAhvQJAAMkEACG-AgEAxAQAIb8CAQDEBAAhwAICANEEACHDAgAA3gTDAiPEAkAAxgQAIcUCQADGBAAhEAMAAOEEACAIAADiBAAgDgAA4AQAIBEAAOMEACCdAgEAxAQAIaQCAADdBMICIroCAQDEBAAhuwIBAMQEACG8AkAAxgQAIb0CQADJBAAhvgIBAMQEACG_AgEAxAQAIcACAgDRBAAhwwIAAN4EwwIjxAJAAMYEACHFAkAAxgQAIRADAACtBQAgCAAArgUAIA4AAKwFACARAACvBQAgnQIBAAAAAaQCAAAAwgICugIBAAAAAbsCAQAAAAG8AkAAAAABvQJAAAAAAb4CAQAAAAG_AgEAAAABwAICAAAAAcMCAAAAwwIDxAJAAAAAAcUCQAAAAAEBuwMBAAAABAMiAADFBwAguAMAAMYHACC-AwAAAQAgBCIAAKwGADC4AwAArQYAMLoDAACvBgAgvgMAALkFADAEIgAAowYAMLgDAACkBgAwugMAAKYGACC-AwAA9AQAMAQiAACXBgAwuAMAAJgGADC6AwAAmgYAIL4DAACbBgAwAyIAAJIGACC4AwAAkwYAIL4DAADnAQAgBCIAAIYGADC4AwAAhwYAMLoDAACJBgAgvgMAAIoGADAAAAAAAAAFIgAAwAcAICMAAMMHACC4AwAAwQcAILkDAADCBwAgvgMAAAEAIAMiAADABwAguAMAAMEHACC-AwAAAQAgAAAABSIAALsHACAjAAC-BwAguAMAALwHACC5AwAAvQcAIL4DAAABACADIgAAuwcAILgDAAC8BwAgvgMAAAEAIAAAAAsiAACSBwAwIwAAlwcAMLgDAACTBwAwuQMAAJQHADC6AwAAlQcAILsDAACWBwAwvAMAAJYHADC9AwAAlgcAML4DAACWBwAwvwMAAJgHADDAAwAAmQcAMAsiAACGBwAwIwAAiwcAMLgDAACHBwAwuQMAAIgHADC6AwAAiQcAILsDAACKBwAwvAMAAIoHADC9AwAAigcAML4DAACKBwAwvwMAAIwHADDAAwAAjQcAMAsiAAD9BgAwIwAAgQcAMLgDAAD-BgAwuQMAAP8GADC6AwAAgAcAILsDAAD0BAAwvAMAAPQEADC9AwAA9AQAML4DAAD0BAAwvwMAAIIHADDAAwAA9wQAMAsiAADxBgAwIwAA9gYAMLgDAADyBgAwuQMAAPMGADC6AwAA9AYAILsDAAD1BgAwvAMAAPUGADC9AwAA9QYAML4DAAD1BgAwvwMAAPcGADDAAwAA-AYAMAsiAADoBgAwIwAA7AYAMLgDAADpBgAwuQMAAOoGADC6AwAA6wYAILsDAACbBgAwvAMAAJsGADC9AwAAmwYAML4DAACbBgAwvwMAAO0GADDAAwAAngYAMAsiAADcBgAwIwAA4QYAMLgDAADdBgAwuQMAAN4GADC6AwAA3wYAILsDAADgBgAwvAMAAOAGADC9AwAA4AYAML4DAADgBgAwvwMAAOIGADDAAwAA4wYAMAsiAADTBgAwIwAA1wYAMLgDAADUBgAwuQMAANUGADC6AwAA1gYAILsDAAC5BQAwvAMAALkFADC9AwAAuQUAML4DAAC5BQAwvwMAANgGADDAAwAAvAUAMBAIAACuBQAgCQAAqwUAIA4AAKwFACARAACvBQAgnQIBAAAAAaQCAAAAwgICuQIBAAAAAboCAQAAAAG8AkAAAAABvQJAAAAAAb4CAQAAAAG_AgEAAAABwAICAAAAAcMCAAAAwwIDxAJAAAAAAcUCQAAAAAECAAAAEQAgIgAA2wYAIAMAAAARACAiAADbBgAgIwAA2gYAIAEbAAC6BwAwAgAAABEAIBsAANoGACACAAAAvQUAIBsAANkGACAMnQIBAMQEACGkAgAA3QTCAiK5AgEAxAQAIboCAQDEBAAhvAJAAMYEACG9AkAAyQQAIb4CAQDEBAAhvwIBAMQEACHAAgIA0QQAIcMCAADeBMMCI8QCQADGBAAhxQJAAMYEACEQCAAA4gQAIAkAAN8EACAOAADgBAAgEQAA4wQAIJ0CAQDEBAAhpAIAAN0EwgIiuQIBAMQEACG6AgEAxAQAIbwCQADGBAAhvQJAAMkEACG-AgEAxAQAIb8CAQDEBAAhwAICANEEACHDAgAA3gTDAiPEAkAAxgQAIcUCQADGBAAhEAgAAK4FACAJAACrBQAgDgAArAUAIBEAAK8FACCdAgEAAAABpAIAAADCAgK5AgEAAAABugIBAAAAAbwCQAAAAAG9AkAAAAABvgIBAAAAAb8CAQAAAAHAAgIAAAABwwIAAADDAgPEAkAAAAABxQJAAAAAAQadAgEAAAABxAJAAAAAAfMCAQAAAAH0AgEAAAAB9QIgAAAAAfYCQAAAAAECAAAAPwAgIgAA5wYAIAMAAAA_ACAiAADnBgAgIwAA5gYAIAEbAAC5BwAwCwMAAJ4EACCaAgAAnQQAMJsCAAA9ABCcAgAAnQQAMJ0CAQAAAAG7AgEA3AMAIcQCQADfAwAh8wIBANwDACH0AgEA3AMAIfUCIADyAwAh9gJAAPMDACECAAAAPwAgGwAA5gYAIAIAAADkBgAgGwAA5QYAIAqaAgAA4wYAMJsCAADkBgAQnAIAAOMGADCdAgEA3AMAIbsCAQDcAwAhxAJAAN8DACHzAgEA3AMAIfQCAQDcAwAh9QIgAPIDACH2AkAA8wMAIQqaAgAA4wYAMJsCAADkBgAQnAIAAOMGADCdAgEA3AMAIbsCAQDcAwAhxAJAAN8DACHzAgEA3AMAIfQCAQDcAwAh9QIgAPIDACH2AkAA8wMAIQadAgEAxAQAIcQCQADGBAAh8wIBAMQEACH0AgEAxAQAIfUCIADIBAAh9gJAAMkEACEGnQIBAMQEACHEAkAAxgQAIfMCAQDEBAAh9AIBAMQEACH1AiAAyAQAIfYCQADJBAAhBp0CAQAAAAHEAkAAAAAB8wIBAAAAAfQCAQAAAAH1AiAAAAAB9gJAAAAAAQkJAADNBQAgnQIBAAAAAbkCAQAAAAHEAkAAAAABxQJAAAAAAdECCAAAAAHSAgEAAAAB0wIAAMwFACDUAiAAAAABAgAAABYAICIAAPAGACADAAAAFgAgIgAA8AYAICMAAO8GACABGwAAuAcAMAIAAAAWACAbAADvBgAgAgAAAJ8GACAbAADuBgAgCJ0CAQDEBAAhuQIBAMQEACHEAkAAxgQAIcUCQADGBAAh0QIIAPoEACHSAgEAxQQAIdMCAADIBQAg1AIgAMkFACEJCQAAygUAIJ0CAQDEBAAhuQIBAMQEACHEAkAAxgQAIcUCQADGBAAh0QIIAPoEACHSAgEAxQQAIdMCAADIBQAg1AIgAMkFACEJCQAAzQUAIJ0CAQAAAAG5AgEAAAABxAJAAAAAAcUCQAAAAAHRAggAAAAB0gIBAAAAAdMCAADMBQAg1AIgAAAAARwHAAC3BgAgCAAAuAYAIAoAALkGACALAAC6BgAgDAAAuwYAIJ0CAQAAAAGkAgAAAJMDAsQCQAAAAAHFAkAAAAABzAIBAAAAAdECCAAAAAGPAwEAAAABkQMAAACRAwKTAwEAAAABlAMCAAAAAZYDAQAAAAGXAwEAAAABmAMCAAAAAZkDCAAAAAGaAwgAAAABmwMCAAAAAZwDAQAAAAGdAwIAAAABngMBAAAAAZ8DAAC1BgAgoAMBAAAAAaEDAgAAAAGiAyAAAAABAgAAADoAICIAAPwGACADAAAAOgAgIgAA_AYAICMAAPsGACABGwAAtwcAMCEGAACeBAAgBwAA4AMAIAgAAJkEACAKAACbBAAgCwAAowQAIAwAAKQEACCaAgAAnwQAMJsCAAA4ABCcAgAAnwQAMJ0CAQAAAAGkAgAAoQSTAyLEAkAA3wMAIcUCQADfAwAhzAIBANwDACHRAggAogQAIY8DAQDcAwAhkQMAAKAEkQMikwMBAN4DACGUAwIA7wMAIZUDAQDcAwAhlgMBANwDACGXAwEA3AMAIZgDAgDvAwAhmQMIAKIEACGaAwgAogQAIZsDAgDvAwAhnAMBANwDACGdAwIA7wMAIZ4DAQDcAwAhnwMAAOMDACCgAwEA3AMAIaEDAgDvAwAhogMgAPIDACECAAAAOgAgGwAA-wYAIAIAAAD5BgAgGwAA-gYAIBuaAgAA-AYAMJsCAAD5BgAQnAIAAPgGADCdAgEA3AMAIaQCAAChBJMDIsQCQADfAwAhxQJAAN8DACHMAgEA3AMAIdECCACiBAAhjwMBANwDACGRAwAAoASRAyKTAwEA3gMAIZQDAgDvAwAhlQMBANwDACGWAwEA3AMAIZcDAQDcAwAhmAMCAO8DACGZAwgAogQAIZoDCACiBAAhmwMCAO8DACGcAwEA3AMAIZ0DAgDvAwAhngMBANwDACGfAwAA4wMAIKADAQDcAwAhoQMCAO8DACGiAyAA8gMAIRuaAgAA-AYAMJsCAAD5BgAQnAIAAPgGADCdAgEA3AMAIaQCAAChBJMDIsQCQADfAwAhxQJAAN8DACHMAgEA3AMAIdECCACiBAAhjwMBANwDACGRAwAAoASRAyKTAwEA3gMAIZQDAgDvAwAhlQMBANwDACGWAwEA3AMAIZcDAQDcAwAhmAMCAO8DACGZAwgAogQAIZoDCACiBAAhmwMCAO8DACGcAwEA3AMAIZ0DAgDvAwAhngMBANwDACGfAwAA4wMAIKADAQDcAwAhoQMCAO8DACGiAyAA8gMAIRedAgEAxAQAIaQCAAD-BZMDIsQCQADGBAAhxQJAAMYEACHMAgEAxAQAIdECCAD6BAAhjwMBAMQEACGRAwAA_QWRAyKTAwEAxQQAIZQDAgDRBAAhlgMBAMQEACGXAwEAxAQAIZgDAgDRBAAhmQMIAPoEACGaAwgA-gQAIZsDAgDRBAAhnAMBAMQEACGdAwIA0QQAIZ4DAQDEBAAhnwMAAP8FACCgAwEAxAQAIaEDAgDRBAAhogMgAMgEACEcBwAAgQYAIAgAAIIGACAKAACDBgAgCwAAhAYAIAwAAIUGACCdAgEAxAQAIaQCAAD-BZMDIsQCQADGBAAhxQJAAMYEACHMAgEAxAQAIdECCAD6BAAhjwMBAMQEACGRAwAA_QWRAyKTAwEAxQQAIZQDAgDRBAAhlgMBAMQEACGXAwEAxAQAIZgDAgDRBAAhmQMIAPoEACGaAwgA-gQAIZsDAgDRBAAhnAMBAMQEACGdAwIA0QQAIZ4DAQDEBAAhnwMAAP8FACCgAwEAxAQAIaEDAgDRBAAhogMgAMgEACEcBwAAtwYAIAgAALgGACAKAAC5BgAgCwAAugYAIAwAALsGACCdAgEAAAABpAIAAACTAwLEAkAAAAABxQJAAAAAAcwCAQAAAAHRAggAAAABjwMBAAAAAZEDAAAAkQMCkwMBAAAAAZQDAgAAAAGWAwEAAAABlwMBAAAAAZgDAgAAAAGZAwgAAAABmgMIAAAAAZsDAgAAAAGcAwEAAAABnQMCAAAAAZ4DAQAAAAGfAwAAtQYAIKADAQAAAAGhAwIAAAABogMgAAAAARcJAACnBQAgDwAA8AUAIBEAAKoFACASAACoBQAgEwAAqQUAIJ0CAQAAAAGzAgEAAAABtAICAAAAAbkCAQAAAAHEAkAAAAABxQJAAAAAAe4CAAAA7gIC_wIBAAAAAYADCAAAAAGCAwAAAIIDAoMDQAAAAAGEA0AAAAABhQOAAAAAAYYDAQAAAAGHA0AAAAABiAMBAAAAAYkDAQAAAAGKAyAAAAABAgAAAA0AICIAAIUHACADAAAADQAgIgAAhQcAICMAAIQHACABGwAAtgcAMAIAAAANACAbAACEBwAgAgAAAPgEACAbAACDBwAgEp0CAQDEBAAhswIBAMQEACG0AgIA0QQAIbkCAQDEBAAhxAJAAMYEACHFAkAAxgQAIe4CAAD8BO4CIv8CAQDEBAAhgAMIAPoEACGCAwAA-wSCAyKDA0AAxgQAIYQDQADGBAAhhQOAAAAAAYYDAQDFBAAhhwNAAMkEACGIAwEAxQQAIYkDAQDFBAAhigMgAMgEACEXCQAA_wQAIA8AAO8FACARAACCBQAgEgAAgAUAIBMAAIEFACCdAgEAxAQAIbMCAQDEBAAhtAICANEEACG5AgEAxAQAIcQCQADGBAAhxQJAAMYEACHuAgAA_ATuAiL_AgEAxAQAIYADCAD6BAAhggMAAPsEggMigwNAAMYEACGEA0AAxgQAIYUDgAAAAAGGAwEAxQQAIYcDQADJBAAhiAMBAMUEACGJAwEAxQQAIYoDIADIBAAhFwkAAKcFACAPAADwBQAgEQAAqgUAIBIAAKgFACATAACpBQAgnQIBAAAAAbMCAQAAAAG0AgIAAAABuQIBAAAAAcQCQAAAAAHFAkAAAAAB7gIAAADuAgL_AgEAAAABgAMIAAAAAYIDAAAAggMCgwNAAAAAAYQDQAAAAAGFA4AAAAABhgMBAAAAAYcDQAAAAAGIAwEAAAABiQMBAAAAAYoDIAAAAAEMnQIBAAAAAcQCQAAAAAHFAkAAAAABpgMBAAAAAacDAQAAAAGoAwEAAAABqQMBAAAAAaoDAQAAAAGrA0AAAAABrANAAAAAAa0DAQAAAAGuAwEAAAABAgAAAAkAICIAAJEHACADAAAACQAgIgAAkQcAICMAAJAHACABGwAAtQcAMBEDAACeBAAgmgIAAL4EADCbAgAABwAQnAIAAL4EADCdAgEAAAABuwIBANwDACHEAkAA3wMAIcUCQADfAwAhpgMBANwDACGnAwEA3AMAIagDAQDeAwAhqQMBAN4DACGqAwEA3gMAIasDQADzAwAhrANAAPMDACGtAwEA3gMAIa4DAQDeAwAhAgAAAAkAIBsAAJAHACACAAAAjgcAIBsAAI8HACAQmgIAAI0HADCbAgAAjgcAEJwCAACNBwAwnQIBANwDACG7AgEA3AMAIcQCQADfAwAhxQJAAN8DACGmAwEA3AMAIacDAQDcAwAhqAMBAN4DACGpAwEA3gMAIaoDAQDeAwAhqwNAAPMDACGsA0AA8wMAIa0DAQDeAwAhrgMBAN4DACEQmgIAAI0HADCbAgAAjgcAEJwCAACNBwAwnQIBANwDACG7AgEA3AMAIcQCQADfAwAhxQJAAN8DACGmAwEA3AMAIacDAQDcAwAhqAMBAN4DACGpAwEA3gMAIaoDAQDeAwAhqwNAAPMDACGsA0AA8wMAIa0DAQDeAwAhrgMBAN4DACEMnQIBAMQEACHEAkAAxgQAIcUCQADGBAAhpgMBAMQEACGnAwEAxAQAIagDAQDFBAAhqQMBAMUEACGqAwEAxQQAIasDQADJBAAhrANAAMkEACGtAwEAxQQAIa4DAQDFBAAhDJ0CAQDEBAAhxAJAAMYEACHFAkAAxgQAIaYDAQDEBAAhpwMBAMQEACGoAwEAxQQAIakDAQDFBAAhqgMBAMUEACGrA0AAyQQAIawDQADJBAAhrQMBAMUEACGuAwEAxQQAIQydAgEAAAABxAJAAAAAAcUCQAAAAAGmAwEAAAABpwMBAAAAAagDAQAAAAGpAwEAAAABqgMBAAAAAasDQAAAAAGsA0AAAAABrQMBAAAAAa4DAQAAAAEHnQIBAAAAAcQCQAAAAAHFAkAAAAABpQNAAAAAAa8DAQAAAAGwAwEAAAABsQMBAAAAAQIAAAAFACAiAACdBwAgAwAAAAUAICIAAJ0HACAjAACcBwAgARsAALQHADAMAwAAngQAIJoCAAC_BAAwmwIAAAMAEJwCAAC_BAAwnQIBAAAAAbsCAQDcAwAhxAJAAN8DACHFAkAA3wMAIaUDQADfAwAhrwMBAAAAAbADAQDeAwAhsQMBAN4DACECAAAABQAgGwAAnAcAIAIAAACaBwAgGwAAmwcAIAuaAgAAmQcAMJsCAACaBwAQnAIAAJkHADCdAgEA3AMAIbsCAQDcAwAhxAJAAN8DACHFAkAA3wMAIaUDQADfAwAhrwMBANwDACGwAwEA3gMAIbEDAQDeAwAhC5oCAACZBwAwmwIAAJoHABCcAgAAmQcAMJ0CAQDcAwAhuwIBANwDACHEAkAA3wMAIcUCQADfAwAhpQNAAN8DACGvAwEA3AMAIbADAQDeAwAhsQMBAN4DACEHnQIBAMQEACHEAkAAxgQAIcUCQADGBAAhpQNAAMYEACGvAwEAxAQAIbADAQDFBAAhsQMBAMUEACEHnQIBAMQEACHEAkAAxgQAIcUCQADGBAAhpQNAAMYEACGvAwEAxAQAIbADAQDFBAAhsQMBAMUEACEHnQIBAAAAAcQCQAAAAAHFAkAAAAABpQNAAAAAAa8DAQAAAAGwAwEAAAABsQMBAAAAAQQiAACSBwAwuAMAAJMHADC6AwAAlQcAIL4DAACWBwAwBCIAAIYHADC4AwAAhwcAMLoDAACJBwAgvgMAAIoHADAEIgAA_QYAMLgDAAD-BgAwugMAAIAHACC-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_QWRAyKTAwEAxQQAIZQDAgDRBAAhlQMBAMQEACGWAwEAxAQAIZcDAQDEBAAhmAMCANEEACGZAwgA-gQAIZoDCAD6BAAhmwMCANEEACGcAwEAxAQAIZ0DAgDRBAAhngMBAMQEACGfAwAA_wUAIKADAQDEBAAhoQMCANEEACGiAyAAyAQAIR0GAACABgAgBwAAgQYAIAgAAIIGACAKAACDBgAgCwAAhAYAIJ0CAQDEBAAhpAIAAP4FkwMixAJAAMYEACHFAkAAxgQAIcwCAQDEBAAh0QIIAPoEACGPAwEAxAQAIZEDAAD9BZEDIpMDAQDFBAAhlAMCANEEACGVAwEAxAQAIZYDAQDEBAAhlwMBAMQEACGYAwIA0QQAIZkDCAD6BAAhmgMIAPoEACGbAwIA0QQAIZwDAQDEBAAhnQMCANEEACGeAwEAxAQAIZ8DAAD_BQAgoAMBAMQEACGhAwIA0QQAIaIDIADIBAAhEQMAAK0FACAJAACrBQAgDgAArAUAIBEAAK8FACCdAgEAAAABpAIAAADCAgK5AgEAAAABugIBAAAAAbsCAQAAAAG8AkAAAAABvQJAAAAAAb4CAQAAAAG_AgEAAAABwAICAAAAAcMCAAAAwwIDxAJAAAAAAcUCQAAAAAECAAAAEQAgIgAA0wcAIAMAAAAPACAiAADTBwAgIwAA1wcAIBMAAAAPACADAADhBAAgCQAA3wQAIA4AAOAEACARAADjBAAgGwAA1wcAIJ0CAQDEBAAhpAIAAN0EwgIiuQIBAMQEACG6AgEAxAQAIbsCAQDEBAAhvAJAAMYEACG9AkAAyQQAIb4CAQDEBAAhvwIBAMQEACHAAgIA0QQAIcMCAADeBMMCI8QCQADGBAAhxQJAAMYEACERAwAA4QQAIAkAAN8EACAOAADgBAAgEQAA4wQAIJ0CAQDEBAAhpAIAAN0EwgIiuQIBAMQEACG6AgEAxAQAIbsCAQDEBAAhvAJAAMYEACG9AkAAyQQAIb4CAQDEBAAhvwIBAMQEACHAAgIA0QQAIcMCAADeBMMCI8QCQADGBAAhxQJAAMYEACEdBgAAtgYAIAcAALcGACAIAAC4BgAgCgAAuQYAIAwAALsGACCdAgEAAAABpAIAAACTAwLEAkAAAAABxQJAAAAAAcwCAQAAAAHRAggAAAABjwMBAAAAAZEDAAAAkQMCkwMBAAAAAZQDAgAAAAGVAwEAAAABlgMBAAAAAZcDAQAAAAGYAwIAAAABmQMIAAAAAZoDCAAAAAGbAwIAAAABnAMBAAAAAZ0DAgAAAAGeAwEAAAABnwMAALUGACCgAwEAAAABoQMCAAAAAaIDIAAAAAECAAAAOgAgIgAA2AcAIAMAAAA4ACAiAADYBwAgIwAA3AcAIB8AAAA4ACAGAACABgAgBwAAgQYAIAgAAIIGACAKAACDBgAgDAAAhQYAIBsAANwHACCdAgEAxAQAIaQCAAD-BZMDIsQCQADGBAAhxQJAAMYEACHMAgEAxAQAIdECCAD6BAAhjwMBAMQEACGRAwAA_QWRAyKTAwEAxQQAIZQDAgDRBAAhlQMBAMQEACGWAwEAxAQAIZcDAQDEBAAhmAMCANEEACGZAwgA-gQAIZoDCAD6BAAhmwMCANEEACGcAwEAxAQAIZ0DAgDRBAAhngMBAMQEACGfAwAA_wUAIKADAQDEBAAhoQMCANEEACGiAyAAyAQAIR0GAACABgAgBwAAgQYAIAgAAIIGACAKAACDBgAgDAAAhQYAIJ0CAQDEBAAhpAIAAP4FkwMixAJAAMYEACHFAkAAxgQAIcwCAQDEBAAh0QIIAPoEACGPAwEAxAQAIZEDAAD9BZEDIpMDAQDFBAAhlAMCANEEACGVAwEAxAQAIZYDAQDEBAAhlwMBAMQEACGYAwIA0QQAIZkDCAD6BAAhmgMIAPoEACGbAwIA0QQAIZwDAQDEBAAhnQMCANEEACGeAwEAxAQAIZ8DAAD_BQAgoAMBAMQEACGhAwIA0QQAIaIDIADIBAAhEQQAAJ4HACAFAACfBwAgBwAApAcAIAgAAKAHACAKAACiBwAgFAAAoQcAIJ0CAQAAAAGkAgEAAAABxAJAAAAAAcUCQAAAAAHGAgEAAAABzQIBAAAAAeACIAAAAAHhAkAAAAABsgMBAAAAAbMDIAAAAAG0AwEAAAABAgAAAAEAICIAAN0HACADAAAASgAgIgAA3QcAICMAAOEHACATAAAASgAgBAAAzAYAIAUAAM0GACAHAADSBgAgCAAAzgYAIAoAANAGACAUAADPBgAgGwAA4QcAIJ0CAQDEBAAhpAIBAMQEACHEAkAAxgQAIcUCQADGBAAhxgIBAMQEACHNAgEAxQQAIeACIADIBAAh4QJAAMkEACGyAwEAxAQAIbMDIADIBAAhtAMBAMQEACERBAAAzAYAIAUAAM0GACAHAADSBgAgCAAAzgYAIAoAANAGACAUAADPBgAgnQIBAMQEACGkAgEAxAQAIcQCQADGBAAhxQJAAMYEACHGAgEAxAQAIc0CAQDFBAAh4AIgAMgEACHhAkAAyQQAIbIDAQDEBAAhswMgAMgEACG0AwEAxAQAIRgDAACmBQAgCQAApwUAIA8AAPAFACARAACqBQAgEwAAqQUAIJ0CAQAAAAGzAgEAAAABtAICAAAAAbkCAQAAAAG7AgEAAAABxAJAAAAAAcUCQAAAAAHuAgAAAO4CAv8CAQAAAAGAAwgAAAABggMAAACCAwKDA0AAAAABhANAAAAAAYUDgAAAAAGGAwEAAAABhwNAAAAAAYgDAQAAAAGJAwEAAAABigMgAAAAAQIAAAANACAiAADiBwAgAwAAAAsAICIAAOIHACAjAADmBwAgGgAAAAsAIAMAAP4EACAJAAD_BAAgDwAA7wUAIBEAAIIFACATAACBBQAgGwAA5gcAIJ0CAQDEBAAhswIBAMQEACG0AgIA0QQAIbkCAQDEBAAhuwIBAMQEACHEAkAAxgQAIcUCQADGBAAh7gIAAPwE7gIi_wIBAMQEACGAAwgA-gQAIYIDAAD7BIIDIoMDQADGBAAhhANAAMYEACGFA4AAAAABhgMBAMUEACGHA0AAyQQAIYgDAQDFBAAhiQMBAMUEACGKAyAAyAQAIRgDAAD-BAAgCQAA_wQAIA8AAO8FACARAACCBQAgEwAAgQUAIJ0CAQDEBAAhswIBAMQEACG0AgIA0QQAIbkCAQDEBAAhuwIBAMQEACHEAkAAxgQAIcUCQADGBAAh7gIAAPwE7gIi_wIBAMQEACGAAwgA-gQAIYIDAAD7BIIDIoMDQADGBAAhhANAAMYEACGFA4AAAAABhgMBAMUEACGHA0AAyQQAIYgDAQDFBAAhiQMBAMUEACGKAyAAyAQAIREEAACeBwAgBQAAnwcAIAcAAKQHACAIAACgBwAgFAAAoQcAIBUAAKMHACCdAgEAAAABpAIBAAAAAcQCQAAAAAHFAkAAAAABxgIBAAAAAc0CAQAAAAHgAiAAAAAB4QJAAAAAAbIDAQAAAAGzAyAAAAABtAMBAAAAAQIAAAABACAiAADnBwAgHQYAALYGACAHAAC3BgAgCAAAuAYAIAsAALoGACAMAAC7BgAgnQIBAAAAAaQCAAAAkwMCxAJAAAAAAcUCQAAAAAHMAgEAAAAB0QIIAAAAAY8DAQAAAAGRAwAAAJEDApMDAQAAAAGUAwIAAAABlQMBAAAAAZYDAQAAAAGXAwEAAAABmAMCAAAAAZkDCAAAAAGaAwgAAAABmwMCAAAAAZwDAQAAAAGdAwIAAAABngMBAAAAAZ8DAAC1BgAgoAMBAAAAAaEDAgAAAAGiAyAAAAABAgAAADoAICIAAOkHACADAAAASgAgIgAA5wcAICMAAO0HACATAAAASgAgBAAAzAYAIAUAAM0GACAHAADSBgAgCAAAzgYAIBQAAM8GACAVAADRBgAgGwAA7QcAIJ0CAQDEBAAhpAIBAMQEACHEAkAAxgQAIcUCQADGBAAhxgIBAMQEACHNAgEAxQQAIeACIADIBAAh4QJAAMkEACGyAwEAxAQAIbMDIADIBAAhtAMBAMQEACERBAAAzAYAIAUAAM0GACAHAADSBgAgCAAAzgYAIBQAAM8GACAVAADRBgAgnQIBAMQEACGkAgEAxAQAIcQCQADGBAAhxQJAAMYEACHGAgEAxAQAIc0CAQDFBAAh4AIgAMgEACHhAkAAyQQAIbIDAQDEBAAhswMgAMgEACG0AwEAxAQAIQMAAAA4ACAiAADpBwAgIwAA8AcAIB8AAAA4ACAGAACABgAgBwAAgQYAIAgAAIIGACALAACEBgAgDAAAhQYAIBsAAPAHACCdAgEAxAQAIaQCAAD-BZMDIsQCQADGBAAhxQJAAMYEACHMAgEAxAQAIdECCAD6BAAhjwMBAMQEACGRAwAA_QWRAyKTAwEAxQQAIZQDAgDRBAAhlQMBAMQEACGWAwEAxAQAIZcDAQDEBAAhmAMCANEEACGZAwgA-gQAIZoDCAD6BAAhmwMCANEEACGcAwEAxAQAIZ0DAgDRBAAhngMBAMQEACGfAwAA_wUAIKADAQDEBAAhoQMCANEEACGiAyAAyAQAIR0GAACABgAgBwAAgQYAIAgAAIIGACALAACEBgAgDAAAhQYAIJ0CAQDEBAAhpAIAAP4FkwMixAJAAMYEACHFAkAAxgQAIcwCAQDEBAAh0QIIAPoEACGPAwEAxAQAIZEDAAD9BZEDIpMDAQDFBAAhlAMCANEEACGVAwEAxAQAIZYDAQDEBAAhlwMBAMQEACGYAwIA0QQAIZkDCAD6BAAhmgMIAPoEACGbAwIA0QQAIZwDAQDEBAAhnQMCANEEACGeAwEAxAQAIZ8DAAD_BQAgoAMBAMQEACGhAwIA0QQAIaIDIADIBAAhDJ0CAQAAAAGkAgAAAMICArkCAQAAAAG7AgEAAAABvAJAAAAAAb0CQAAAAAG-AgEAAAABvwIBAAAAAcACAgAAAAHDAgAAAMMCA8QCQAAAAAHFAkAAAAABEQQAAJ4HACAFAACfBwAgCAAAoAcAIAoAAKIHACAUAAChBwAgFQAAowcAIJ0CAQAAAAGkAgEAAAABxAJAAAAAAcUCQAAAAAHGAgEAAAABzQIBAAAAAeACIAAAAAHhAkAAAAABsgMBAAAAAbMDIAAAAAG0AwEAAAABAgAAAAEAICIAAPIHACAKnQIBAAAAAcQCQAAAAAHFAkAAAAABxgIBAAAAAcgCAAAAyAICyQIBAAAAAcoCAQAAAAHLAgEAAAABzAIBAAAAAc0CAQAAAAECAAAA1AIAICIAAPQHACAdBgAAtgYAIAgAALgGACAKAAC5BgAgCwAAugYAIAwAALsGACCdAgEAAAABpAIAAACTAwLEAkAAAAABxQJAAAAAAcwCAQAAAAHRAggAAAABjwMBAAAAAZEDAAAAkQMCkwMBAAAAAZQDAgAAAAGVAwEAAAABlgMBAAAAAZcDAQAAAAGYAwIAAAABmQMIAAAAAZoDCAAAAAGbAwIAAAABnAMBAAAAAZ0DAgAAAAGeAwEAAAABnwMAALUGACCgAwEAAAABoQMCAAAAAaIDIAAAAAECAAAAOgAgIgAA9gcAIB0GAAC2BgAgBwAAtwYAIAoAALkGACALAAC6BgAgDAAAuwYAIJ0CAQAAAAGkAgAAAJMDAsQCQAAAAAHFAkAAAAABzAIBAAAAAdECCAAAAAGPAwEAAAABkQMAAACRAwKTAwEAAAABlAMCAAAAAZUDAQAAAAGWAwEAAAABlwMBAAAAAZgDAgAAAAGZAwgAAAABmgMIAAAAAZsDAgAAAAGcAwEAAAABnQMCAAAAAZ4DAQAAAAGfAwAAtQYAIKADAQAAAAGhAwIAAAABogMgAAAAAQIAAAA6ACAiAAD4BwAgEQQAAJ4HACAFAACfBwAgBwAApAcAIAoAAKIHACAUAAChBwAgFQAAowcAIJ0CAQAAAAGkAgEAAAABxAJAAAAAAcUCQAAAAAHGAgEAAAABzQIBAAAAAeACIAAAAAHhAkAAAAABsgMBAAAAAbMDIAAAAAG0AwEAAAABAgAAAAEAICIAAPoHACAMnQIBAAAAAcQCQAAAAAHoAgEAAAAB6QIQAAAAAeoCAQAAAAHrAgEAAAAB7AIBAAAAAe4CAAAA7gIC7wJAAAAAAfACAQAAAAHxAgEAAAAB8gJAAAAAAQmdAgEAAAABnwIBAAAAAaACAQAAAAGhAgEAAAABogJAAAAAAaQCAAAApAICpQIgAAAAAaYCQAAAAAGnAgEAAAABBp0CAQAAAAGzAgEAAAABtAICAAAAAbUCIAAAAAG3AgAAALcCA7gCEAAAAAEDAAAAOAAgIgAA-AcAICMAAIEIACAfAAAAOAAgBgAAgAYAIAcAAIEGACAKAACDBgAgCwAAhAYAIAwAAIUGACAbAACBCAAgnQIBAMQEACGkAgAA_gWTAyLEAkAAxgQAIcUCQADGBAAhzAIBAMQEACHRAggA-gQAIY8DAQDEBAAhkQMAAP0FkQMikwMBAMUEACGUAwIA0QQAIZUDAQDEBAAhlgMBAMQEACGXAwEAxAQAIZgDAgDRBAAhmQMIAPoEACGaAwgA-gQAIZsDAgDRBAAhnAMBAMQEACGdAwIA0QQAIZ4DAQDEBAAhnwMAAP8FACCgAwEAxAQAIaEDAgDRBAAhogMgAMgEACEdBgAAgAYAIAcAAIEGACAKAACDBgAgCwAAhAYAIAwAAIUGACCdAgEAxAQAIaQCAAD-BZMDIsQCQADGBAAhxQJAAMYEACHMAgEAxAQAIdECCAD6BAAhjwMBAMQEACGRAwAA_QWRAyKTAwEAxQQAIZQDAgDRBAAhlQMBAMQEACGWAwEAxAQAIZcDAQDEBAAhmAMCANEEACGZAwgA-gQAIZoDCAD6BAAhmwMCANEEACGcAwEAxAQAIZ0DAgDRBAAhngMBAMQEACGfAwAA_wUAIKADAQDEBAAhoQMCANEEACGiAyAAyAQAIQMAAABKACAiAAD6BwAgIwAAhAgAIBMAAABKACAEAADMBgAgBQAAzQYAIAcAANIGACAKAADQBgAgFAAAzwYAIBUAANEGACAbAACECAAgnQIBAMQEACGkAgEAxAQAIcQCQADGBAAhxQJAAMYEACHGAgEAxAQAIc0CAQDFBAAh4AIgAMgEACHhAkAAyQQAIbIDAQDEBAAhswMgAMgEACG0AwEAxAQAIREEAADMBgAgBQAAzQYAIAcAANIGACAKAADQBgAgFAAAzwYAIBUAANEGACCdAgEAxAQAIaQCAQDEBAAhxAJAAMYEACHFAkAAxgQAIcYCAQDEBAAhzQIBAMUEACHgAiAAyAQAIeECQADJBAAhsgMBAMQEACGzAyAAyAQAIbQDAQDEBAAhEp0CAQAAAAG0AgIAAAABuQIBAAAAAbsCAQAAAAHEAkAAAAABxQJAAAAAAe4CAAAA7gIC_wIBAAAAAYADCAAAAAGCAwAAAIIDAoMDQAAAAAGEA0AAAAABhQOAAAAAAYYDAQAAAAGHA0AAAAABiAMBAAAAAYkDAQAAAAGKAyAAAAABBp0CAQAAAAGeAgEAAAABtAICAAAAAbUCIAAAAAG3AgAAALcCA7gCEAAAAAEDAAAASgAgIgAA8gcAICMAAIkIACATAAAASgAgBAAAzAYAIAUAAM0GACAIAADOBgAgCgAA0AYAIBQAAM8GACAVAADRBgAgGwAAiQgAIJ0CAQDEBAAhpAIBAMQEACHEAkAAxgQAIcUCQADGBAAhxgIBAMQEACHNAgEAxQQAIeACIADIBAAh4QJAAMkEACGyAwEAxAQAIbMDIADIBAAhtAMBAMQEACERBAAAzAYAIAUAAM0GACAIAADOBgAgCgAA0AYAIBQAAM8GACAVAADRBgAgnQIBAMQEACGkAgEAxAQAIcQCQADGBAAhxQJAAMYEACHGAgEAxAQAIc0CAQDFBAAh4AIgAMgEACHhAkAAyQQAIbIDAQDEBAAhswMgAMgEACG0AwEAxAQAIQMAAADXAgAgIgAA9AcAICMAAIwIACAMAAAA1wIAIBsAAIwIACCdAgEAxAQAIcQCQADGBAAhxQJAAMYEACHGAgEAxAQAIcgCAACzBcgCIskCAQDEBAAhygIBAMQEACHLAgEAxAQAIcwCAQDFBAAhzQIBAMUEACEKnQIBAMQEACHEAkAAxgQAIcUCQADGBAAhxgIBAMQEACHIAgAAswXIAiLJAgEAxAQAIcoCAQDEBAAhywIBAMQEACHMAgEAxQQAIc0CAQDFBAAhAwAAADgAICIAAPYHACAjAACPCAAgHwAAADgAIAYAAIAGACAIAACCBgAgCgAAgwYAIAsAAIQGACAMAACFBgAgGwAAjwgAIJ0CAQDEBAAhpAIAAP4FkwMixAJAAMYEACHFAkAAxgQAIcwCAQDEBAAh0QIIAPoEACGPAwEAxAQAIZEDAAD9BZEDIpMDAQDFBAAhlAMCANEEACGVAwEAxAQAIZYDAQDEBAAhlwMBAMQEACGYAwIA0QQAIZkDCAD6BAAhmgMIAPoEACGbAwIA0QQAIZwDAQDEBAAhnQMCANEEACGeAwEAxAQAIZ8DAAD_BQAgoAMBAMQEACGhAwIA0QQAIaIDIADIBAAhHQYAAIAGACAIAACCBgAgCgAAgwYAIAsAAIQGACAMAACFBgAgnQIBAMQEACGkAgAA_gWTAyLEAkAAxgQAIcUCQADGBAAhzAIBAMQEACHRAggA-gQAIY8DAQDEBAAhkQMAAP0FkQMikwMBAMUEACGUAwIA0QQAIZUDAQDEBAAhlgMBAMQEACGXAwEAxAQAIZgDAgDRBAAhmQMIAPoEACGaAwgA-gQAIZsDAgDRBAAhnAMBAMQEACGdAwIA0QQAIZ4DAQDEBAAhnwMAAP8FACCgAwEAxAQAIaEDAgDRBAAhogMgAMgEACEYAwAApgUAIAkAAKcFACAPAADwBQAgEgAAqAUAIBMAAKkFACCdAgEAAAABswIBAAAAAbQCAgAAAAG5AgEAAAABuwIBAAAAAcQCQAAAAAHFAkAAAAAB7gIAAADuAgL_AgEAAAABgAMIAAAAAYIDAAAAggMCgwNAAAAAAYQDQAAAAAGFA4AAAAABhgMBAAAAAYcDQAAAAAGIAwEAAAABiQMBAAAAAYoDIAAAAAECAAAADQAgIgAAkAgAIBEDAACtBQAgCAAArgUAIAkAAKsFACAOAACsBQAgnQIBAAAAAaQCAAAAwgICuQIBAAAAAboCAQAAAAG7AgEAAAABvAJAAAAAAb0CQAAAAAG-AgEAAAABvwIBAAAAAcACAgAAAAHDAgAAAMMCA8QCQAAAAAHFAkAAAAABAgAAABEAICIAAJIIACADAAAACwAgIgAAkAgAICMAAJYIACAaAAAACwAgAwAA_gQAIAkAAP8EACAPAADvBQAgEgAAgAUAIBMAAIEFACAbAACWCAAgnQIBAMQEACGzAgEAxAQAIbQCAgDRBAAhuQIBAMQEACG7AgEAxAQAIcQCQADGBAAhxQJAAMYEACHuAgAA_ATuAiL_AgEAxAQAIYADCAD6BAAhggMAAPsEggMigwNAAMYEACGEA0AAxgQAIYUDgAAAAAGGAwEAxQQAIYcDQADJBAAhiAMBAMUEACGJAwEAxQQAIYoDIADIBAAhGAMAAP4EACAJAAD_BAAgDwAA7wUAIBIAAIAFACATAACBBQAgnQIBAMQEACGzAgEAxAQAIbQCAgDRBAAhuQIBAMQEACG7AgEAxAQAIcQCQADGBAAhxQJAAMYEACHuAgAA_ATuAiL_AgEAxAQAIYADCAD6BAAhggMAAPsEggMigwNAAMYEACGEA0AAxgQAIYUDgAAAAAGGAwEAxQQAIYcDQADJBAAhiAMBAMUEACGJAwEAxQQAIYoDIADIBAAhAwAAAA8AICIAAJIIACAjAACZCAAgEwAAAA8AIAMAAOEEACAIAADiBAAgCQAA3wQAIA4AAOAEACAbAACZCAAgnQIBAMQEACGkAgAA3QTCAiK5AgEAxAQAIboCAQDEBAAhuwIBAMQEACG8AkAAxgQAIb0CQADJBAAhvgIBAMQEACG_AgEAxAQAIcACAgDRBAAhwwIAAN4EwwIjxAJAAMYEACHFAkAAxgQAIREDAADhBAAgCAAA4gQAIAkAAN8EACAOAADgBAAgnQIBAMQEACGkAgAA3QTCAiK5AgEAxAQAIboCAQDEBAAhuwIBAMQEACG8AkAAxgQAIb0CQADJBAAhvgIBAMQEACG_AgEAxAQAIcACAgDRBAAhwwIAAN4EwwIjxAJAAMYEACHFAkAAxgQAIRgDAACmBQAgCQAApwUAIA8AAPAFACARAACqBQAgEgAAqAUAIJ0CAQAAAAGzAgEAAAABtAICAAAAAbkCAQAAAAG7AgEAAAABxAJAAAAAAcUCQAAAAAHuAgAAAO4CAv8CAQAAAAGAAwgAAAABggMAAACCAwKDA0AAAAABhANAAAAAAYUDgAAAAAGGAwEAAAABhwNAAAAAAYgDAQAAAAGJAwEAAAABigMgAAAAAQIAAAANACAiAACaCAAgAwAAAAsAICIAAJoIACAjAACeCAAgGgAAAAsAIAMAAP4EACAJAAD_BAAgDwAA7wUAIBEAAIIFACASAACABQAgGwAAnggAIJ0CAQDEBAAhswIBAMQEACG0AgIA0QQAIbkCAQDEBAAhuwIBAMQEACHEAkAAxgQAIcUCQADGBAAh7gIAAPwE7gIi_wIBAMQEACGAAwgA-gQAIYIDAAD7BIIDIoMDQADGBAAhhANAAMYEACGFA4AAAAABhgMBAMUEACGHA0AAyQQAIYgDAQDFBAAhiQMBAMUEACGKAyAAyAQAIRgDAAD-BAAgCQAA_wQAIA8AAO8FACARAACCBQAgEgAAgAUAIJ0CAQDEBAAhswIBAMQEACG0AgIA0QQAIbkCAQDEBAAhuwIBAMQEACHEAkAAxgQAIcUCQADGBAAh7gIAAPwE7gIi_wIBAMQEACGAAwgA-gQAIYIDAAD7BIIDIoMDQADGBAAhhANAAMYEACGFA4AAAAABhgMBAMUEACGHA0AAyQQAIYgDAQDFBAAhiQMBAMUEACGKAyAAyAQAIQgEBgIFCgMHQQUIDgQKPAcNABMUOwYVQBIBAwABAQMAAQcDAAEJAAYNABEPAAURNA0SLw8TMxAGAwABCCQECQAGDQAODgALESgNBwYAAQcSBQgTBAoXBwsZCAwdCQ0ACgIDAAEJAAYBCQAGAQkABgQHHgAIHwAKIAAMIQACByIFDQAMAQcjAAIPAAUQKQQCCCoAESsAARAABAEQAAQDETcAEjUAEzYAAQMAAQcEQgAFQwAHSAAIRAAKRgAURQAVRwAAAAADDQAYKAAZKQAaAAAAAw0AGCgAGSkAGgEDAAEBAwABAw0AHygAICkAIQAAAAMNAB8oACApACEBAwABAQMAAQMNACYoACcpACgAAAADDQAmKAAnKQAoAAAAAw0ALigALykAMAAAAAMNAC4oAC8pADABBgABAQYAAQUNADUoADgpADlqADZrADcAAAAAAAUNADUoADgpADlqADZrADcBCQAGAQkABgMNAD4oAD8pAEAAAAADDQA-KAA_KQBAAwMAAQkABg8ABQMDAAEJAAYPAAUFDQBFKABIKQBJagBGawBHAAAAAAAFDQBFKABIKQBJagBGawBHAQkABgEJAAYDDQBOKABPKQBQAAAAAw0ATigATykAUAEDAAEBAwABAw0AVSgAVikAVwAAAAMNAFUoAFYpAFcBEAAEARAABAUNAFwoAF8pAGBqAF1rAF4AAAAAAAUNAFwoAF8pAGBqAF1rAF4AAAUNAGUoAGgpAGlqAGZrAGcAAAAAAAUNAGUoAGgpAGlqAGZrAGcCAwABCQAGAgMAAQkABgUNAG4oAHEpAHJqAG9rAHAAAAAAAAUNAG4oAHEpAHJqAG9rAHAAAAMNAHcoAHgpAHkAAAADDQB3KAB4KQB5AwMAAQkABg4ACwMDAAEJAAYOAAsFDQB-KACBASkAggFqAH9rAIABAAAAAAAFDQB-KACBASkAggFqAH9rAIABAg8ABRCNAwQCDwAFEJMDBAUNAIcBKACKASkAiwFqAIgBawCJAQAAAAAABQ0AhwEoAIoBKQCLAWoAiAFrAIkBARAABAEQAAQDDQCQASgAkQEpAJIBAAAAAw0AkAEoAJEBKQCSARYCARdJARhMARlNARpOARxQAR1SFB5TFR9VASBXFCFYFiRZASVaASZbFCpeFytfGyxgAi1hAi5iAi9jAjBkAjFmAjJoFDNpHDRrAjVtFDZuHTdvAjhwAjlxFDp0Hjt1Ijx2Az13Az54Az95A0B6A0F8A0J-FEN_I0SBAQNFgwEURoQBJEeFAQNIhgEDSYcBFEqKASVLiwEpTI0BKk2OASpOkQEqT5IBKlCTASpRlQEqUpcBFFOYAStUmgEqVZwBFFadASxXngEqWJ8BKlmgARRaowEtW6QBMVylAQZdpgEGXqcBBl-oAQZgqQEGYasBBmKtARRjrgEyZLABBmWyARRmswEzZ7QBBmi1AQZptgEUbLkBNG26ATpuuwEJb7wBCXC9AQlxvgEJcr8BCXPBAQl0wwEUdcQBO3bGAQl3yAEUeMkBPHnKAQl6ywEJe8wBFHzPAT190AFBftEBBH_SAQSAAdMBBIEB1AEEggHVAQSDAdcBBIQB2QEUhQHaAUKGAdwBBIcB3gEUiAHfAUOJAeABBIoB4QEEiwHiARSMAeUBRI0B5gFKjgHoAQiPAekBCJAB6wEIkQHsAQiSAe0BCJMB7wEIlAHxARSVAfIBS5YB9AEIlwH2ARSYAfcBTJkB-AEImgH5AQibAfoBFJwB_QFNnQH-AVGeAf8BEp8BgAISoAGBAhKhAYICEqIBgwISowGFAhKkAYcCFKUBiAJSpgGKAhKnAYwCFKgBjQJTqQGOAhKqAY8CEqsBkAIUrAGTAlStAZQCWK4BlQIPrwGWAg-wAZcCD7EBmAIPsgGZAg-zAZsCD7QBnQIUtQGeAlm2AaACD7cBogIUuAGjAlq5AaQCD7oBpQIPuwGmAhS8AakCW70BqgJhvgGsAmK_Aa0CYsABsAJiwQGxAmLCAbICYsMBtAJixAG2AhTFAbcCY8YBuAJixwG5AhTIAbwCZMkBvQJqygG-AgfLAb8CB8wBwAIHzQHBAgfOAcICB88BxAIH0AHGAhTRAccCa9IByQIH0wHLAhTUAcwCbNUBzQIH1gHOAgfXAc8CFNgB0gJt2QHTAnPaAdUCC9sB1gIL3AHZAgvdAdoCC94B2wIL3wHdAgvgAd8CFOEB4AJ04gHiAgvjAeQCFOQB5QJ15QHmAgvmAecCC-cB6AIU6AHrAnbpAewCeuoB7QIF6wHuAgXsAe8CBe0B8AIF7gHxAgXvAfMCBfAB9QIU8QH2AnvyAfgCBfMB-gIU9AH7Anz1AfwCBfYB_QIF9wH-AhT4AYEDffkBggODAfoBgwMN-wGEAw38AYUDDf0BhgMN_gGHAw3_AYkDDYACiwMUgQKMA4QBggKPAw2DApEDFIQCkgOFAYUClAMNhgKVAw2HApYDFIgCmQOGAYkCmgOMAYoCmwMQiwKcAxCMAp0DEI0CngMQjgKfAxCPAqEDEJACowMUkQKkA40BkgKmAxCTAqgDFJQCqQOOAZUCqgMQlgKrAxCXAqwDFJgCrwOPAZkCsAOTAQ"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var BoatStatus = {
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
  MAINTENANCE: "MAINTENANCE",
  SUSPENDED: "SUSPENDED",
  Booked: "Booked"
};
var UserRole = {
  CUSTOMER: "CUSTOMER",
  BOAT_OWNER: "BOAT_OWNER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
  BANNED: "BANNED",
  PENDING_VERIFICATION: "PENDING_VERIFICATION"
};
var BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  UNPAID: "UNPAID"
};
var ScheduleStatus = {
  UPCOMING: "UPCOMING",
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = `${envVariables.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/lib/auth.ts
import ms from "ms";
import { emailOTP, oAuthProxy } from "better-auth/plugins";

// src/app/utils/email.ts
import nodemailer from "nodemailer";
import path2 from "path";
import status2 from "http-status";
import ejs from "ejs";
var isSecure = Number(envVariables.SMTP_PORT) === 465;
var transporter = nodemailer.createTransport({
  host: envVariables.SMTP_HOST,
  port: Number(envVariables.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: envVariables.EMAIL_USER,
    pass: envVariables.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 15e3,
  greetingTimeout: 15e3,
  socketTimeout: 2e4,
  debug: true,
  logger: true
});
var sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments
}) => {
  try {
    const templatePath = path2.resolve(
      process.cwd(),
      `src/app/templates/${templateName}.ejs`
    );
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVariables.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType
      }))
    });
    console.log("Email sent: ", info.messageId);
  } catch (error) {
    console.error("=== EMAIL SEND FAILED ===");
    console.error("Error Code:", error.code);
    console.error("Command:", error.command);
    console.error("Message:", error.message);
    console.error("Full Error:", JSON.stringify(error, null, 2));
    console.error("Error sending email:", error);
    throw new AppErrors_default(status2.INSUFFICIENT_STORAGE, "Failed to send email");
  }
};

// src/app/lib/auth.ts
import { waitUntil } from "@vercel/functions";
var parseMs = (value) => ms(value);
var auth = betterAuth({
  baseURL: envVariables.BETTER_AUTH_URL,
  secret: envVariables.BETTER_AUTH_SECRET,
  trustedOrigins: [envVariables.FRONTEND_URL],
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.CUSTOMER
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.PENDING_VERIFICATION
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
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
            resetLink
          }
        }).catch((err) => {
          console.error("Background reset password email failed:", err);
        })
      );
    },
    expiresIn: 5 * 60
  },
  session: {
    expiresIn: parseMs(envVariables.BETTER_AUTH_TOKEN_EXPIRES_IN) / 1e3,
    updateAge: ms("1d") / 1e3,
    cookieOptions: {
      sameSite: "none",
      secure: true
    },
    cookieCache: {
      enabled: true,
      maxAge: parseMs(envVariables.BETTER_AUTH_TOKEN_EXPIRES_IN) / 1e3
    }
  },
  cookies: {
    sessionToken: {
      name: "better-auth.session_token",
      options: {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
      }
    }
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        const user = await prisma.user.findUnique({
          where: { email }
        });
        if (!user) {
          console.error(`User with email ${email} not found.`);
          return;
        }
        if (user.role === UserRole.SUPER_ADMIN) return;
        let subject = "Verify Your Email";
        let templateName = "otp";
        let templateData = {
          name: user.name,
          otp
        };
        if (type === "forget-password") {
          subject = "Reset Your Password";
        }
        waitUntil(
          sendEmail({
            to: email,
            subject,
            templateName,
            templateData
          }).catch((err) => {
            console.error(`Background ${type} email failed:`, err);
          })
        );
      },
      expiresIn: 5 * 60,
      otpLength: 6
    }),
    oAuthProxy()
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
        deletedAt: null
      })
    }
  },
  redirectURIs: {
    signIn: `${envVariables.BETTER_AUTH_URL}/api/v1/auth/google/success`
  },
  advanced: {
    cookies: {
      state: {
        attributes: {
          secure: true,
          sameSite: "none",
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          secure: true,
          sameSite: "none",
          httpOnly: true,
          path: "/"
        }
      }
    }
  }
});

// src/app.ts
import path3 from "path";

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/module/payment/payment.controller.ts
import status4 from "http-status";

// src/app/module/payment/payment.utils.ts
import PDFDocument from "pdfkit";
var generateInvoicePdf = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50
      });
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (error) => reject(error));
      doc.fontSize(24).font("Helvetica-Bold").text("BOOKING INVOICE", {
        align: "center"
      });
      doc.moveDown(0.5);
      doc.fontSize(12).font("Helvetica-Bold").text("BOAT SEA", { align: "center" });
      doc.fontSize(10).font("Helvetica").text("Explore the Horizons with Us", { align: "center" });
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);
      const topY = doc.y;
      doc.fontSize(11).font("Helvetica-Bold").text("Passenger Details", 50, topY);
      doc.fontSize(10).font("Helvetica").text(`Name: ${data.passengerName}`).text(`Email: ${data.passengerEmail}`);
      doc.fontSize(11).font("Helvetica-Bold").text("Booking Details", 350, topY);
      doc.fontSize(10).font("Helvetica").text(`Booking #: ${data.bookingNumber}`, 350).text(`Invoice ID: ${data.invoiceId}`, 350).text(`Date: ${new Date(data.paymentDate).toLocaleDateString()}`, 350);
      doc.moveDown(2);
      const tripY = doc.y;
      doc.fontSize(11).font("Helvetica-Bold").text("Trip Information", 50, tripY);
      doc.fontSize(10).font("Helvetica").text(`Vessel Name: ${data.boatName}`).text(`Departure Date: ${new Date(data.tripDate).toLocaleDateString()}`).text(`Transaction ID: ${data.transactionId}`);
      doc.moveDown(1.5);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1);
      const tableTop = doc.y;
      const col1X = 50;
      const col2X = 400;
      doc.fontSize(11).font("Helvetica-Bold").text("Payment Summary", col1X, tableTop);
      doc.moveDown(1);
      doc.fontSize(10).font("Helvetica-Bold");
      doc.text("Description", col1X, doc.y);
      doc.text("Price", col2X, doc.y, { align: "right", width: 100 });
      doc.moveDown(0.5);
      doc.moveTo(col1X, doc.y).lineTo(545, doc.y).lineWidth(0.5).stroke();
      doc.moveDown(0.8);
      doc.font("Helvetica").text(`Boat Rental / Ticket Fare (${data.boatName})`, col1X, doc.y);
      doc.text(`${data.amount.toFixed(2)} ${data.currency}`, col2X, doc.y, { align: "right", width: 100 });
      doc.moveDown(1.5);
      doc.moveTo(350, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(0.5);
      doc.fontSize(12).font("Helvetica-Bold");
      doc.text("Total Paid", 350, doc.y);
      doc.text(`${data.amount.toFixed(2)} ${data.currency}`, col2X, doc.y, { align: "right", width: 100 });
      doc.moveDown(5);
      doc.fontSize(9).font("Helvetica").fillColor("#555555");
      doc.text(
        "Thank you for sailing with Boat Sea! Please present this invoice at the dock.",
        { align: "center" }
      );
      doc.moveDown(0.3);
      doc.text("Electronic receipt - No signature required.", { align: "center" });
      doc.text("Support: support@boatsea.com | Secure Payment via Stripe", { align: "center" });
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// src/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status3 from "http-status";
cloudinary.config({
  cloud_name: envVariables.CLOUDINARY_CLOUD_NAME,
  api_key: envVariables.CLOUDINARY_API_KEY,
  api_secret: envVariables.CLOUDINARY_API_SECRET
});
var uploadFileToCloudinary = async (buffer, fileName) => {
  if (!buffer || !fileName) {
    throw new AppErrors_default(
      status3.BAD_REQUEST,
      "File buffer and file name are required for upload"
    );
  }
  const extension = fileName.split(".").pop()?.toLocaleLowerCase();
  const fileNameWithoutExtension = fileName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
  const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
  const folder = extension === "pdf" ? "pdfs" : "images";
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: `Boat-Sea/${folder}/${uniqueName}`,
        folder: `Boat-Sea/${folder}`
      },
      (error, result) => {
        if (error) {
          return reject(
            new AppErrors_default(
              status3.INTERNAL_SERVER_ERROR,
              "Failed to upload file to Cloudinary"
            )
          );
        }
        resolve(result);
      }
    ).end(buffer);
  });
};
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image"
      });
      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppErrors_default(
      status3.INTERNAL_SERVER_ERROR,
      "Failed to delete file from Cloudinary"
    );
  }
};
var cloudinaryUpload = cloudinary;

// src/app/utils/QueryBuilder.ts
var QueryBuilder = class {
  constructor(model, queryParams, config2 = {}) {
    this.model = model;
    this.queryParams = queryParams;
    this.config = config2;
    this.queryParams = this.normalizeQueryParams(
      queryParams
    );
    this.query = {
      where: {},
      include: {},
      orderBy: {},
      skip: 0,
      take: 10
    };
    this.countQuery = {
      where: {}
    };
  }
  query;
  countQuery;
  page = 1;
  limit = 10;
  skip = 0;
  selectFields;
  /*
  =========================
  SEARCH
  =========================
  */
  search() {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;
    if (!searchTerm || !searchableFields?.length) return this;
    const conditions = searchableFields.map((field) => {
      const filter = {
        contains: searchTerm,
        mode: "insensitive"
      };
      return this.buildNestedRelationFilter(field, filter);
    });
    this.query.where.OR = conditions;
    this.countQuery.where.OR = conditions;
    return this;
  }
  /*
  =========================
  FILTER
  =========================
  */
  filter() {
    const { filterableFields } = this.config;
    const excludedFields = [
      "searchTerm",
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "fields",
      "include"
    ];
    const queryWhere = this.query.where;
    const countWhere = this.countQuery.where;
    Object.entries(this.queryParams).forEach(([key, value]) => {
      if (excludedFields.includes(key)) return;
      if (value === void 0 || value === "") return;
      const allowed = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);
      if (!allowed) return;
      const parsedValue = this.parseFilterInput(value);
      if (key.includes(".")) {
        const nested = this.buildNestedRelationFilter(key, parsedValue);
        Object.assign(queryWhere, nested);
        Object.assign(countWhere, nested);
        return;
      }
      queryWhere[key] = parsedValue;
      countWhere[key] = parsedValue;
    });
    return this;
  }
  /*
  =========================
  PAGINATION
  =========================
  */
  paginate() {
    this.page = Number(this.queryParams.page) || 1;
    this.limit = Number(this.queryParams.limit) || 10;
    this.skip = (this.page - 1) * this.limit;
    this.query.skip = this.skip;
    this.query.take = this.limit;
    return this;
  }
  /*
  =========================
  SORT
  =========================
  */
  sort() {
    const sortBy = this.queryParams.sortBy || "createdAt";
    const sortOrder = this.queryParams.sortOrder === "asc" ? "asc" : "desc";
    this.query.orderBy = this.buildNestedRelationFilter(sortBy, sortOrder);
    return this;
  }
  /*
  =========================
  FIELD SELECTION
  =========================
  */
  fields() {
    const fields = this.queryParams.fields;
    if (!fields || typeof fields !== "string") return this;
    this.selectFields = {};
    fields.split(",").forEach((field) => {
      this.selectFields[field.trim()] = true;
    });
    this.query.select = this.selectFields;
    delete this.query.include;
    return this;
  }
  /*
  =========================
  INCLUDE RELATIONS
  =========================
  */
  include(relations) {
    if (this.selectFields) return this;
    this.query.include = {
      ...this.query.include,
      ...relations
    };
    return this;
  }
  dynamicInclude(includeConfig, defaultInclude) {
    if (this.selectFields) return this;
    const result = {};
    defaultInclude?.forEach((field) => {
      if (includeConfig[field]) result[field] = includeConfig[field];
    });
    const includeParam = this.queryParams.include;
    if (typeof includeParam === "string") {
      includeParam.split(",").forEach((relation) => {
        const trimmed = relation.trim();
        if (includeConfig[trimmed]) {
          result[trimmed] = includeConfig[trimmed];
        }
      });
    }
    this.query.include = {
      ...this.query.include,
      ...result
    };
    return this;
  }
  /*
  =========================
  WHERE MERGE
  =========================
  */
  where(condition) {
    this.query.where = this.deepMerge(
      this.query.where,
      condition
    );
    this.countQuery.where = this.deepMerge(
      this.countQuery.where,
      condition
    );
    return this;
  }
  /*
  =========================
  EXECUTE
  =========================
  */
  async execute() {
    const [total, data] = await Promise.all([
      this.model.count(this.countQuery),
      this.model.findMany(this.query)
    ]);
    return {
      data,
      meta: {
        page: this.page,
        limit: this.limit,
        total,
        totalPages: Math.ceil(total / this.limit)
      }
    };
  }
  /*
  =========================
  HELPERS
  =========================
  */
  parseFilterInput(value) {
    if (typeof value === "object" && !Array.isArray(value)) {
      return this.parseRangeFilter(value);
    }
    return this.parsePrimitive(value);
  }
  parsePrimitive(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    if (typeof value === "string" && !isNaN(Number(value))) {
      return Number(value);
    }
    if (Array.isArray(value)) {
      return { in: value };
    }
    return value;
  }
  parseRangeFilter(value) {
    const result = {};
    Object.entries(value).forEach(([op, val]) => {
      result[op] = typeof val === "string" && !isNaN(Number(val)) ? Number(val) : val;
    });
    return result;
  }
  normalizeQueryParams(params) {
    const normalized = {};
    Object.entries(params).forEach(([key, value]) => {
      const match = key.match(/^(.+)\[(.+)\]$/);
      if (!match) {
        normalized[key] = value;
        return;
      }
      const [, field, operator] = match;
      if (!normalized[field]) {
        normalized[field] = {};
      }
      normalized[field][operator] = value;
    });
    return normalized;
  }
  buildNestedRelationFilter(path4, value) {
    const parts = path4.split(".");
    if (parts.length === 1) {
      return { [path4]: value };
    }
    if (parts.length === 2) {
      return {
        [parts[0]]: {
          [parts[1]]: value
        }
      };
    }
    if (parts.length === 3) {
      return {
        [parts[0]]: {
          some: {
            [parts[1]]: {
              [parts[2]]: value
            }
          }
        }
      };
    }
    return {};
  }
  deepMerge(target, source) {
    const result = { ...target };
    Object.keys(source).forEach((key) => {
      if (typeof source[key] === "object" && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    });
    return result;
  }
};

// src/app/module/payment/payment.constant.ts
var paymentsSearchableFields = ["transactionId"];
var paymentsFilterableFields = [
  "paymentStatus"
];

// src/app/module/payment/payment.service.ts
var handlerStripeWebhookEvent = async (event) => {
  const existingPayment = await prisma.payments.findFirst({
    where: { stripeEventId: event.id }
  });
  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed` };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      const scheduleId = session.metadata?.scheduleId;
      const boatId = session.metadata?.boatId;
      const paymentId = session.metadata?.paymentId;
      if (!bookingId || !paymentId) {
        console.error("Missing bookingId or paymentId in session metadata");
        return { message: "Missing metadata" };
      }
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          user: true,
          schedule: true,
          boat: true
        }
      });
      if (!booking) {
        console.error(`Booking with id ${bookingId} not found`);
        return { message: "Booking not found" };
      }
      const isPaid = session.payment_status === "paid";
      try {
        const updatedPayment = await prisma.$transaction(async (tx) => {
          await tx.booking.update({
            where: { id: bookingId },
            data: {
              paymentStatus: isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
              bookingStatus: isPaid ? BookingStatus.CONFIRMED : BookingStatus.PENDING
            }
          });
          await tx.schedule.update({
            where: {
              id: scheduleId
            },
            data: {
              status: ScheduleStatus.COMPLETED
            }
          });
          await tx.boat.update({
            where: {
              id: boatId
            },
            data: {
              status: BoatStatus.UNAVAILABLE
            }
          });
          return await tx.payments.update({
            where: { id: paymentId },
            data: {
              stripeEventId: event.id,
              paymentStatus: isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
              paymentDate: /* @__PURE__ */ new Date(),
              paymentDetails: JSON.stringify(session),
              transactionId: session.payment_intent || `stripe_${Date.now()}`
            }
          });
        });
        if (isPaid) {
          try {
            const pdfBuffer = await generateInvoicePdf({
              invoiceId: updatedPayment.id,
              email: booking.user.email,
              bookingDate: booking.bookingDate,
              bookingNumber: booking.id,
              passengerName: booking.user.name,
              passengerEmail: booking.user.email,
              tripDate: booking.tripDate,
              boatName: booking.boat.boatName,
              amount: Number(updatedPayment.amount),
              currency: "BDT",
              transactionId: updatedPayment.transactionId,
              paymentDate: updatedPayment.createdAt.toISOString()
            });
            const uploadFile = await uploadFileToCloudinary(
              pdfBuffer,
              `bookings/invoices/inv-${paymentId}.pdf`
            );
            const invoiceUrl = uploadFile?.secure_url;
            await prisma.payments.update({
              where: { id: paymentId },
              data: {
                paymentDetails: JSON.stringify({ ...session, invoiceUrl })
              }
            });
            await sendEmail({
              to: booking.user.email,
              subject: `Booking Confirmed: ${booking.bookingNumber}`,
              templateName: "booking-confirmation",
              templateData: {
                userName: booking.user.name,
                bookingNumber: booking.bookingNumber,
                amount: updatedPayment.amount,
                invoiceUrl
              },
              attachments: [
                {
                  filename: `Invoice-${booking.bookingNumber}.pdf`,
                  content: pdfBuffer,
                  contentType: "application/pdf"
                }
              ]
            });
          } catch (err) {
            console.error("Post-processing (PDF/Email) failed:", err);
          }
        }
      } catch (error) {
        console.error("Transaction failed:", error);
        throw error;
      }
      break;
    }
    case "checkout.session.expired":
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      const paymentId = session.metadata?.paymentId;
      if (paymentId) {
        await prisma.payments.update({
          where: { id: paymentId },
          data: { paymentStatus: PaymentStatus.FAILED }
        });
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return { message: "Success" };
};
var getAllPayments = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.payments, query, {
    searchableFields: paymentsSearchableFields,
    filterableFields: paymentsFilterableFields
  });
  const result = await queryBuilder.search().filter().paginate().sort().execute();
  return result;
};
var getPaymentByTransaction = async (transactionId) => {
  return await prisma.payments.findUnique({
    where: { transactionId },
    include: { booking: true }
  });
};
var PaymentService = {
  handlerStripeWebhookEvent,
  getPaymentByTransaction,
  getAllPayments
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVariables.STRIPE_SECRET_KEY);

// src/app/module/payment/payment.controller.ts
var handleStripeWebhookEvent = catchAsync(
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = envVariables.STRIPE_WEB_HOOK;
    if (!signature || !webhookSecret) {
      return res.status(status4.BAD_REQUEST).json({
        success: false,
        message: "Missing Stripe signature or webhook secret"
      });
    }
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error(`\u274C Webhook Error: ${error.message}`);
      return res.status(status4.BAD_REQUEST).send(`Webhook Error: ${error.message}`);
    }
    const result = await PaymentService.handlerStripeWebhookEvent(event);
    sendResponse(res, {
      httpStatusCode: status4.OK,
      success: true,
      message: "Stripe webhook event processed successfully",
      data: result
    });
  }
);
var getPayments = catchAsync(async (req, res) => {
  const query = req.query;
  const payments = await PaymentService.getAllPayments(query);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "get payments ",
    data: payments.data,
    meta: payments.meta
  });
});
var PaymentController = {
  handleStripeWebhookEvent,
  getPayments
};

// src/app/routes/routes.ts
import { Router as Router4 } from "express";

// src/app/module/boat/boat.route.ts
import { Router } from "express";

// src/app/module/boat/boat.controller.ts
import status6 from "http-status";

// src/app/module/boat/boat.service.ts
import status5 from "http-status";

// src/app/module/boat/boat.constant.ts
var boatSearchableFields = ["boatName", "location"];
var boatFilterableFields = [
  "status",
  "boatType",
  "pricePerTrip",
  "manufacturer",
  "rating",
  "type",
  "capacity"
];

// src/app/module/boat/boat.service.ts
var getAllBoats = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.boat, query, {
    searchableFields: boatSearchableFields,
    filterableFields: boatFilterableFields
  });
  const result = await queryBuilder.search().filter().where({ status: BoatStatus.AVAILABLE }).paginate().sort().execute();
  return result;
};
var featuredBoats = async () => {
  const result = await prisma.boat.findMany({
    // where: {
    //   isApproved: true,
    // },
    orderBy: {
      rating: "desc"
    },
    take: 6
  });
  return result;
};
var createBoat = async (owner, boatData) => {
  const ownerId = owner.id;
  const result = await prisma.boat.create({
    data: {
      ...boatData,
      ownerId
    }
  });
  return result;
};
var getBoatById = async (id) => {
  const result = await prisma.boat.findFirst({
    where: {
      id
    }
    // include: {
    //   owner: true,
    //   reviews: true,
    //   schedules: true,
    //   license: true,
    //   boat_images: true,
    // },
  });
  if (!result) {
    throw new AppErrors_default(status5.NOT_FOUND, "Boat not found or not approved");
  }
  return result;
};
var getBoatReviews = async () => {
};
var updateBoat = async (id, payload, ownerId) => {
  const boat = await prisma.boat.findUnique({
    where: { id }
  });
  if (!boat) {
    throw new AppErrors_default(status5.NOT_FOUND, "Boat not found");
  }
  if (boat.ownerId !== ownerId) {
    throw new AppErrors_default(
      status5.FORBIDDEN,
      "You are not authorized to update this boat"
    );
  }
  const result = await prisma.boat.update({
    where: { id },
    data: payload
  });
  return result;
};
var deleteBoat = async (id, ownerId) => {
  const boat = await prisma.boat.findUnique({
    where: { id }
  });
  if (!boat) {
    throw new AppErrors_default(status5.NOT_FOUND, "Boat not found");
  }
  if (boat.ownerId !== ownerId) {
    throw new AppErrors_default(
      status5.FORBIDDEN,
      "Unauthorized action"
    );
  }
  const activeBooking = await prisma.booking.findFirst({
    where: {
      boatId: id,
      bookingStatus: BookingStatus.CONFIRMED
    }
  });
  if (activeBooking) {
    throw new AppErrors_default(
      status5.BAD_REQUEST,
      "Boat has active bookings"
    );
  }
  if (boat.primary_img) {
    await deleteFileFromCloudinary(boat.primary_img);
  }
  const result = await prisma.boat.delete({
    where: {
      id
    }
  });
  return result;
};
var getMyBoats = async (ownerId, query) => {
  const queryBuilder = new QueryBuilder(
    prisma.boat,
    query,
    {
      searchableFields: boatSearchableFields,
      filterableFields: boatFilterableFields
    }
  );
  const result = await queryBuilder.where({ ownerId }).search().filter().paginate().sort().dynamicInclude(
    {
      reviews: true,
      schedules: true,
      license: true,
      boat_images: true
    },
    ["boat_images"]
  ).execute();
  return result;
};
var boatService = {
  getAllBoats,
  createBoat,
  getBoatById,
  getBoatReviews,
  updateBoat,
  deleteBoat,
  getMyBoats,
  featuredBoats
};

// src/app/module/boat/boat.controller.ts
var getAllBoats2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await boatService.getAllBoats(query);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Boats fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var createBoat2 = catchAsync(async (req, res) => {
  const owner = req.user;
  const boatData = {
    ...req.body,
    primary_img: req.file?.path
  };
  const result = await boatService.createBoat(owner, boatData);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Boat created successfully",
    data: result
  });
});
var featuredBoats2 = catchAsync(async (req, res) => {
  const result = await boatService.featuredBoats();
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Routes fetched successfully",
    data: result
  });
});
var getBoatById2 = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await boatService.getBoatById(id);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Boat fetched successfully",
    data: result
  });
});
var getBoatReviews2 = catchAsync(async (req, res) => {
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Password reset successful"
  });
});
var updateBoat2 = catchAsync(async (req, res) => {
  const id = req.params.id;
  const ownerId = req.user?.id;
  const boatData = {
    ...req.body,
    primary_img: req.file?.path
  };
  const result = await boatService.updateBoat(
    id,
    boatData,
    ownerId
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Boat updated successfully",
    data: result
  });
});
var deleteBoat2 = catchAsync(async (req, res) => {
  const id = req.params.id;
  const ownerId = req.user?.id;
  const result = await boatService.deleteBoat(id, ownerId);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Boat deleted successfully",
    data: result
  });
});
var getMyBoats2 = catchAsync(async (req, res) => {
  const ownerId = req.user?.id;
  const query = req.query;
  const result = await boatService.getMyBoats(
    ownerId,
    query
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Your boats fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var boatController = {
  getAllBoats: getAllBoats2,
  createBoat: createBoat2,
  getBoatById: getBoatById2,
  getBoatReviews: getBoatReviews2,
  updateBoat: updateBoat2,
  deleteBoat: deleteBoat2,
  getMyBoats: getMyBoats2,
  featuredBoats: featuredBoats2
};

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var cookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/middleware/ckeckAuth.ts
import status7 from "http-status";

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodedToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodedToken
};

// src/app/middleware/ckeckAuth.ts
var checkAuth = (...authRole) => async (req, res, next) => {
  try {
    const session_token = cookieUtils.getCookie(
      req,
      "better-auth.session_token"
    );
    const accessToken = cookieUtils.getCookie(req, "accessToken");
    let userData = null;
    if (accessToken) {
      const verifyToken2 = jwtUtils.verifyToken(
        accessToken,
        envVariables.ACCESS_TOKEN_SECRET
      );
      if (verifyToken2.success) {
        userData = verifyToken2.data;
      }
    }
    if (!userData && session_token) {
      const sessionExists = await prisma.session.findFirst({
        where: {
          token: session_token,
          expiresAt: {
            gt: /* @__PURE__ */ new Date()
          }
        },
        include: {
          user: true
        }
      });
      if (sessionExists?.user) {
        const { user } = sessionExists;
        if (user.status === UserStatus.BANNED || user.status === UserStatus.SUSPENDED) {
          throw new AppErrors_default(
            status7.UNAUTHORIZED,
            "Your account is restricted."
          );
        }
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(sessionExists.expiresAt);
        const createdAt = new Date(sessionExists.createdAt);
        const percentRemaining = (expiresAt.getTime() - now.getTime()) / (expiresAt.getTime() - createdAt.getTime()) * 100;
        if (percentRemaining < 20) {
          res.setHeader("X-Session-Refresh", "true");
        }
        userData = user;
      }
    }
    if (!userData) {
      throw new AppErrors_default(
        status7.UNAUTHORIZED,
        "Authentication required. Please login."
      );
    }
    if (authRole.length > 0 && !authRole.includes(userData.role)) {
      throw new AppErrors_default(
        status7.FORBIDDEN,
        "You do not have permission to perform this action."
      );
    }
    req.user = {
      id: userData.userId,
      name: userData.name,
      email: userData.email,
      role: userData.role
    };
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    const parsedresult = zodSchema.safeParse(req.body);
    if (!parsedresult.success) {
      next(parsedresult.error);
    }
    req.body = parsedresult.data;
    next();
  };
};

// src/app/module/boat/boat.validation.ts
import z from "zod";
var BoatTypeEnum = z.enum(["SPEEDBOAT", "FERRY", "LAUNCH", "PRIVATE", "YACHT", "CATAMARAN"]);
var BoatStatusEnum = z.enum(["AVAILABLE", "UNAVAILABLE", "MAINTENANCE", "SUSPENDED"]);
var createBoatSchema = z.object({
  boatName: z.string().min(1).max(150),
  boatType: BoatTypeEnum,
  status: BoatStatusEnum,
  // Added optional primary image (usually a URL string from a file upload)
  primary_img: z.string().url().optional().nullable(),
  capacity: z.coerce.number().int().positive(),
  boatCondition: z.string().min(1),
  location: z.string().min(1),
  pricePerTrip: z.coerce.number().int().nonnegative(),
  description: z.string().min(10, "Description should be more detailed"),
  length: z.coerce.number().positive(),
  width: z.coerce.number().positive(),
  engineCapacity: z.coerce.number().int().positive(),
  manufacturer: z.string().min(1),
  manufacturingYear: z.coerce.number().int().min(1900).max((/* @__PURE__ */ new Date()).getFullYear() + 1),
  specifications: z.string().min(1),
  amenities: z.array(z.string()).default([]),
  cancellationPolicy: z.string().min(1)
});
var updateBoatSchema = createBoatSchema.partial();
var createScheduleSchema = z.object({
  routeId: z.string(),
  departureDate: z.string().datetime(),
  departureTime: z.string(),
  arrivalTime: z.string(),
  availableSeats: z.number().int().positive(),
  recurringPattern: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional()
});

// src/config/multer.config.ts
import multer from "multer";
import pkg from "multer-storage-cloudinary";
var { CloudinaryStorage } = pkg;
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `boat-sea/${folder}`,
      public_id: uniqueName,
      resource_type: "auto"
    };
  }
});
var multerUpload = multer({ storage });

// src/app/module/boat/boat.route.ts
var router = Router();
router.get("/", boatController.getAllBoats);
router.post(
  "/create-boat",
  checkAuth(UserRole.BOAT_OWNER),
  multerUpload.single("images"),
  validateRequest(createBoatSchema),
  boatController.createBoat
);
router.get(
  "/my-boats",
  checkAuth(UserRole.BOAT_OWNER),
  boatController.getMyBoats
);
router.get(
  "/featuredBoats",
  boatController.featuredBoats
);
router.get("/:id", boatController.getBoatById);
router.put(
  "/:id",
  checkAuth(UserRole.BOAT_OWNER),
  multerUpload.single("images"),
  validateRequest(updateBoatSchema),
  boatController.updateBoat
);
router.delete(
  "/:id",
  checkAuth(UserRole.BOAT_OWNER),
  boatController.deleteBoat
);
var BoatRoutes = router;

// src/app/module/auth/auth.route.ts
import { Router as Router2 } from "express";

// src/app/module/auth/auth.service.ts
import status8 from "http-status";

// src/app/utils/token.ts
import ms2 from "ms";
var parseMs2 = (value) => ms2(value);
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(payload, envVariables.ACCESS_TOKEN_SECRET, { expiresIn: envVariables.ACCESS_TOKEN_EXPIRES_IN });
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken3 = jwtUtils.createToken(payload, envVariables.REFRESH_TOKEN_SECRET, { expiresIn: envVariables.REFRESH_TOKEN_EXPIRES_IN });
  return refreshToken3;
};
var setAccessTokenCookie = (res, token) => {
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: parseMs2(envVariables.ACCESS_TOKEN_EXPIRES_IN)
  });
};
var setRefreshTokenCookie = (res, token) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: parseMs2(envVariables.REFRESH_TOKEN_EXPIRES_IN)
  });
};
var setBetterAuthCookie = (res, token) => {
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: parseMs2(envVariables.BETTER_AUTH_TOKEN_EXPIRES_IN)
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthCookie
};

// src/app/module/auth/auth.service.ts
var register = async (payload) => {
  let { name, email, password, role } = payload;
  email = email.toLowerCase().trim();
  try {
    const data = await auth.api.signUpEmail({
      body: { name, email, password, role }
    });
    if (!data || !data.user) {
      throw new AppErrors_default(status8.INTERNAL_SERVER_ERROR, "Failed to register");
    }
    console.log("User created by better-auth:", {
      id: data.user.id,
      email: data.user.email,
      emailVerified: data.user.emailVerified,
      status: data.user.status
    });
    let updatedUser;
    try {
      updatedUser = await prisma.user.update({
        where: { email },
        data: {
          emailVerified: true,
          status: UserStatus.ACTIVE
        }
      });
      console.log("User updated successfully:", {
        id: updatedUser.id,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        status: updatedUser.status
      });
    } catch (updateError) {
      console.error("Error updating user status:", {
        error: updateError.message,
        code: updateError.code,
        email,
        meta: updateError.meta
      });
      const dbUser = await prisma.user.findUnique({
        where: { email }
      });
      if (!dbUser) {
        throw new AppErrors_default(
          status8.INTERNAL_SERVER_ERROR,
          "Could not retrieve created user"
        );
      }
      updatedUser = dbUser;
    }
    const jwtPayload = {
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role
    };
    const accessToken = tokenUtils.getAccessToken(jwtPayload);
    const refreshToken3 = tokenUtils.getRefreshToken(jwtPayload);
    if (!accessToken || !refreshToken3) {
      console.error("Token generation failed:", {
        accessTokenExists: !!accessToken,
        refreshTokenExists: !!refreshToken3,
        payload: jwtPayload
      });
      throw new AppErrors_default(
        status8.INTERNAL_SERVER_ERROR,
        "Failed to generate authentication tokens"
      );
    }
    return {
      user: updatedUser,
      accessToken,
      refreshToken: refreshToken3
    };
  } catch (error) {
    console.error("Register service error:", {
      error: error.message,
      code: error.code,
      email
    });
    throw error;
  }
};
var login = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (!data.user) {
    throw new AppErrors_default(
      status8.INTERNAL_SERVER_ERROR,
      "Faild to register Customar"
    );
  }
  const user = data.user;
  const isDeleted = await prisma.user.findUnique({
    where: {
      id: user.id
    }
  });
  if (isDeleted?.isDeleted) {
    throw new AppErrors_default(status8.FORBIDDEN, "Your account is deleted");
  }
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };
  const accessToken = tokenUtils.getAccessToken(jwtPayload);
  const refreshToken3 = tokenUtils.getRefreshToken(jwtPayload);
  return {
    ...data,
    token: data.token,
    accessToken,
    refreshToken: refreshToken3
  };
};
var verifyEmail = async (email, otp) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  });
  if (!result.user) {
    throw new AppErrors_default(status8.BAD_REQUEST, "Invalid OTP or email");
  }
  let user = result.user;
  if (!user.emailVerified) {
    user = await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        status: UserStatus.ACTIVE
      }
    });
  }
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };
  const accessToken = tokenUtils.getAccessToken(jwtPayload);
  const refreshToken3 = tokenUtils.getRefreshToken(jwtPayload);
  return {
    user,
    accessToken,
    refreshToken: refreshToken3
  };
};
var refreshToken = async (currentRefreshToken) => {
  if (!currentRefreshToken) {
    throw new AppErrors_default(status8.BAD_REQUEST, "Refresh token is required");
  }
  const verifyResult = jwtUtils.verifyToken(
    currentRefreshToken,
    envVariables.REFRESH_TOKEN_SECRET
  );
  if (!verifyResult.success) {
    throw new AppErrors_default(
      status8.UNAUTHORIZED,
      "Invalid or expired refresh token"
    );
  }
  const payload = verifyResult.data;
  if (!payload?.userId || !payload?.email || !payload?.role) {
    throw new AppErrors_default(status8.UNAUTHORIZED, "Invalid token payload");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: payload.userId,
    email: payload.email,
    role: payload.role
  });
  const refreshToken3 = tokenUtils.getRefreshToken({
    userId: payload.userId,
    email: payload.email,
    role: payload.role
  });
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var logout = async (sessionToken) => {
  if (!sessionToken) {
    throw new AppErrors_default(
      status8.BAD_REQUEST,
      "Session token is required for logout"
    );
  }
  await prisma.session.deleteMany({
    where: {
      token: sessionToken
    }
  });
  return {
    success: true
  };
};
var forgotPassword = async (email) => {
  await auth.api.requestPasswordReset({
    body: {
      email,
      redirectTo: `${envVariables.FRONTEND_URL}/reset-password`
    }
  });
  return { success: true };
};
var resetPassword = async (password, token) => {
  const result = await auth.api.resetPassword({
    body: {
      newPassword: password,
      token
    }
  });
  if (!result) {
    throw new AppErrors_default(status8.BAD_REQUEST, "Invalid or expired reset token");
  }
  return { success: true };
};
var getMe = async (userId) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  return result;
};
var googleLoginSuccess = async (session) => {
  const isCustomerExists = await prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  });
  if (!isCustomerExists) {
    await prisma.user.create({
      data: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email
  });
  const refreshToken3 = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email
  });
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var resendVerificationEmail = async (email) => {
  const result = await auth.api.sendVerificationEmail({
    body: {
      email
    }
  });
  return {
    success: true,
    message: "Verification code resent successfully",
    data: result
  };
};
var AuthService = {
  register,
  login,
  verifyEmail,
  refreshToken,
  logout,
  forgotPassword,
  googleLoginSuccess,
  getMe,
  resetPassword,
  resendVerificationEmail
};

// src/app/module/auth/auth.controller.ts
import status9 from "http-status";
var register2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.register(payload);
  const { accessToken, refreshToken: refreshToken3, user } = result;
  if (!accessToken || !refreshToken3) {
    console.error("Missing tokens in response", {
      accessToken: !!accessToken,
      refreshToken: !!refreshToken3,
      userId: user?.id,
      email: user?.email
    });
    throw new AppErrors_default(
      status9.INTERNAL_SERVER_ERROR,
      "Failed to generate authentication tokens"
    );
  }
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken3);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Account created successfully",
    data: {
      accessToken,
      refreshToken: refreshToken3,
      user
    }
  });
});
var login2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.login(payload);
  const { accessToken, refreshToken: refreshToken3, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken3);
  tokenUtils.setBetterAuthCookie(res, token);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Login successfully",
    data: {
      accessToken,
      refreshToken: refreshToken3,
      token,
      ...rest
    }
  });
});
var verifyEmail2 = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const result = await AuthService.verifyEmail(email, otp);
  const { accessToken, refreshToken: refreshToken3, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken3);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Email verified successfully",
    data: {
      accessToken,
      refreshToken: refreshToken3,
      ...rest
    }
  });
});
var refreshToken2 = catchAsync(async (req, res) => {
  const refreshToken3 = req.cookies.refreshToken;
  const tokens = await AuthService.refreshToken(refreshToken3);
  tokenUtils.setAccessTokenCookie(res, tokens.accessToken);
  tokenUtils.setRefreshTokenCookie(res, tokens.refreshToken);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Refresh token generated",
    data: tokens
  });
});
var logout2 = catchAsync(async (req, res) => {
  const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");
  await AuthService.logout(sessionToken);
  cookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
  });
  cookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
  });
  cookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
  });
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Logged out successfully",
    data: { success: true }
  });
});
var forgotPassword2 = catchAsync(async (req, res) => {
  const email = req.body.email?.toLowerCase().trim();
  if (!email) {
    throw new AppErrors_default(status9.BAD_REQUEST, "Email is required");
  }
  await AuthService.forgotPassword(email);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "If this email exists, a reset link has been sent",
    data: null
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) {
    throw new AppErrors_default(status9.BAD_REQUEST, "Password and token are required");
  }
  await AuthService.resetPassword(password, token);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Password has been reset successfully",
    data: null
  });
});
var googleLogin = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath);
  const backendUrl = envVariables.BETTER_AUTH_URL.includes("/api/auth") ? envVariables.BETTER_AUTH_URL.split("/api/auth")[0] : envVariables.BETTER_AUTH_URL;
  const callbackURL = `${backendUrl}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", { callbackURL });
});
var googleLoginSuccess2 = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"];
  if (!sessionToken) {
    return res.redirect(`${envVariables.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: {
      "Cookie": `better-auth.session_token=${sessionToken}`
    }
  });
  if (!session) {
    return res.redirect(`${envVariables.FRONTEND_URL}/login?error=no_session_found`);
  }
  if (session && !session.user) {
    return res.redirect(`${envVariables.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const result = await AuthService.googleLoginSuccess(session);
  const { accessToken, refreshToken: refreshToken3 } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken3);
  const isValidRedirect = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirect = isValidRedirect ? `${envVariables.FRONTEND_URL}${redirectPath}` : envVariables.FRONTEND_URL;
  res.redirect(finalRedirect);
});
var handleAuthError = catchAsync(async (req, res) => {
  const error = req.query.error || "oauth_failed";
  res.redirect(`${envVariables.FRONTEND_URL}/login?error=${error}`);
});
var getMe2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await AuthService.getMe(userId);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "get your user Info",
    data: result
  });
});
var resendVerificationEmail2 = catchAsync(
  async (req, res) => {
    const { email } = req.body;
    const result = await AuthService.resendVerificationEmail(email);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Verification code resent successfully",
      data: result
    });
  }
);
var AuthController = {
  register: register2,
  login: login2,
  verifyEmail: verifyEmail2,
  refreshToken: refreshToken2,
  logout: logout2,
  forgotPassword: forgotPassword2,
  googleLogin,
  googleLoginSuccess: googleLoginSuccess2,
  handleAuthError,
  getMe: getMe2,
  resetPassword: resetPassword2,
  resendVerificationEmail: resendVerificationEmail2
};

// src/app/module/auth/auth.validation.ts
import { z as z2 } from "zod";
var loginZodSchema = z2.object({
  email: z2.email("Invalid email address"),
  password: z2.string().min(1, "Password is required").min(2, "Password must be at least 8 chareacters log")
});
var registerZodSchema = z2.object({
  name: z2.string("User name is required"),
  email: z2.string("Enter your email"),
  password: z2.string().min(1, "Password is required").min(8, "Password must be at least 8 chareacters log"),
  role: z2.string().optional()
});
var resendVerificationEmailZodSchema = z2.object({
  email: z2.string("Enter your email")
});
var changepasswordZodSchema = z2.object({
  newPassword: z2.string("Enter your New Password"),
  currentPassword: z2.string("Enter Old Password")
});

// src/app/module/auth/auth.route.ts
var router2 = Router2();
router2.post("/register", validateRequest(registerZodSchema), AuthController.register);
router2.post("/verify-email", AuthController.verifyEmail);
router2.post("/resend-verification-email", validateRequest(resendVerificationEmailZodSchema), AuthController.resendVerificationEmail);
router2.post("/login", validateRequest(loginZodSchema), AuthController.login);
router2.post("/refresh-token", AuthController.refreshToken);
router2.post("/logout", AuthController.logout);
router2.post("/reset-password", AuthController.resetPassword);
router2.post("/forgot-password", AuthController.forgotPassword);
router2.get("/me", checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN), AuthController.getMe);
router2.get("/login/google", AuthController.googleLogin);
router2.get("/google/success", AuthController.googleLoginSuccess);
router2.get("/oauth/error", AuthController.handleAuthError);
var AuthRoutes = router2;

// src/app/module/user/user.route.ts
import { Router as Router3 } from "express";

// src/app/module/user/user.controller.ts
import status10 from "http-status";

// src/app/module/user/user.constant.ts
var userSearchableFields = ["email"];
var userFilterableFields = [
  "role",
  "status",
  "isDeleted"
];

// src/app/module/user/user.service.ts
var getProfile = async (userId) => {
  return await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      bookings: true,
      reviews: true
    }
  });
};
var getAlluser = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.user, query, {
    searchableFields: userSearchableFields,
    filterableFields: userFilterableFields
  });
  const result = await queryBuilder.search().filter().paginate().sort().execute();
  return result;
};
var updateProfile = async (userId, payload) => {
  return await prisma.user.update({
    where: { id: userId },
    data: payload
  });
};
var updateRole = async (userId, role) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      role
    }
  });
};
var getMyBookings = async (userId) => {
  return await prisma.booking.findMany({
    where: { userId },
    include: {
      boat: true,
      schedule: true,
      tickets: true
    }
  });
};
var getMyReviews = async (userId) => {
  return await prisma.review.findMany({
    where: { userId },
    include: {
      boat: true
    }
  });
};
var getNotifications = async (userId) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var markNotificationRead = async (id, userId) => {
  return await prisma.notification.updateMany({
    where: {
      id,
      userId
    },
    data: {
      isRead: true,
      readAt: /* @__PURE__ */ new Date()
    }
  });
};
var deleteAccount = async (userId) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date(),
      status: UserStatus.SUSPENDED
    }
  });
};
var userService = {
  getProfile,
  getAlluser,
  updateProfile,
  updateRole,
  getMyBookings,
  getMyReviews,
  getNotifications,
  markNotificationRead,
  deleteAccount
};

// src/app/module/user/user.controller.ts
var getProfile2 = catchAsync(async (req, res) => {
  const result = await userService.getProfile(req.user?.id);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Profile fetched successfully",
    data: result
  });
});
var getAlluser2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await userService.getAlluser(query);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Profile fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var updateProfile2 = catchAsync(async (req, res) => {
  const userData = {
    ...req.body,
    image: req.file?.path
  };
  const result = await userService.updateProfile(
    req.user?.id,
    userData
  );
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Profile updated successfully",
    data: result
  });
});
var updateRole2 = catchAsync(async (req, res) => {
  const { id, role } = req.body;
  const result = await userService.updateRole(id, role);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Role updated successfully",
    data: result
  });
});
var getMyBookings2 = catchAsync(async (req, res) => {
  const result = await userService.getMyBookings(req.user?.id);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Bookings fetched successfully",
    data: result
  });
});
var getMyReviews2 = catchAsync(async (req, res) => {
  const result = await userService.getMyReviews(req.user?.id);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result
  });
});
var getNotifications2 = catchAsync(async (req, res) => {
  const result = await userService.getNotifications(req.user?.id);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Notifications fetched successfully",
    data: result
  });
});
var markNotificationRead2 = catchAsync(async (req, res) => {
  const result = await userService.markNotificationRead(
    req.params.id,
    req.user?.id
  );
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Notification marked as read",
    data: result
  });
});
var deleteAccount2 = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const result = await userService.deleteAccount(userId);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Account deleted successfully",
    data: result
  });
});
var userController = {
  getProfile: getProfile2,
  updateProfile: updateProfile2,
  getAlluser: getAlluser2,
  updateRole: updateRole2,
  getMyBookings: getMyBookings2,
  getMyReviews: getMyReviews2,
  getNotifications: getNotifications2,
  markNotificationRead: markNotificationRead2,
  deleteAccount: deleteAccount2
};

// src/app/module/user/user.validation.ts
import { z as z3 } from "zod";
var updateProfileZodSchema = z3.object({
  name: z3.string().optional(),
  image: z3.string().optional()
});
var updateRoleValidationSchema = z3.object({
  id: z3.string(),
  role: z3.nativeEnum(UserRole)
});

// src/app/module/user/user.route.ts
var router3 = Router3();
router3.get(
  "/profile",
  checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.getProfile
);
router3.get(
  "/getalluser",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.getAlluser
);
router3.put("/updaterole", validateRequest(updateRoleValidationSchema), userController.updateRole);
router3.put(
  "/profile",
  checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  multerUpload.single("images"),
  validateRequest(updateProfileZodSchema),
  userController.updateProfile
);
router3.get(
  "/bookings",
  checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER),
  userController.getMyBookings
);
router3.get(
  "/reviews",
  checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER),
  userController.getMyReviews
);
router3.get(
  "/notifications",
  checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER),
  userController.getNotifications
);
router3.put(
  "/notifications/:id/read",
  checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER),
  userController.markNotificationRead
);
router3.delete(
  "/account-delete/:id",
  // checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.deleteAccount
);
var UserRoutes = router3;

// src/app/module/route/route.routes.ts
import express from "express";

// src/app/module/route/route.controller.ts
import status11 from "http-status";

// src/app/module/route/route.constant.ts
var routeSearchableFields = ["name"];
var routeFilterableFields = [
  "difficulty"
];

// src/app/module/route/route.service.ts
var createRoute = async (payload) => {
  const result = await prisma.route.create({
    data: payload
  });
  return result;
};
var getAllRoutes = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.route, query, {
    searchableFields: routeSearchableFields,
    filterableFields: routeFilterableFields
  });
  const result = await queryBuilder.search().filter().paginate().sort().execute();
  return result;
};
var getSingleRoute = async (id) => {
  return await prisma.route.findUniqueOrThrow({
    where: { id }
  });
};
var updateRoute = async (id, payload) => {
  return await prisma.route.update({
    where: { id },
    data: payload
  });
};
var deleteRoute = async (id) => {
  return await prisma.route.delete({
    where: { id }
  });
};
var RouteService = {
  createRoute,
  getAllRoutes,
  getSingleRoute,
  updateRoute,
  deleteRoute
};

// src/app/module/route/route.controller.ts
var createRoute2 = catchAsync(async (req, res) => {
  const routeData = {
    ...req.body,
    image: req.file?.path
  };
  const result = await RouteService.createRoute(routeData);
  sendResponse(res, {
    httpStatusCode: status11.CREATED,
    success: true,
    message: "Route created successfully",
    data: result
  });
});
var getAllRoutes2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await RouteService.getAllRoutes(query);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Routes fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getSingleRoute2 = catchAsync(async (req, res) => {
  const result = await RouteService.getSingleRoute(req.params.id);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Route fetched successfully",
    data: result
  });
});
var updateRoute2 = catchAsync(async (req, res) => {
  const routeData = {
    ...req.body,
    image: req.file?.path
  };
  const result = await RouteService.updateRoute(
    req.params.id,
    routeData
  );
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Route updated successfully",
    data: result
  });
});
var deleteRoute2 = catchAsync(async (req, res) => {
  const result = await RouteService.deleteRoute(req.params.id);
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Route deleted successfully",
    data: result
  });
});
var RouteController = {
  createRoute: createRoute2,
  getAllRoutes: getAllRoutes2,
  getSingleRoute: getSingleRoute2,
  updateRoute: updateRoute2,
  deleteRoute: deleteRoute2
};

// src/app/module/route/route.validation.ts
import { z as z4 } from "zod";
var RouteDifficultyEnum = z4.enum(["EASY", "MODERATE", "HARD"]);
var createRouteZodSchema = z4.object({
  name: z4.string().min(3).max(150),
  difficulty: RouteDifficultyEnum,
  duration: z4.string().min(3),
  distance: z4.string().min(2),
  scenicHighlights: z4.string().min(5),
  description: z4.string().optional(),
  image: z4.string().optional()
});
var updateRouteZodSchema = createRouteZodSchema.partial();

// src/app/module/route/route.routes.ts
var router4 = express.Router();
router4.post(
  "/create-route",
  checkAuth(UserRole.ADMIN),
  multerUpload.single("images"),
  validateRequest(createRouteZodSchema),
  RouteController.createRoute
);
router4.get("/", RouteController.getAllRoutes);
router4.get("/:id", RouteController.getSingleRoute);
router4.patch(
  "/:id",
  checkAuth(UserRole.ADMIN),
  multerUpload.single("images"),
  validateRequest(updateRouteZodSchema),
  RouteController.updateRoute
);
router4.delete(
  "/:id",
  checkAuth(UserRole.ADMIN),
  RouteController.deleteRoute
);
var RouteRoutes = router4;

// src/app/module/review/review.route.ts
import express2 from "express";

// src/app/module/review/review.controller.ts
import status12 from "http-status";

// src/app/module/review/review.service.ts
var createReview = async (userId, payload) => {
  return await prisma.$transaction(async (tx) => {
    const newReview = await tx.review.create({
      data: {
        userId,
        ...payload
      }
    });
    const aggregate = await tx.review.aggregate({
      where: { boatId: payload.boatId },
      _avg: { rating: true },
      _count: { id: true }
    });
    const newAvgRating = aggregate._avg.rating || 0;
    const newTotalReviews = aggregate._count.id || 0;
    await tx.boat.update({
      where: { id: payload.boatId },
      data: {
        rating: newAvgRating,
        totalReviews: newTotalReviews
      }
    });
    return newReview;
  });
};
var getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    where: {
      isVerified: true
    },
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 6
  });
  return reviews.map((review) => ({
    id: review.id,
    reviewerName: review.user?.name ?? "Anonymous",
    reviewerImage: review.user?.image ?? null,
    boatId: review.boatId,
    rating: review.rating,
    comment: review.comment ?? "No comment provided",
    images: review.images ?? [],
    isVerified: review.isVerified,
    createdAt: review.createdAt
  }));
};
var getSingleReview = async (id) => {
  const results = await prisma.review.findMany({
    where: {
      boatId: id,
      isVerified: true
    },
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return results.map((result) => ({
    id: result.id,
    reviewerName: result.user?.name ?? "Anonymous",
    reviewerImage: result.user?.image ?? null,
    boatId: result.boatId,
    rating: result.rating,
    comment: result.comment ?? "No comment provided",
    images: result.images ?? [],
    isVerified: result.isVerified,
    createdAt: result.createdAt
  }));
};
var updateReview = async (id, payload) => {
  return await prisma.review.update({
    where: { id },
    data: payload
  });
};
var myReview = async (userId) => {
  const reviews = await prisma.review.findMany({
    where: {
      userId
    },
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 10
  });
  return reviews.map((review) => ({
    id: review.id,
    reviewerName: review.user?.name ?? "Anonymous",
    reviewerImage: review.user?.image ?? null,
    boatId: review.boatId,
    rating: review.rating,
    comment: review.comment ?? "No comment provided",
    images: review.images ?? [],
    isVerified: review.isVerified,
    createdAt: review.createdAt
  }));
};
var deleteReview = async (id) => {
  return await prisma.review.delete({
    where: { id }
  });
};
var ReviewService = {
  createReview,
  myReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview
};

// src/app/module/review/review.controller.ts
var myReview2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await ReviewService.myReview(userId);
  sendResponse(res, {
    httpStatusCode: status12.CREATED,
    success: true,
    message: "get my Review successfully",
    data: result
  });
});
var createReview2 = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await ReviewService.createReview(
    userId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status12.CREATED,
    success: true,
    message: "Review created successfully",
    data: result
  });
});
var getAllReviews2 = catchAsync(async (req, res) => {
  const result = await ReviewService.getAllReviews();
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result
  });
});
var getSingleReview2 = catchAsync(async (req, res) => {
  const result = await ReviewService.getSingleReview(
    req.params.id
  );
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Review fetched successfully",
    data: result
  });
});
var updateReview2 = catchAsync(async (req, res) => {
  const reviewId = req.params.id;
  const data = req.body;
  const result = await ReviewService.updateReview(reviewId, data);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Review updated successfully",
    data: result
  });
});
var deleteReview2 = catchAsync(async (req, res) => {
  const result = await ReviewService.deleteReview(
    req.params.id
  );
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Review deleted successfully",
    data: result
  });
});
var ReviewController = {
  createReview: createReview2,
  myReview: myReview2,
  getAllReviews: getAllReviews2,
  getSingleReview: getSingleReview2,
  updateReview: updateReview2,
  deleteReview: deleteReview2
};

// src/app/module/review/review.validation.ts
import { z as z5 } from "zod";
var createReviewZodSchema = z5.object({
  boatId: z5.string(),
  rating: z5.number().min(1).max(5),
  comment: z5.string().optional(),
  images: z5.array(z5.string()).optional()
});
var updateReviewZodSchema = z5.object({
  rating: z5.number().min(1).max(5).optional(),
  comment: z5.string().optional(),
  images: z5.array(z5.string()).optional(),
  isVerified: z5.boolean().optional()
});

// src/app/module/review/review.route.ts
var router5 = express2.Router();
router5.post(
  "/",
  checkAuth(UserRole.CUSTOMER, UserRole.ADMIN),
  validateRequest(createReviewZodSchema),
  ReviewController.createReview
);
router5.get("/my-review", checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER), ReviewController.myReview);
router5.get("/", ReviewController.getAllReviews);
router5.get("/:id", ReviewController.getSingleReview);
router5.patch(
  "/:id",
  checkAuth(UserRole.CUSTOMER, UserRole.ADMIN),
  validateRequest(updateReviewZodSchema),
  ReviewController.updateReview
);
router5.delete(
  "/:id",
  checkAuth(UserRole.ADMIN),
  ReviewController.deleteReview
);
var ReviewRoutes = router5;

// src/app/module/booking/booking.route.ts
import express3 from "express";

// src/app/module/booking/booking.validation.ts
import { z as z6 } from "zod";
var createBookingSchema = z6.object({
  scheduleId: z6.string(),
  boatId: z6.string(),
  tripDate: z6.coerce.date(),
  totalGuests: z6.number().positive().min(1),
  totalAmount: z6.number().positive(),
  paymentMethod: z6.string(),
  passengerDetails: z6.any(),
  emergencyContact: z6.string().optional(),
  specialRequests: z6.string().optional()
});

// src/app/module/booking/booking.controller.ts
import status14 from "http-status";

// src/app/module/booking/booking.service.ts
import status13 from "http-status";
import { v7 as uuidv7 } from "uuid";
import { nanoid } from "nanoid";

// src/app/module/booking/bookin.constant.ts
var bookingSearchableFields = ["bookingNumber"];
var bookingFilterableFields = [
  "role",
  "status",
  "isDeleted",
  "bookingStatus"
];

// src/app/module/booking/booking.service.ts
var createBooking = async (userId, userEmail, payload) => {
  if (!userId) {
    throw new AppErrors_default(status13.UNAUTHORIZED, "User ID is required to create a booking");
  }
  return await prisma.$transaction(async (tx) => {
    const boat = await tx.boat.findUnique({
      where: { id: payload.boatId }
    });
    if (!boat || boat.status !== "AVAILABLE") {
      throw new AppErrors_default(
        status13.NOT_FOUND,
        "Boat is not available for booking"
      );
    }
    if (boat.capacity < payload.totalGuests) {
      throw new AppErrors_default(
        status13.BAD_REQUEST,
        `Beyond boat capacity. Max: ${boat.capacity}`
      );
    }
    const booking = await tx.booking.create({
      data: {
        id: uuidv7(),
        bookingNumber: `BT-${nanoid(7).toUpperCase()}`,
        userId,
        scheduleId: payload.scheduleId,
        boatId: payload.boatId,
        totalGuests: payload.totalGuests,
        totalAmount: payload.totalAmount,
        passengerDetails: payload.passengerDetails,
        bookingStatus: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        tripDate: payload.tripDate
      }
    });
    const payment = await tx.payments.create({
      data: {
        id: uuidv7(),
        bookingId: booking.id,
        amount: payload.totalAmount,
        currency: "USD",
        paymentMethod: "STRIPE",
        transactionId: `temp_${nanoid(10)}`,
        // Will be updated by webhook
        paymentStatus: PaymentStatus.PENDING
      }
    });
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: userEmail,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Boat Trip: ${boat.boatName}`,
                description: `Booking for ${payload.totalGuests} guests`
              },
              unit_amount: Math.round(payload.totalAmount * 100)
              // Convert to cents
            },
            quantity: 1
          }
        ],
        metadata: {
          bookingId: booking.id,
          scheduleId: payload.scheduleId,
          boatId: payload.boatId,
          paymentId: payment.id
        },
        success_url: `${envVariables.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${envVariables.FRONTEND_URL}/booking-cancelled`
      });
      return {
        booking,
        payment,
        paymentUrl: session.url
      };
    } catch (stripeError) {
      console.error("Stripe Session Error:", stripeError);
      throw new AppErrors_default(
        status13.INTERNAL_SERVER_ERROR,
        "Failed to initialize payment gateway"
      );
    }
  });
};
var getAllBookings = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.booking, query, {
    searchableFields: bookingSearchableFields,
    filterableFields: bookingFilterableFields
  });
  const result = await queryBuilder.search().filter().paginate().sort().execute();
  return result;
};
var getBookingRequest = async (query, ownerid) => {
  const boats = await prisma.boat.findMany({
    where: {
      ownerId: ownerid
    }
  });
  const boatIds = boats.map((boat) => boat.id);
  const queryBuilder = new QueryBuilder(prisma.booking, query, {
    searchableFields: bookingSearchableFields,
    filterableFields: bookingFilterableFields
  });
  const result = await queryBuilder.where({
    boatId: { in: boatIds }
  }).search().filter().paginate().sort().execute();
  return result;
};
var getMyBookings3 = async (userId) => {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: {
      schedule: true,
      payments: true,
      boat: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return bookings.map((booking) => ({
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    boatName: booking.boat?.boatName,
    boatId: booking.boatId,
    tripDate: booking.tripDate,
    departureTime: booking.schedule?.departureTime,
    totalGuests: booking.totalGuests,
    totalAmount: booking.totalAmount,
    bookingStatus: booking.bookingStatus,
    paymentStatus: booking.paymentStatus,
    invoiceUrl: booking.payments?.[0] && booking.payments[0].paymentDetails ? JSON.parse(booking.payments[0].paymentDetails)?.invoiceUrl : null
  }));
};
var cancelBooking = async (userId, bookingId) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId
    }
  });
  if (!booking) {
    throw new AppErrors_default(status13.NOT_FOUND, "Booking not found");
  }
  if (booking.bookingStatus == BookingStatus.COMPLETED) {
    throw new AppErrors_default(status13.BAD_REQUEST, "Booking All ready Completed");
  }
  if (booking.userId !== userId) {
    throw new AppErrors_default(status13.FORBIDDEN, "You are not authorized to cancel this booking");
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        bookingStatus: BookingStatus.CANCELLED,
        paymentStatus: PaymentStatus.PENDING
        // Or REFUNDED depending on your logic
      }
    });
    await tx.boat.update({
      where: { id: booking.boatId },
      data: { status: BoatStatus.AVAILABLE }
    });
    await tx.schedule.update({
      where: { id: booking.scheduleId },
      data: { status: ScheduleStatus.CANCELLED }
    });
    return updatedBooking;
  });
  return result;
};
var bookingService = {
  createBooking,
  getMyBookings: getMyBookings3,
  cancelBooking,
  getAllBookings,
  getBookingRequest
};

// src/app/module/booking/booking.controller.ts
var createBooking2 = catchAsync(
  async (req, res) => {
    const userId = req.user?.id;
    const userEmail = req.user?.email;
    const result = await bookingService.createBooking(
      userId,
      userEmail,
      req.body
    );
    sendResponse(res, {
      httpStatusCode: status14.CREATED,
      success: true,
      message: "Booking created successfully",
      data: result
    });
  }
);
var getMyBookings4 = catchAsync(
  async (req, res) => {
    const userId = req.user?.id;
    const result = await bookingService.getMyBookings(
      userId
    );
    sendResponse(res, {
      httpStatusCode: status14.CREATED,
      success: true,
      message: "Get all my Booking successfully",
      data: result
    });
  }
);
var getAllBookings2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await bookingService.getAllBookings(query);
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "get all booking fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getBookingRequest2 = catchAsync(async (req, res) => {
  const ownerid = req.user?.id;
  const query = req.query;
  if (!ownerid) {
    throw new AppErrors_default(status14.UNAUTHORIZED, "You are not authorized!");
  }
  const result = await bookingService.getBookingRequest(query, ownerid);
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "get all booking request fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var cancelBooking2 = catchAsync(
  async (req, res) => {
    const userId = req.user?.id;
    const bookingId = req.params.id;
    const result = await bookingService.cancelBooking(
      userId,
      bookingId
    );
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "Booking cancelled successfully",
      data: result
    });
  }
);
var bookingController = {
  createBooking: createBooking2,
  getMyBookings: getMyBookings4,
  cancelBooking: cancelBooking2,
  getAllBookings: getAllBookings2,
  getBookingRequest: getBookingRequest2
};

// src/app/module/booking/booking.route.ts
var router6 = express3.Router();
router6.post(
  "/",
  checkAuth(UserRole.CUSTOMER),
  validateRequest(createBookingSchema),
  bookingController.createBooking
);
router6.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  bookingController.getAllBookings
);
router6.get(
  "/my-bookings",
  checkAuth(UserRole.CUSTOMER),
  bookingController.getMyBookings
);
router6.get(
  "/my-booking-requests",
  checkAuth(UserRole.BOAT_OWNER),
  bookingController.getBookingRequest
);
router6.patch(
  "/cancel/:id",
  checkAuth(UserRole.CUSTOMER),
  bookingController.cancelBooking
);
var BookingRoutes = router6;

// src/app/module/stats/stats.routes.ts
import express4 from "express";

// src/app/module/stats/stats.controller.ts
import httpStatus2 from "http-status";

// src/app/module/stats/stats.service.ts
import httpStatus from "http-status";
var getDashboardStatsData = async (user) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: { id: user.id }
  });
  switch (userData.role) {
    case UserRole.SUPER_ADMIN:
    case UserRole.ADMIN:
      return getAdminStatsData();
    case UserRole.BOAT_OWNER:
      return getBoatOwnerStatsData(userData.id);
    case UserRole.CUSTOMER:
      return getCustomerStatsData(userData.id);
    default:
      throw new AppErrors_default(httpStatus.BAD_REQUEST, "Invalid user role");
  }
};
var getAdminStatsData = async () => {
  const totalBookings = await prisma.booking.count();
  const totalBoats = await prisma.boat.count();
  const totalUsers = await prisma.user.count();
  const revenueData = await prisma.booking.aggregate({
    _sum: { totalAmount: true },
    where: { paymentStatus: PaymentStatus.PAID }
  });
  const piChartData = await getGlobalBookingStatus();
  const barChartData = await getGlobalMonthlyRevenue();
  const lineChart = await prisma.payments.findMany({
    where: {
      paymentStatus: PaymentStatus.PAID
    },
    select: {
      createdAt: true,
      amount: true
    }
  });
  return {
    totalBookings,
    totalBoats,
    totalUsers,
    totalRevenue: revenueData._sum.totalAmount || 0,
    piChartData,
    barChartData,
    lineChart
  };
};
var getBoatOwnerStatsData = async (ownerId) => {
  const totalBookings = await prisma.booking.count({
    where: { boat: { ownerId } }
  });
  const myBoatsCount = await prisma.boat.count({
    where: { ownerId }
  });
  const revenueData = await prisma.booking.aggregate({
    _sum: { totalAmount: true },
    where: {
      boat: { ownerId },
      paymentStatus: PaymentStatus.PAID
    }
  });
  const bookingStatusDistribution = await prisma.booking.groupBy({
    by: ["bookingStatus"],
    where: { boat: { ownerId } },
    _count: { id: true }
  });
  const piChartData = bookingStatusDistribution.map((item) => ({
    status: item.bookingStatus,
    count: item._count.id
  }));
  const barChartData = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', b."createdAt") AS month,
    CAST(COUNT(b.id) AS INTEGER) AS count
    FROM "Booking" b
    JOIN "Boat" bt ON b."boatId" = bt.id
    WHERE bt."ownerId" = ${ownerId}
    GROUP BY month
    ORDER BY month ASC;
  `;
  const boats = await prisma.boat.findMany({
    where: {
      ownerId
    }
  });
  const boatIds = boats.map((boat) => boat.id);
  const areaChart = await prisma.booking.findMany({
    where: {
      boatId: { in: boatIds }
    },
    select: {
      totalAmount: true,
      createdAt: true
    }
  });
  return {
    totalBookings,
    myBoatsCount,
    totalEarnings: revenueData._sum.totalAmount || 0,
    piChartData,
    barChartData,
    areaChart
  };
};
var getCustomerStatsData = async (userId) => {
  const totalBookings = await prisma.booking.count({ where: { userId } });
  const activeTripCount = await prisma.booking.count({
    where: {
      userId,
      bookingStatus: BookingStatus.CONFIRMED,
      tripDate: { gte: /* @__PURE__ */ new Date() }
    }
  });
  const totalSpent = await prisma.booking.aggregate({
    _sum: { totalAmount: true },
    where: { userId, paymentStatus: PaymentStatus.PAID }
  });
  const bookingStatusDistribution = await prisma.booking.groupBy({
    by: ["bookingStatus"],
    where: { userId },
    _count: { id: true }
  });
  const piChartData = bookingStatusDistribution.map((item) => ({
    status: item.bookingStatus,
    count: item._count.id
  }));
  const barChartData = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "createdAt") AS month,
    CAST(COUNT(*) AS INTEGER) AS count
    FROM "Booking"
    WHERE "userId" = ${userId}
    GROUP BY month
    ORDER BY month ASC;
  `;
  return {
    totalBookings,
    activeTripCount,
    totalSpent: totalSpent._sum.totalAmount || 0,
    piChartData,
    barChartData
  };
};
var getGlobalBookingStatus = async () => {
  const data = await prisma.booking.groupBy({
    by: ["bookingStatus"],
    _count: { id: true }
  });
  return data.map((i) => ({ status: i.bookingStatus, count: i._count.id }));
};
var getGlobalMonthlyRevenue = async () => {
  return await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "createdAt") AS month,
    CAST(SUM("totalAmount") AS FLOAT) AS amount
    FROM "Booking"
    WHERE "paymentStatus" = 'PAID'
    GROUP BY month
    ORDER BY month ASC;
  `;
};
var statsService = {
  getDashboardStatsData
};

// src/app/module/stats/stats.controller.ts
var getDashboardStats = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await statsService.getDashboardStatsData(user);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Dashboard statistics retrieved successfully",
    data: result
  });
});
var statsController = {
  getDashboardStats
};

// src/app/module/stats/stats.routes.ts
var router7 = express4.Router();
router7.get(
  "/",
  checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  statsController.getDashboardStats
);
var statsRoutes = router7;

// src/app/module/schedule/schedule.route.ts
import express5 from "express";

// src/app/module/schedule/schedule.validation.ts
import { z as z7 } from "zod";
var createScheduleZodSchema = z7.object({
  boatId: z7.string("Boat ID is required"),
  routeId: z7.string("Route ID is required"),
  startDate: z7.string("Start date is required"),
  endDate: z7.string().optional(),
  departureTime: z7.string("Departure time is required"),
  arrivalTime: z7.string("Arrival time is required"),
  availableSeats: z7.number().min(1, "Available seats must be at least 1"),
  recurringPattern: z7.enum(["DAILY", "WEEKLY", "MONTHLY"])
});
var updateScheduleZodSchema = createScheduleZodSchema.partial();

// src/app/module/schedule/schedule.constant.ts
var scheduleSearchableFields = ["startDate"];
var scheduleFilterableFields = [
  "status"
];

// src/app/module/schedule/schedule.service.ts
var createScheduleIntoDB = async (ownerId, payload) => {
  const { startDate, endDate, recurringPattern, ...rest } = payload;
  const start = new Date(startDate);
  if (!recurringPattern || !endDate) {
    return await prisma.schedule.create({
      data: {
        ...rest,
        userId: ownerId,
        startDate: start,
        endDate: endDate ? new Date(endDate) : null
      }
    });
  }
  const end = new Date(endDate);
  const schedules = [];
  let current = new Date(start);
  while (current <= end) {
    schedules.push({
      ...rest,
      startDate: new Date(current),
      userId: ownerId,
      endDate: end,
      recurringPattern: null
    });
    switch (recurringPattern) {
      case "DAILY":
        current.setDate(current.getDate() + 1);
        break;
      case "WEEKLY":
        current.setDate(current.getDate() + 7);
        break;
    }
  }
  return await prisma.schedule.createMany({
    data: schedules
  });
};
var getMySchedules = async (ownerId, query) => {
  const queryBuilder = new QueryBuilder(prisma.schedule, query, {
    searchableFields: scheduleSearchableFields,
    filterableFields: scheduleFilterableFields
  });
  const result = await queryBuilder.search().filter().where({ userId: ownerId }).paginate().sort().include({
    boat: {
      select: {
        boatName: true
      }
    },
    route: {
      select: {
        name: true
      }
    }
  }).execute();
  return result;
};
var updateSchedule = async (id, ownerId, payload) => {
  const existingSchedule = await prisma.schedule.findFirst({
    where: {
      id,
      userId: ownerId
    }
  });
  if (!existingSchedule) {
    throw new Error("Schedule not found or unauthorized");
  }
  return await prisma.schedule.update({
    where: { id },
    data: payload
  });
};
var availableRoute = async (id) => {
  const today = /* @__PURE__ */ new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  const result = await prisma.schedule.findMany({
    where: {
      boatId: id,
      status: ScheduleStatus.UPCOMING,
      startDate: {
        gte: startOfDay,
        lte: endOfDay
      }
    },
    include: {
      route: {
        select: {
          name: true
        }
      }
    }
  });
  const formattedResult = result.map(({ route, ...rest }) => ({
    ...rest,
    routeName: route?.name
  }));
  return formattedResult;
};
var viewRoute = async (id) => {
  const result = await prisma.schedule.findMany({
    where: {
      id
    },
    include: {
      route: {
        select: {
          name: true,
          difficulty: true,
          distance: true,
          duration: true
        }
      }
    }
  });
  const formattedResult = result.map(({ route, ...rest }) => ({
    ...rest,
    routeName: route?.name,
    difficulty: route?.difficulty,
    distance: route?.distance,
    duration: route?.duration
  }));
  return formattedResult;
};
var deleteSchedule = async (id) => {
  return await prisma.schedule.delete({ where: { id } });
};
var ScheduleService = {
  createScheduleIntoDB,
  getMySchedules,
  updateSchedule,
  availableRoute,
  deleteSchedule,
  viewRoute
};

// src/app/module/schedule/schedule.controller.ts
import status15 from "http-status";
var createSchedule = catchAsync(async (req, res) => {
  const ownerId = req.user?.id;
  const result = await ScheduleService.createScheduleIntoDB(
    ownerId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Schedule created successfully",
    data: result
  });
});
var getMySchedules2 = catchAsync(async (req, res) => {
  const ownerId = req.user?.id;
  const query = req.query;
  const result = await ScheduleService.getMySchedules(
    ownerId,
    query
  );
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Schedules fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var updateSchedule2 = catchAsync(async (req, res) => {
  const result = await ScheduleService.updateSchedule(
    req.params?.id,
    req.user?.id,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Schedule updated successfully",
    data: result
  });
});
var availableRoute2 = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await ScheduleService.availableRoute(id);
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Available Route find successfully",
    data: result
  });
});
var viewRoute2 = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await ScheduleService.viewRoute(id);
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "View Route find successfully",
    data: result
  });
});
var deleteSchedule2 = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await ScheduleService.deleteSchedule(id);
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Schedules delete successfully",
    data: result
  });
});
var ScheduleController = {
  createSchedule,
  getMySchedules: getMySchedules2,
  deleteSchedule: deleteSchedule2,
  updateSchedule: updateSchedule2,
  availableRoute: availableRoute2,
  viewRoute: viewRoute2
};

// src/app/module/schedule/schedule.route.ts
var router8 = express5.Router();
router8.post(
  "/",
  checkAuth(UserRole.BOAT_OWNER),
  validateRequest(createScheduleZodSchema),
  ScheduleController.createSchedule
);
router8.get("/my-boat-schedule", checkAuth(UserRole.BOAT_OWNER), ScheduleController.getMySchedules);
router8.get("/available-route/:id", ScheduleController.availableRoute);
router8.get("/view-route/:id", ScheduleController.viewRoute);
router8.patch(
  "/:id",
  checkAuth(UserRole.BOAT_OWNER),
  validateRequest(updateScheduleZodSchema),
  ScheduleController.updateSchedule
);
router8.delete("/:id", checkAuth(UserRole.BOAT_OWNER), ScheduleController.deleteSchedule);
var ScheduleRoutes = router8;

// src/app/module/payment/payment.route.ts
import express6 from "express";
var router9 = express6.Router();
router9.get("/", checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), PaymentController.getPayments);
var PaymentRoutes = router9;

// src/app/module/rag/rag.route.ts
import express7 from "express";

// src/app/module/rag/rag.controller.ts
import status16 from "http-status";

// src/app/module/rag/embedding.service.ts
var EmbeddingService = class {
  apikey;
  apiUrl = "https://openrouter.ai/api/v1";
  embeddingModel;
  constructor() {
    this.apikey = envVariables.Open_Router_Api_key || "";
    this.embeddingModel = envVariables.OPENROUTER_EMBEDDING_MODEL || "nvidia/llama-nemotron-embed-vl-1b-v2:free";
    if (!this.apikey) {
      throw new AppErrors_default(500, "OPENROUTER_API_KEY is not set in .env");
    }
  }
  async generateEmbedding(text) {
    if (!text || text.trim().length === 0) {
      throw new Error("Text is empty");
    }
    try {
      const response = await fetch(`${this.apiUrl}/embeddings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apikey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: text,
          model: this.embeddingModel
        })
      });
      if (!response.ok) {
        throw new AppErrors_default(500, `OpenRouter API Error: ${response.status}`);
      }
      const data = await response.json();
      if (!data.data || data.data.length === 0) {
        throw new AppErrors_default(500, "No embedding data returned");
      }
      const embedding = data.data[0].embedding;
      if (embedding.length !== 2048) {
        throw new AppErrors_default(500, `Invalid embedding dimension: ${embedding.length}`);
      }
      return embedding;
    } catch (error) {
      console.error("Embedding error:", error);
      throw new AppErrors_default(500, error.message || "Embedding generation failed");
    }
  }
  async generateEmbeddings(texts) {
    if (!texts || texts.length === 0) {
      throw new AppErrors_default(500, "Texts array is empty");
    }
    try {
      const response = await fetch(`${this.apiUrl}/embeddings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apikey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: texts,
          model: this.embeddingModel
        })
      });
      const data = await response.json();
      return data.data.map((item) => item.embedding);
    } catch (error) {
      console.error("Batch embedding error:", error);
      throw error;
    }
  }
};

// src/app/module/rag/indexing.service.ts
var IndexingService = class {
  embeddingService;
  constructor() {
    this.embeddingService = new EmbeddingService();
  }
  // ─── Core: Upsert a single document embedding ───────────────────────
  async indexDocument(chunkKey, chunkIndex, sourceType, sourceId, content, sourceLabel, metadata) {
    try {
      const embedding = await this.embeddingService.generateEmbedding(content);
      const vectorString = `[${embedding.join(",")}]`;
      await prisma.$executeRaw`
        INSERT INTO "DocumentEmbedding" (
          "chunkKey",
          "chunkIndex",
          "sourceType",
          "sourceId",
          "sourceLabel",
          "content",
          "metadata",
          "embedding",
          "updatedAt"
        )
        VALUES (
          ${chunkKey},
          ${chunkIndex},
          ${sourceType},
          ${sourceId},
          ${sourceLabel || null},
          ${content},
          ${JSON.stringify(metadata || {})}::jsonb,
          CAST(${vectorString} AS vector),
          NOW()
        )
        ON CONFLICT ("chunkKey")
        DO UPDATE SET
          "content"   = EXCLUDED."content",
          "metadata"  = EXCLUDED."metadata",
          "embedding" = EXCLUDED."embedding",
          "isDeleted" = false,
          "deletedAt" = null,
          "updatedAt" = NOW();
      `;
    } catch (error) {
      console.error("\u274C Indexing Error for Key:", chunkKey, error);
      throw new Error(
        "Index document failed due to database or embedding error."
      );
    }
  }
  //  Index all Boats 
  async indexBoats() {
    const boats = await prisma.boat.findMany({
      include: {
        owner: true,
        reviews: { include: { user: true } },
        license: true,
        schedules: { include: { route: true } }
      }
    });
    let count = 0;
    for (const boat of boats) {
      const reviewText = boat.reviews.length ? boat.reviews.map(
        (r) => `\u2B50 ${r.rating}/5 by ${r.user.name}: "${r.comment || "No comment"}"`
      ).join("\n") : "No reviews yet";
      const routeText = boat.schedules.length ? [
        ...new Set(
          boat.schedules.map(
            (s) => `${s.route.name} (${s.route.difficulty}, ${s.route.duration}, ${s.route.distance})`
          )
        )
      ].join(", ") : "No routes scheduled";
      const content = `
Boat Name: ${boat.boatName}
Type: ${boat.boatType}
Status: ${boat.status}
Location: ${boat.location}
Capacity: ${boat.capacity} passengers
Price Per Trip: $${boat.pricePerTrip}
Rating: ${boat.rating}/5 (${boat.totalReviews} reviews)
Owner: ${boat.owner.name}
Description: ${boat.description}
Condition: ${boat.boatCondition}
Manufacturer: ${boat.manufacturer} (${boat.manufacturingYear})
Dimensions: ${boat.length}ft \xD7 ${boat.width}ft
Engine Capacity: ${boat.engineCapacity} HP
Specifications: ${boat.specifications}
Amenities: ${boat.amenities.join(", ") || "None listed"}
Cancellation Policy: ${boat.cancellationPolicy}
Licensed: ${boat.license ? `Yes (${boat.license.licenseType}, #${boat.license.licenseNumber})` : "No"}
Approved: ${boat.isApproved ? "Yes" : "No"}
Available Routes: ${routeText}
Reviews:
${reviewText}
`.trim();
      await this.indexDocument(
        `boat-${boat.id}`,
        0,
        "BOAT",
        boat.id,
        content,
        boat.boatName,
        {
          boatId: boat.id,
          ownerId: boat.ownerId,
          boatType: boat.boatType,
          location: boat.location,
          rating: boat.rating,
          pricePerTrip: boat.pricePerTrip,
          capacity: boat.capacity,
          isApproved: boat.isApproved
        }
      );
      count++;
    }
    return { message: `${count} boats indexed successfully`, count };
  }
  //  Index all Reviews (User Reviews on Boats)
  async indexReviews() {
    const reviews = await prisma.review.findMany({
      include: { boat: true, user: true }
    });
    let count = 0;
    for (const review of reviews) {
      const content = `
Boat: ${review.boat.boatName}
Location: ${review.boat.location}
Reviewer: ${review.user.name}
Rating: ${review.rating}/5
Comment: ${review.comment || "No comment provided"}
Verified: ${review.isVerified ? "Yes" : "No"}
Date: ${review.createdAt.toISOString().split("T")[0]}
`.trim();
      await this.indexDocument(
        `review-${review.id}`,
        0,
        "REVIEW",
        review.id,
        content,
        `${review.user.name}'s review on ${review.boat.boatName}`,
        {
          reviewId: review.id,
          boatId: review.boatId,
          userId: review.userId,
          rating: review.rating,
          isVerified: review.isVerified
        }
      );
      count++;
    }
    return { message: `${count} reviews indexed successfully`, count };
  }
  // Index Boat Owners (Users with role BOAT_OWNER)
  async indexOwners() {
    const owners = await prisma.user.findMany({
      where: { role: "BOAT_OWNER", isDeleted: false },
      include: {
        boats: {
          include: { reviews: true }
        }
      }
    });
    let count = 0;
    for (const owner of owners) {
      const boatSummaries = owner.boats.length ? owner.boats.map(
        (b) => `\u2022 ${b.boatName} (${b.boatType}, ${b.location}, $${b.pricePerTrip}/trip, \u2B50 ${b.rating})`
      ).join("\n") : "No boats listed";
      const totalReviews = owner.boats.reduce(
        (sum, b) => sum + b.reviews.length,
        0
      );
      const avgRating = owner.boats.length > 0 ? (owner.boats.reduce((sum, b) => sum + b.rating, 0) / owner.boats.length).toFixed(1) : "N/A";
      const content = `
Owner Name: ${owner.name}
Email: ${owner.email}
Status: ${owner.status}
Total Boats: ${owner.boats.length}
Average Boat Rating: ${avgRating}
Total Reviews Across Boats: ${totalReviews}
Boats:
${boatSummaries}
`.trim();
      await this.indexDocument(
        `owner-${owner.id}`,
        0,
        "OWNER",
        owner.id,
        content,
        owner.name,
        {
          ownerId: owner.id,
          totalBoats: owner.boats.length,
          avgRating,
          totalReviews
        }
      );
      count++;
    }
    return { message: `${count} owners indexed successfully`, count };
  }
  // ─── Index Routes ──────────────────────────────────────────────────
  async indexRoutes() {
    const routes = await prisma.route.findMany({
      include: {
        schedules: {
          include: { boat: true }
        }
      }
    });
    let count = 0;
    for (const route of routes) {
      const boatNames = [
        ...new Set(route.schedules.map((s) => s.boat.boatName))
      ];
      const content = `
Route Name: ${route.name}
Difficulty: ${route.difficulty}
Duration: ${route.duration}
Distance: ${route.distance}
Scenic Highlights: ${route.scenicHighlights}
Description: ${route.description || "No description"}
Boats on this route: ${boatNames.length > 0 ? boatNames.join(", ") : "No boats currently scheduled"}
Total Schedules: ${route.schedules.length}
`.trim();
      await this.indexDocument(
        `route-${route.id}`,
        0,
        "ROUTE",
        route.id,
        content,
        route.name,
        {
          routeId: route.id,
          difficulty: route.difficulty,
          duration: route.duration,
          distance: route.distance,
          totalSchedules: route.schedules.length
        }
      );
      count++;
    }
    return { message: `${count} routes indexed successfully`, count };
  }
  // ─── Index Schedules ───────────────────────────────────────────────
  async indexSchedules() {
    const schedules = await prisma.schedule.findMany({
      where: { status: "UPCOMING" },
      include: {
        boat: true,
        route: true,
        user: true
      }
    });
    let count = 0;
    for (const schedule of schedules) {
      const content = `
Schedule for Boat: ${schedule.boat.boatName}
Route: ${schedule.route.name}
Departure: ${schedule.departureTime}
Arrival: ${schedule.arrivalTime}
Start Date: ${schedule.startDate.toISOString().split("T")[0]}
End Date: ${schedule.endDate ? schedule.endDate.toISOString().split("T")[0] : "Open-ended"}
Available Seats: ${schedule.availableSeats}
Status: ${schedule.status}
Recurring: ${schedule.recurringPattern || "One-time"}
Boat Type: ${schedule.boat.boatType}
Price Per Trip: $${schedule.boat.pricePerTrip}
Location: ${schedule.boat.location}
Route Difficulty: ${schedule.route.difficulty}
Route Duration: ${schedule.route.duration}
`.trim();
      await this.indexDocument(
        `schedule-${schedule.id}`,
        0,
        "SCHEDULE",
        schedule.id,
        content,
        `${schedule.boat.boatName} - ${schedule.route.name}`,
        {
          scheduleId: schedule.id,
          boatId: schedule.boatId,
          routeId: schedule.routeId,
          availableSeats: schedule.availableSeats,
          departureTime: schedule.departureTime
        }
      );
      count++;
    }
    return { message: `${count} schedules indexed successfully`, count };
  }
  // ─── Index ALL data sources at once ─────────────────────────────────
  async indexAll() {
    const results = {
      boats: await this.indexBoats(),
      reviews: await this.indexReviews(),
      owners: await this.indexOwners(),
      routes: await this.indexRoutes(),
      schedules: await this.indexSchedules()
    };
    const totalCount = Object.values(results).reduce(
      (sum, r) => sum + r.count,
      0
    );
    return {
      message: `All data indexed successfully. Total: ${totalCount} documents.`,
      totalCount,
      details: results
    };
  }
  // ─── Soft-delete embeddings for a given source ─────────────────────
  async removeBySource(sourceType, sourceId) {
    await prisma.$executeRaw`
      UPDATE "DocumentEmbedding"
      SET "isDeleted" = true, "deletedAt" = NOW(), "updatedAt" = NOW()
      WHERE "sourceType" = ${sourceType}
        AND "sourceId" = ${sourceId}
        AND "isDeleted" = false;
    `;
    return { message: `Embeddings for ${sourceType}:${sourceId} soft-deleted.` };
  }
};

// src/app/module/rag/llm.service.ts
var LLMService = class {
  apiKey;
  apiUrl = "https://openrouter.ai/api/v1";
  model;
  constructor() {
    this.apiKey = envVariables.Open_Router_Api_key || "";
    this.model = envVariables.OPENROUTER_LLM_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";
    if (!this.apiKey) {
      throw new AppErrors_default(500, "OpenRouter api key is missing...");
    }
  }
  async generateResponse(prompt, context = [], asJson = false) {
    try {
      const MAX_CONTEXT_CHARS = 12e3;
      const trimmedContext = context.join("\n\n").slice(0, MAX_CONTEXT_CHARS);
      let fullPrompt = `
        You are an AI assistant for a boat booking platform.

        Use ONLY the provided context to answer the question.
        If the answer is not in the context, say: "I don't have enough information."

        Context:
        ${trimmedContext}

        Question:
        ${prompt}

        Answer:
        `;
      if (asJson) {
        fullPrompt += `
        Return ONLY valid JSON:
        {
          "boats": [
            {
              "name": "Boat Name",
              "reason": "Why suitable",
              "type": "Boat Type",
              "location": "Location",
              "pricePerTrip": 0
            }
          ]
        }
        `;
      }
      const bodyPayload = {
        model: this.model,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: fullPrompt }
        ],
        temperature: asJson ? 0 : 0.3,
        max_tokens: 1500
      };
      const isOpenAIModel = this.model.startsWith("openai/");
      if (asJson && isOpenAIModel) {
        bodyPayload.response_format = { type: "json_object" };
      }
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "",
          "X-Title": process.env.APP_NAME || "BoatBooking"
        },
        body: JSON.stringify(bodyPayload)
      });
      if (!response.ok) {
        let errBody;
        try {
          errBody = await response.json();
        } catch {
          errBody = await response.text().catch(() => "Could not read response body");
        }
        console.error("\u274C OpenRouter API Error:", {
          status: response.status,
          statusText: response.statusText,
          model: this.model,
          error: errBody
        });
        const message = errBody?.error?.message || errBody?.error?.code || (typeof errBody === "string" ? errBody : `OpenRouter error ${response.status}`);
        throw new AppErrors_default(
          response.status === 429 ? 429 : 500,
          `LLM Error (${response.status}): ${message}`
        );
      }
      const data = await response.json();
      if (!data.choices || data.choices.length === 0) {
        console.error("\u274C OpenRouter returned no choices:", data);
        throw new AppErrors_default(500, "LLM returned no response. The model may be unavailable.");
      }
      const raw2 = data.choices[0].message.content;
      if (asJson) {
        try {
          return JSON.parse(raw2);
        } catch {
          console.error("\u274C Invalid JSON from LLM:", raw2);
          throw new AppErrors_default(500, "Invalid JSON returned from model");
        }
      }
      return raw2;
    } catch (error) {
      if (error instanceof AppErrors_default) throw error;
      console.error("\u274C LLM unexpected error:", error);
      throw new AppErrors_default(500, error.message || "LLM request failed");
    }
  }
};

// src/app/module/rag/rag.service.ts
var embeddingService = new EmbeddingService();
var llmService = new LLMService();
var indexingService = new IndexingService();
var askQuestion = async (query, topK = 5, sourceType) => {
  const queryEmbedding = await embeddingService.generateEmbedding(query);
  const vectorString = `[${queryEmbedding.join(",")}]`;
  let results;
  if (sourceType) {
    results = await prisma.$queryRaw`
      SELECT
        "id",
        "chunkKey",
        "sourceType",
        "sourceId",
        "sourceLabel",
        "content",
        "metadata",
        1 - ("embedding" <=> CAST(${vectorString} AS vector)) AS similarity
      FROM "DocumentEmbedding"
      WHERE "isDeleted" = false
        AND "sourceType" = ${sourceType}
      ORDER BY "embedding" <=> CAST(${vectorString} AS vector)
      LIMIT ${topK};
    `;
  } else {
    results = await prisma.$queryRaw`
      SELECT
        "id",
        "chunkKey",
        "sourceType",
        "sourceId",
        "sourceLabel",
        "content",
        "metadata",
        1 - ("embedding" <=> CAST(${vectorString} AS vector)) AS similarity
      FROM "DocumentEmbedding"
      WHERE "isDeleted" = false
      ORDER BY "embedding" <=> CAST(${vectorString} AS vector)
      LIMIT ${topK};
    `;
  }
  if (!results || results.length === 0) {
    return {
      answer: "I don't have enough information to answer that question. Please try indexing data first.",
      sources: []
    };
  }
  const contextChunks = results.map((r) => r.content);
  const sources = results.map((r) => ({
    sourceType: r.sourceType,
    sourceId: r.sourceId,
    sourceLabel: r.sourceLabel,
    similarity: parseFloat(Number(r.similarity).toFixed(4)),
    chunkKey: r.chunkKey
  }));
  const answer = await llmService.generateResponse(query, contextChunks);
  return {
    answer,
    sources
  };
};
var searchSimilar = async (query, topK = 10, sourceType) => {
  const queryEmbedding = await embeddingService.generateEmbedding(query);
  const vectorString = `[${queryEmbedding.join(",")}]`;
  let results;
  if (sourceType) {
    results = await prisma.$queryRaw`
      SELECT
        "id",
        "chunkKey",
        "sourceType",
        "sourceId",
        "sourceLabel",
        "content",
        "metadata",
        1 - ("embedding" <=> CAST(${vectorString} AS vector)) AS similarity
      FROM "DocumentEmbedding"
      WHERE "isDeleted" = false
        AND "sourceType" = ${sourceType}
      ORDER BY "embedding" <=> CAST(${vectorString} AS vector)
      LIMIT ${topK};
    `;
  } else {
    results = await prisma.$queryRaw`
      SELECT
        "id",
        "chunkKey",
        "sourceType",
        "sourceId",
        "sourceLabel",
        "content",
        "metadata",
        1 - ("embedding" <=> CAST(${vectorString} AS vector)) AS similarity
      FROM "DocumentEmbedding"
      WHERE "isDeleted" = false
      ORDER BY "embedding" <=> CAST(${vectorString} AS vector)
      LIMIT ${topK};
    `;
  }
  return results.map((r) => ({
    sourceType: r.sourceType,
    sourceId: r.sourceId,
    sourceLabel: r.sourceLabel,
    content: r.content,
    similarity: parseFloat(Number(r.similarity).toFixed(4)),
    metadata: r.metadata
  }));
};
var reindexAll = async () => {
  return indexingService.indexAll();
};
var indexByType = async (sourceType) => {
  switch (sourceType.toUpperCase()) {
    case "BOAT":
      return indexingService.indexBoats();
    case "REVIEW":
      return indexingService.indexReviews();
    case "OWNER":
      return indexingService.indexOwners();
    case "ROUTE":
      return indexingService.indexRoutes();
    case "SCHEDULE":
      return indexingService.indexSchedules();
    default:
      throw new Error(
        `Unknown source type: ${sourceType}. Valid types: BOAT, REVIEW, OWNER, ROUTE, SCHEDULE`
      );
  }
};
var removeBySource = async (sourceType, sourceId) => {
  return indexingService.removeBySource(sourceType, sourceId);
};
var RagService = {
  askQuestion,
  searchSimilar,
  reindexAll,
  indexByType,
  removeBySource
};

// src/app/module/rag/rag.controller.ts
var askQuestion2 = catchAsync(async (req, res) => {
  const { query, topK, sourceType } = req.body;
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    sendResponse(res, {
      httpStatusCode: status16.BAD_REQUEST,
      success: false,
      message: "Query is required and must be a non-empty string."
    });
    return;
  }
  const result = await RagService.askQuestion(
    query.trim(),
    topK || 5,
    sourceType
  );
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "RAG query processed successfully",
    data: result
  });
});
var searchSimilar2 = catchAsync(async (req, res) => {
  const { query, topK, sourceType } = req.body;
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    sendResponse(res, {
      httpStatusCode: status16.BAD_REQUEST,
      success: false,
      message: "Query is required and must be a non-empty string."
    });
    return;
  }
  const result = await RagService.searchSimilar(
    query.trim(),
    topK || 10,
    sourceType
  );
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Similar documents retrieved successfully",
    data: result
  });
});
var reindexAll2 = catchAsync(async (req, res) => {
  const result = await RagService.reindexAll();
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "All data re-indexed successfully",
    data: result
  });
});
var indexByType2 = catchAsync(async (req, res) => {
  const { sourceType } = req.params;
  const result = await RagService.indexByType(sourceType);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: `${sourceType} data indexed successfully`,
    data: result
  });
});
var removeBySource2 = catchAsync(async (req, res) => {
  const { sourceType, sourceId } = req.params;
  const result = await RagService.removeBySource(sourceType, sourceId);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Embeddings removed successfully",
    data: result
  });
});
var RagController = {
  askQuestion: askQuestion2,
  searchSimilar: searchSimilar2,
  reindexAll: reindexAll2,
  indexByType: indexByType2,
  removeBySource: removeBySource2
};

// src/app/module/rag/rag.route.ts
var router10 = express7.Router();
router10.post("/ask", RagController.askQuestion);
router10.post("/search", RagController.searchSimilar);
router10.post(
  "/index/all",
  checkAuth(UserRole.ADMIN),
  RagController.reindexAll
);
router10.post(
  "/index/:sourceType",
  checkAuth(UserRole.ADMIN),
  RagController.indexByType
);
router10.delete(
  "/index/:sourceType/:sourceId",
  checkAuth(UserRole.ADMIN),
  RagController.removeBySource
);
var RagRoutes = router10;

// src/app/routes/routes.ts
var router11 = Router4();
router11.use("/auth", AuthRoutes);
router11.use("/boats", BoatRoutes);
router11.use("/users", UserRoutes);
router11.use("/route", RouteRoutes);
router11.use("/reviews", ReviewRoutes);
router11.use("/booking", BookingRoutes);
router11.use("/stats", statsRoutes);
router11.use("/schedule", ScheduleRoutes);
router11.use("/payments", PaymentRoutes);
router11.use("/rag", RagRoutes);
var IndexRoutes = router11;

// src/app.ts
var app = express8();
app.set("trust proxy", 1);
app.use(cors({
  origin: [envVariables.FRONTEND_URL, "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.post(
  "/webhook",
  express8.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent
);
app.set("view engine", "ejs");
app.set("views", path3.join(process.cwd(), "src/app/templates"));
app.use(express8.json());
app.use(cookieParser());
app.use(express8.urlencoded({ extended: true }));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/v1", IndexRoutes);
app.get("/", (req, res) => {
  res.send("Boat backend running ");
});
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
