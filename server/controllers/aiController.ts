import { Request, Response } from 'express';
import { geminiService } from '../services/geminiService';

export class AiController {
  /**
   * POST /api/ai/assistant
   * Protected server-side proxy for Gemini 2.5 Flash
   */
  public async handleAssistantQuery(req: Request, res: Response): Promise<void> {
    const { prompt, context } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({
        success: false,
        message: 'A valid text prompt is required.'
      });
      return;
    }

    const cleanPrompt = prompt.trim();
    if (cleanPrompt.length > 1000) {
      res.status(400).json({
        success: false,
        message: 'Prompt exceeds maximum permitted length of 1,000 characters.'
      });
      return;
    }

    const cleanContext = typeof context === 'string' ? context.slice(0, 500) : undefined;

    try {
      const result = await geminiService.handleCandidateQuery(cleanPrompt, cleanContext);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'AI Assistant service unavailable'
      });
    }
  }
}

export const aiController = new AiController();
