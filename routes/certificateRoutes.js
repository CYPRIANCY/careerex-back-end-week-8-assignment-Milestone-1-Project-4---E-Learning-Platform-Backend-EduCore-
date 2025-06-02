import express from 'express';
import { generateCertificate } from '../controllers/certificateController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:courseId', protect, authorizeRoles('student'), generateCertificate);

export default router;
