import express from 'express';
import {
  createReview,
  getCourseReviews,
} from '../controllers/reviewController.js';

import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:courseId', getCourseReviews);
router.post('/', protect, authorizeRoles('student'), createReview);

export default router;
