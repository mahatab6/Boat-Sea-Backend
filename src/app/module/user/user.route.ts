import { Router } from "express";

import { userController } from "./user.controller";
import { checkAuth } from "../../middleware/ckeckAuth";
import { validateRequest } from "../../middleware/validateRequest";

import { updateProfileZodSchema } from "./user.validation";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/profile",
  checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.getProfile
);

router.put(
  "/profile",
  checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updateProfileZodSchema),
  userController.updateProfile
);

router.get(
  "/bookings",
  checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER),
  userController.getMyBookings
);

router.get(
  "/reviews",
  checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER),
  userController.getMyReviews
);

router.get(
  "/notifications",
  checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER),
  userController.getNotifications
);

router.put(
  "/notifications/:id/read",
  checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER),
  userController.markNotificationRead
);

router.delete(
  "/account",
  checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER),
  userController.deleteAccount
);

export const UserRoutes = router;