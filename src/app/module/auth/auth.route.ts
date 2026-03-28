import { Router } from "express";
import { AuthController } from "./auth.controller";



const router = Router();

router.post("/register", AuthController.register);

router.post("/verify-email", AuthController.verifyEmail);

router.post("/login", AuthController.login);

router.post('/refresh-token', AuthController.refreshToken);

router.post('/logout', AuthController.logout);

router.post('/forgot-password', AuthController.forgotPassword);

router.get('/login/google', AuthController.googleLogin)
router.get('/google/success', AuthController.goolgeLoginSuccess)
router.get('/oauth/error', AuthController.handleAuthError)

export const AuthRoutes = router;