import express from 'express';
import {
  createCourse,
  getAllCourses,
  getInstructorCourses,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';

import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getAllCourses);

// Instructor Routes
router.use(protect, authorizeRoles('instructor'));
router.post('/', createCourse);
router.get('/mine', getInstructorCourses);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
