import express from "express";

import {
  invokeAgent,
  getConversations,
  getConversationMessages,
} from "../controllers/user.js";

const router = express.Router();

// Create/send AI message
router.post("/invoke", invokeAgent);

// Get all conversations
router.get("/conversations", getConversations);

// Get messages of a conversation
router.get("/conversations/:conversationId/messages", getConversationMessages);

export default router;
