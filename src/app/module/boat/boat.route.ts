import { Router } from "express";
import { boatController } from "./boat.controller";



const router = Router();

router.get('/', boatController.getAllBoats);

router.post("/create-boat", boatController.createBoat)

router.get('/:id', boatController.getBoatById);

router.get('/:id/reviews', boatController.getBoatReviews);

router.put('/:id', boatController.updateBoat);

router.delete('/:id', boatController.deleteBoat);

router.get('/owner/my-boats', boatController.getMyBoats);

router.post('/:id/schedules', boatController.addSchedule);

router.get('/:id/availability', boatController.checkAvailability);


export const BoatRoutes = router;