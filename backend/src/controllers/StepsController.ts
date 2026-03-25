import { Request, Response } from "express";
import { StepServiceImpl } from "../services/impl/StepServiceImpl.js";
import logger from "../common-lib/utils/logger.js";
import { EditStepBodyRequestDTO } from "../common-lib/dto/step/EditStepBodyRequestDTO.js";

export class StepsController  {

  private stepService: StepServiceImpl;

  constructor() {
    this.stepService = new StepServiceImpl();
  }

  async createStep(req: Request, res: Response, next: any) {
      try {
          const stepData = req.body;
          const files = req.files as { [fieldname: string]: Express.Multer.File[] };

          const imageFile = files?.image_file?.[0];
          const modelFile = files?.model_file?.[0];

          const newStep = await this.stepService.createStep(stepData, imageFile, modelFile);
          logger.info("Step created successfully", { route: req.originalUrl, stepId: newStep.id, createdBy: req.user?.id });
          res.status(201).json(newStep);
      } catch (err) {
          logger.error("Error creating step", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err });
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

  async getStepById(req: Request, res: Response, next: any) {
    try {
      const id = req.params.id;
      const step = await this.stepService.getStepById(id)
      if (!step) {
        logger.warn(`Step with id ${id} not found`, { route: req.originalUrl })
        res.status(404)
      }
      logger.info(`Step with id ${id} retrieved succesfully`, { route: req.originalUrl })
      res.status(200).json(step)
    } catch (err) {
      logger.error("Error getting steps by id", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

  async editStep(req: Request, res: Response, next: any) {
    try {
      const user = req.user;
      const stepId = req.params.id;

      if (!user || !stepId) {
        logger.warn("Missing user information for step edition", { route: req.originalUrl });
        throw new Error("User information missing");
      }

      const stepBody: EditStepBodyRequestDTO = req.body;
      const stepData = {
        id: stepId,
        ...stepBody,
      };

      const editedStep = await this.stepService.editStep(stepData, user);
      logger.info("Step edited successfully", { route: req.originalUrl, stepId: editedStep.id, editedBy: user.id });
      res.status(200).json(editedStep);
    } catch (err) {
      logger.error("Error editing step", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

  async deleteStep(req: Request, res: Response, next: any) {
    try {
      const user = req.user;
      const id = req.params.id;

      if (!user) {
        logger.warn("User missing in request for deleting step", { route: req.originalUrl });
        throw new Error("User not found in request");
      }

      await this.stepService.deleteStep(user, id);
      logger.info(`Step with id ${id} deleted successfully`, { route: req.originalUrl, deletedBy: user.id });
      res.status(204).send();
    } catch (err) {
      logger.error("Error deleting step", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

  async getStepsByIndex(req: Request, res: Response, next: any) {
    try {
      const user = req.user;
      const indexId = req.params.indexId;
      if (!user) {
        logger.warn("User missing in request for getting steps by index", { route: req.originalUrl });
        throw new Error("User not found in request");
      }
      const steps = await this.stepService.getStepsByIndex(indexId);
      logger.info(`Steps for index ${indexId} retrieved successfully`, { route: req.originalUrl });
      res.status(200).json(steps);
    } catch (err) {
      logger.error("Error getting steps by index", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

  async getStepByHunt(req: Request, res: Response, next: any) {
    try { 
      const id = req.params.id;
      const steps = await this.stepService.getStepsByHunt(id);
      logger.info(`Steps for hunt ${id} retrieved successfully`, { route: req.originalUrl });
      res.status(200).json(steps);
    } catch (err) {
      logger.error("Error getting steps by index", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }
};