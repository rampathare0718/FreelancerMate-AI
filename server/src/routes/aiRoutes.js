import express from 'express';
import { analyzeProject, getAiStatus } from '../controllers/aiController.js';

const router = express.Router();

// GET /api/ai/status - Verify Ollama daemon and Gemma model status
router.get('/status', getAiStatus);

// POST /api/ai/analyze - Analyze project brief with Gemma
router.post('/analyze', analyzeProject);

export default router;
