import { Router } from "express";
import { boatController } from "./boat.controller";
import { checkAuth } from "../../middleware/ckeckAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { createBoatSchema } from "./boat.validation";



const router = Router();

router.get('/', boatController.getAllBoats);

router.post("/create-boat",checkAuth(UserRole.BOAT_OWNER)
,validateRequest(createBoatSchema)
, boatController.createBoat)

router.get('/:id', boatController.getBoatById);

router.get('/:id/reviews', boatController.getBoatReviews);

router.put('/:id', boatController.updateBoat);

router.delete('/:id', boatController.deleteBoat);

router.get('/owner/my-boats', boatController.getMyBoats);

router.post('/:id/schedules', boatController.addSchedule);

router.get('/:id/availability', boatController.checkAvailability);


export const BoatRoutes = router;