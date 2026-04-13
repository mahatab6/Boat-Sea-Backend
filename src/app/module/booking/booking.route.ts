import express from "express";
import { checkAuth } from "../../middleware/ckeckAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { createBookingSchema } from "./booking.validation";
import { bookingController } from "./booking.controller";



const router = express.Router();

router.post(
  "/",
  checkAuth(UserRole.CUSTOMER),
  validateRequest(createBookingSchema),
  bookingController.createBooking
);

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  bookingController.getAllBookings
);

router.get(
  "/my-bookings",
  checkAuth(UserRole.CUSTOMER),
  bookingController.getMyBookings
);

router.get(
  "/my-booking-requests",
  checkAuth(UserRole.BOAT_OWNER),
  bookingController.getBookingRequest
);


router.patch(
  "/cancel/:id",
  checkAuth(UserRole.CUSTOMER),
  bookingController.cancelBooking
);



export const BookingRoutes = router;