import express from 'express';
import {  createScheduleZodSchema, updateScheduleZodSchema } from './schedule.validation';
import { ScheduleController } from './schedule.controller';

import { validateRequest } from '../../middleware/validateRequest';
import { checkAuth } from '../../middleware/ckeckAuth';
import { UserRole } from '../../../generated/prisma/enums';

const router = express.Router();

router.post(
  '/',
  checkAuth(UserRole.BOAT_OWNER), 
  validateRequest(createScheduleZodSchema),
  ScheduleController.createSchedule
);


router.get('/my-boat-schedule',checkAuth(UserRole.BOAT_OWNER), ScheduleController.getMySchedules);

router.patch(
  "/:id",
  checkAuth(UserRole.BOAT_OWNER),
  validateRequest(updateScheduleZodSchema),
  ScheduleController.updateSchedule
);

router.delete('/:id',checkAuth(UserRole.BOAT_OWNER), ScheduleController.deleteSchedule);



export const ScheduleRoutes = router;