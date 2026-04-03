import express from "express";
import { RouteController } from "./route.controller";
import { checkAuth } from "../../middleware/ckeckAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { createRouteZodSchema, updateRouteZodSchema } from "./route.validation";
import { multerUpload } from "../../../config/multer.config";


const router = express.Router();

router.post(
  "/create-route",
  // checkAuth(UserRole.ADMIN),
  multerUpload.single("images"),
  validateRequest(createRouteZodSchema),
  RouteController.createRoute
);

router.get("/", RouteController.getAllRoutes);


router.get("/:id", RouteController.getSingleRoute);

router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN),
  validateRequest(updateRouteZodSchema),
  RouteController.updateRoute
);

router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN),
  RouteController.deleteRoute
);
export const RouteRoutes = router;