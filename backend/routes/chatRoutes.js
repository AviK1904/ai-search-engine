import express from 'express';
import { generateChatResponse } from '../controllers/chatController.js';

const router = express.Router();

// When someone POSTs to this router, send them to the Worker function
router.post('/', generateChatResponse);

export default router;