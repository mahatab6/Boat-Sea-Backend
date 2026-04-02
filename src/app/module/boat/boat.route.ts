import { Router } from "express";
import { boatController } from "./boat.controller";
import { checkAuth } from "../../middleware/ckeckAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createBoatSchema,
  createScheduleSchema,
  updateBoatSchema,
} from "./boat.validation";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.get("/", boatController.getAllBoats);


router.post(
  "/create-boat",
  checkAuth(UserRole.BOAT_OWNER),
  upload.fields([
    { name: "primary_img", maxCount: 1 },
    { name: "boat_images", maxCount: 10 },
  ]),
  validateRequest(createBoatSchema),
  boatController.createBoat
);

router.get(
  "/my-boats",
  checkAuth(UserRole.BOAT_OWNER),
  boatController.getMyBoats,
);

router.get("/:id", boatController.getBoatById);

router.put(
  "/:id",
  checkAuth(UserRole.BOAT_OWNER),
  validateRequest(updateBoatSchema),
  boatController.updateBoat,
);

router.delete(
  "/:id",
  checkAuth(UserRole.BOAT_OWNER),
  boatController.deleteBoat,
);

router.post(
  "/:boatId/schedules",
  checkAuth(UserRole.BOAT_OWNER),
  validateRequest(createScheduleSchema),
  boatController.addSchedule,
);

export const BoatRoutes = router;
