import express from 'express';
import {
  getAllUsers,
  getAllCourses,
  getDashboardStats,
} from '../controllers/adminController.js';

import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect, authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.get('/courses', getAllCourses);
router.get('/stats', getDashboardStats);

export default router;

