import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { loginZodSchema, registerZodSchema } from "./auth.validation";
import { checkAuth } from "../../middleware/ckeckAuth";
import { UserRole } from "../../../generated/prisma/enums";



const router = Router();

router.post("/register",validateRequest(registerZodSchema), AuthController.register);

router.post("/verify-email", AuthController.verifyEmail);

router.post("/login",validateRequest(loginZodSchema), AuthController.login);

router.post('/refresh-token', AuthController.refreshToken);

router.post('/logout', AuthController.logout);

router.post('/forgot-password', AuthController.forgotPassword);

router.get('/me', checkAuth(UserRole.CUSTOMER, UserRole.BOAT_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN), AuthController.getMe)

router.get('/login/google', AuthController.googleLogin)
router.get('/google/success', AuthController.goolgeLoginSuccess)
router.get('/oauth/error', AuthController.handleAuthError)

export const AuthRoutes = router;