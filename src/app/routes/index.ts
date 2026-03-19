import { Router } from "express";
import { BoatRoutes } from "../module/boat/boat.route";
import { AuthRoutes } from "../module/auth/auth.route";


const router = Router();

router.use("/auth", AuthRoutes)



router.use("/boats", BoatRoutes)


export const IndexRoutes = router;