import { Router } from "express";
import { AuthController } from "./auth.controller";



const router = Router();

router.post("/register", AuthController.registerCustomer)

router.post("/verify-email", AuthController.verifyEmail)

router.post("/login", AuthController.login)

export const AuthRoutes = router;