import express from 'express';
import {
  markLessonComplete,
  getProgressByCourse,
} from '../controllers/progressController.js';

import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect, authorizeRoles('student'));

router.post('/complete', markLessonComplete);
router.get('/:courseId', getProgressByCourse);

export default router;
