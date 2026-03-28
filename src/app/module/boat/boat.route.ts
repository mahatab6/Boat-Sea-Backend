import { Router } from "express";
import { boatController } from "./boat.controller";
import { checkAuth } from "../../middleware/ckeckAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { createBoatSchema, updateBoatSchema } from "./boat.validation";



const router = Router();

router.get('/', boatController.getAllBoats);

router.post("/create-boat",checkAuth(UserRole.BOAT_OWNER)
,validateRequest(createBoatSchema)
, boatController.createBoat)

router.get('/:id', boatController.getBoatById);

router.put('/:id',checkAuth(UserRole.BOAT_OWNER)
,validateRequest(updateBoatSchema), boatController.updateBoat);

router.delete('/:id', boatController.deleteBoat);

router.get('/my-boats',checkAuth(UserRole.BOAT_OWNER), boatController.getMyBoats);

router.post('/:id/schedules', boatController.addSchedule);

router.get('/:id/availability', boatController.checkAvailability);

router.get('/:id/reviews', boatController.getBoatReviews);


export const BoatRoutes = router;