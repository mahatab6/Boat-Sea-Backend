import { Router } from "express";
import { BoatRoutes } from "../module/boat/boat.route";


const router = Router();


router.use("/boats", BoatRoutes)





export const IndexRoutes = router;