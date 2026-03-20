import { Router } from "express";
import { BoatRoutes } from "../module/boat/boat.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";


const router = Router();

router.use("/auth", AuthRoutes)

router.use("/boats", BoatRoutes)

router.use("/user", UserRoutes)




export const IndexRoutes = router;