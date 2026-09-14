import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore';
import { ExamResult } from '../../src/types';

export class ResultController {
  /**
   * GET /api/results
   */
  public async getAllResults(req: Request, res: Response): Promise<void> {
    const results = await dataStore.getResults();
    res.json({
      success: true,
      count: results.length,
      results
    });
  }

  /**
   * GET /api/results/search?rollNumber=...&regNumber=...
   */
  public async searchResult(req: Request, res: Response): Promise<void> {
    const rollNumber = (req.query.rollNumber as string || req.query.rollNo as string || '').trim();
    const regNumber = (req.query.regNumber as string || req.query.regNo as string || '').trim();

    if (!rollNumber && !regNumber) {
      res.status(400).json({
        success: false,
        message: 'Please provide either Roll Number or Registration Number.'
      });
      return;
    }

    const result = await dataStore.searchResult(rollNumber, regNumber);
    if (!result) {
      res.status(404).json({
        success: false,
        message: 'No board examination result matched the provided credentials.'
      });
      return;
    }

    res.json({
      success: true,
      result
    });
  }

  /**
   * POST /api/results (Admin only)
   */
  public async saveResult(req: Request, res: Response): Promise<void> {
    const resultData = req.body as ExamResult;
    if (!resultData.rollNo || !resultData.candidateName) {
      res.status(400).json({
        success: false,
        message: 'Roll Number and Candidate Name are required.'
      });
      return;
    }

    const saved = await dataStore.saveResult(resultData);
    res.json({
      success: true,
      result: saved,
      message: 'Examination result successfully published.'
    });
  }

  /**
   * POST /api/results/clear-all
   */
  public async clearAllResults(req: Request, res: Response): Promise<void> {
    await dataStore.clearAllResults();
    res.json({
      success: true,
      message: 'All examination results permanently removed.'
    });
  }
}

export const resultController = new ResultController();
