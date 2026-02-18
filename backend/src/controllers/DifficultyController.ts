import { Request, Response } from "express";
import { DifficultyServiceImpl } from "../services/impl/DifficultyServiceImpl.js";
import logger from "../common-lib/utils/logger.js";

export class DifficultyController  {

  private difficultyService: DifficultyServiceImpl;

  constructor() {
    this.difficultyService = new DifficultyServiceImpl();
  }

  async getAll(req: Request, res: Response, next: any) {
    try {
      const difficulties = await this.difficultyService.getAllDifficulty();
      logger.debug("Difficulties retrieved successfully", { route: req.originalUrl, count: difficulties.length });
      res.status(200).json(difficulties);
    } catch (err) {
      logger.error("Error while getting all difficulties", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }
}