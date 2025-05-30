import express from 'express';
import {
  addLesson,
  getCourseLessons,
  updateLesson,
  deleteLesson,
} from '../controllers/lessonController.js';

import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public: Anyone can view lessons of a course
router.get('/:courseId', getCourseLessons);

// Instructor-only: Manage lessons
router.use(protect, authorizeRoles('instructor'));

router.post('/', addLesson);
router.put('/:lessonId', updateLesson);
router.delete('/:lessonId', deleteLesson);

export default router;
