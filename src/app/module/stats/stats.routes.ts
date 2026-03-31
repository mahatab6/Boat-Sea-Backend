import express from "express";
import { statsController } from "./stats.controller";
import { checkAuth } from "../../middleware/ckeckAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.get(
  "/",
  checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN), 
  statsController.getDashboardStats
);

export const statsRoutes = router;