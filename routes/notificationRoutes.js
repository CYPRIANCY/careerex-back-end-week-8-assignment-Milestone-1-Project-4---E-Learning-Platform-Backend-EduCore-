import express from 'express';
import {
  getUserNotifications,
  markAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getUserNotifications);
router.put('/mark-read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
