import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  sendMessage,
  getConversation,
  getInbox,
} from '../controllers/messageController.js';

const router = express.Router();

router.use(protect);

router.post('/', sendMessage);
router.get('/inbox', getInbox);
router.get('/:partnerId', getConversation);

export default router;
