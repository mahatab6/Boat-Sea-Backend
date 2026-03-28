import express from "express";

import { ReviewController } from "./review.controller";
import { checkAuth } from "../../middleware/ckeckAuth";
import { validateRequest } from "../../middleware/validateRequest";

import { UserRole } from "../../../generated/prisma/enums";

import {
  createReviewZodSchema,
  updateReviewZodSchema,
} from "./review.validation";

const router = express.Router();

router.post(
  "/",
  checkAuth(UserRole.CUSTOMER, UserRole.ADMIN),
  validateRequest(createReviewZodSchema),
  ReviewController.createReview
);

router.get("/", ReviewController.getAllReviews);

router.get("/:id", ReviewController.getSingleReview);

router.patch(
  "/:id",
  checkAuth(UserRole.CUSTOMER, UserRole.ADMIN),
  validateRequest(updateReviewZodSchema),
  ReviewController.updateReview
);

router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN),
  ReviewController.deleteReview
);

export const ReviewRoutes = router;