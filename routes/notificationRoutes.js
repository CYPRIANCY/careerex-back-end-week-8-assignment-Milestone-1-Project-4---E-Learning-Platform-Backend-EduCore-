import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  getMyNotifications,
  markAsRead,
} from '../controllers/notificationController.js';

const router = express.Router();

router.use(protect);

router.get('/', getMyNotifications);
router.put('/:notificationId/read', markAsRead);

export default router;
