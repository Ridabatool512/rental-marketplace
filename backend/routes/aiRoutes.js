const express = require("express");
const router = express.Router();
const { getRecommendations } = require("../controllers/aiController");
const { chatWithAssistant } = require("../controllers/aiChatController");

// Real LLM chat endpoint. The API key stays on the backend.
router.post("/chat", chatWithAssistant);

// Content-based listing recommendations.
router.get("/recommendations", getRecommendations);

module.exports = router;
