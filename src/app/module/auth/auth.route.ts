import { Router } from "express";
import { AuthController } from "./auth.controller";



const router = Router();

router.post("/register", AuthController.registerCustomer);

router.post("/verify-email", AuthController.verifyEmail);

router.post("/login", AuthController.login);

router.post('/refresh-token', AuthController.refreshToken);

router.post('/logout', AuthController.logout);

router.post('/forgot-password', AuthController.forgotPassword);

router.post('/reset-password/:token', AuthController.resetPassword);

export const AuthRoutes = router;