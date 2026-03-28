import { Router } from "express";
import { BoatRoutes } from "../module/boat/boat.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { RouteRoutes } from "../module/route/route.routes";
import { ReviewRoutes } from "../module/review/review.route";


const router = Router();

router.use("/auth", AuthRoutes)

router.use("/boats", BoatRoutes)

router.use("/user", UserRoutes)

router.use("/route", RouteRoutes)

router.use("/reviews", ReviewRoutes)




export const IndexRoutes = router;