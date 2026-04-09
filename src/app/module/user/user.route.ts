import { Router } from "express";

import { userController } from "./user.controller";
import { checkAuth } from "../../middleware/ckeckAuth";
import { validateRequest } from "../../middleware/validateRequest";

import { updateProfileZodSchema, updateRoleValidationSchema } from "./user.validation";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get(
  "/profile",
  checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.getProfile
);


router.get(
  "/getalluser",
  checkAuth( UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.getAlluser
);

router.put("/updaterole",  validateRequest(updateRoleValidationSchema), userController.updateRole)



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
  "/account-delete/:id",
  // checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.deleteAccount
);

export const UserRoutes = router;