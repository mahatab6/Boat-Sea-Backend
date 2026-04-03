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
import { multerUpload } from "../../../config/multer.config";



const router = Router();

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
  boatController.getMyBoats,
);

router.get(
  "/featuredBoats",
  boatController.featuredBoats,
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
