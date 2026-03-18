import { Router } from "express";
import { boatController } from "./boat.controller";



const router = Router();

router.post("/create-boat", boatController.createBoat)

export const BoatRoutes = router;