import { Request, Response } from "express";
import logger from "../common-lib/utils/logger.js";
import { AddProgressionRequestDTO } from "../common-lib/dto/progression/AddProgressionRequestDTO.js";
import { ProgressionServiceImpl } from "../services/impl/ProgressionServiceImpl.js";

export class ProgressionController  {

  private progressionService: ProgressionServiceImpl;

  constructor() {
    this.progressionService = new ProgressionServiceImpl();
  }

  async addProgress (req: Request, res: Response, next: any) {
    try {
      const user = req.user;
      const data : AddProgressionRequestDTO = req.body;

      if (!user) {
        logger.warn("Missing user information for save progression", { route: req.originalUrl });
        throw new Error("User information missing");
      }

      await this.progressionService.saveProgression(data, user);
      logger.info("Progression saved successfully", { route: req.originalUrl });
      res.status(201);
    } catch (err) {
      logger.error("Error saving progression", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }


  async getTotalProgress (req: Request, res: Response, next: any) {
    try {
      const user = req.user;

      if (!user) {
        logger.warn("Missing user information for gztting total progression", { route: req.originalUrl });
        throw new Error("User information missing");
      }

      const data =  await this.progressionService.getTotalProgression(user);
      console.log(data)
      logger.info("Total progression retrieved successfully", { route: req.originalUrl });
      res.status(200).json(data);
    } catch (err) {
      logger.error("Error geting total progression", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

  async getProgressByHunt (req: Request, res: Response, next: any) {
    try {
      const user = req.user;
      const id = req.params.id
      if (!user) {
        logger.warn("Missing user information for gztting total progression", { route: req.originalUrl });
        throw new Error("User information missing");
      }

      const data =  await this.progressionService.getProgressionByHunt(user, id);
      console.log(data)
      logger.info("Total progression retrieved successfully", { route: req.originalUrl });
      res.status(200).json(data);
    } catch (err) {
      logger.error("Error geting total progression", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

};