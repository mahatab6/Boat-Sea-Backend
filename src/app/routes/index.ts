import { Router } from "express";
import { BoatRoutes } from "../module/boat/boat.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { RouteRoutes } from "../module/route/route.routes";
import { ReviewRoutes } from "../module/review/review.route";
import { BookingRoutes } from "../module/booking/booking.route";
import { statsRoutes } from "../module/stats/stats.routes";



const router = Router();

router.use("/auth", AuthRoutes)

router.use("/boats", BoatRoutes)

router.use("/users", UserRoutes)

router.use("/route", RouteRoutes)

router.use("/reviews", ReviewRoutes)

router.use("/booking", BookingRoutes)

router.use("/stats", statsRoutes)




export const IndexRoutes = router;