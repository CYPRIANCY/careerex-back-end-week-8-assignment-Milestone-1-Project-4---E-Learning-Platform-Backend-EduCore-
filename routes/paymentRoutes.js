import express from 'express';
import { createOrder, captureOrder } from '../controllers/paymentController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, authorizeRoles('student'), createOrder);
router.post('/capture-order', protect, authorizeRoles('student'), captureOrder);

export default router;
