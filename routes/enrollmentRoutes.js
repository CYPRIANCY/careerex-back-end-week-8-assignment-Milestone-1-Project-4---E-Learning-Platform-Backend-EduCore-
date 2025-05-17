import express from 'express';
import {
  enrollInCourse,
  getMyEnrollments,
  getCourseEnrollments,
} from '../controllers/enrollmentController.js';

import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Student Routes
router.post('/', protect, authorizeRoles('student'), enrollInCourse);
router.get('/my', protect, authorizeRoles('student'), getMyEnrollments);

// Instructor Route
router.get('/course/:courseId', protect, authorizeRoles('instructor'), getCourseEnrollments);

export default router;
