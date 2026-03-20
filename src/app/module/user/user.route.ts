import { Router } from "express";
import { userController } from "./user.controller";




const router = Router();

router.get('/profile', userController.getProfile);

router.put('/profile', userController.updateProfile);

router.get('/bookings',  userController.getMyBookings);

router.get('/reviews', userController.getMyReviews);

router.get('/notifications', userController.getNotifications);

router.put('/notifications/:id/read', userController.markNotificationRead);

router.delete('/account', userController.deleteAccount);



export const UserRoutes = router;