import express from 'express';
import { PaymentController } from './payment.controller';
import { checkAuth } from '../../middleware/ckeckAuth';
import { UserRole } from '../../../generated/prisma/enums';


const router = express.Router();

router.get("/",checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), PaymentController.getPayments);

export const PaymentRoutes = router;