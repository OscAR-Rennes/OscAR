import { Request, Response } from "express";
import { StepServiceImpl } from "../services/impl/StepServiceImpl.js";
import logger from "../common-lib/utils/logger.js";

export class StepsController  {

  private stepService: StepServiceImpl;

  constructor() {
    this.stepService = new StepServiceImpl();
  }

  async createStep(req: Request, res: Response, next: any) {
    try {
      const stepData = req.body;
      const newStep = await this.stepService.createStep(stepData);
      logger.info("Step created successfully", { route: req.originalUrl, stepId: newStep.id , createdBy: req.user?.id });
      res.status(201).json(newStep);
    } catch (err) {
      logger.error("Error creating step", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      console.error(err);
      next(err);
    }
  }

  async getStepsByCulturalCenter(req: Request, res: Response, next: any) {
    try {
      const user = req.user;
      if (!user) {
        logger.warn("User missing in request for getStepsByCulturalCenter", { route: req.originalUrl });
        throw new Error("User not found in request");
      }
      const steps = await this.stepService.getStepsByCulturalCenter(user);
      res.status(200).json(steps);
    } catch (err) {
      logger.error("Error getting steps by cultural center", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

};