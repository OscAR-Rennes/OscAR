import { Request, Response } from "express";
import { StepServiceImpl } from "../services/impl/StepServiceImpl";

export class StepsController  {

  private stepService: StepServiceImpl;

  constructor() {
    this.stepService = new StepServiceImpl();
  }

  async createStep(req: Request, res: Response, next: any) {
    try {
      const stepData = req.body;
      const newStep = await this.stepService.createStep(stepData);
      res.status(201).json(newStep);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  async deleteStep(req: Request, res: Response, next: any) {
    try {
      const { stepId } = req.params;
      await this.stepService.deleteStep(stepId);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

};