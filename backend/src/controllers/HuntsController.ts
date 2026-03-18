import { Request, Response } from "express";
import { HuntServiceImpl } from "../services/impl/HuntServiceImpl.js";
import logger from "../common-lib/utils/logger.js";

export class HuntsController  {

  private huntsService: HuntServiceImpl;

  constructor() {
    this.huntsService = new HuntServiceImpl();
  }

  async createHunt(req: Request, res: Response, next: any) {
    try {
      const userId = req.user?.id;
      const userCulturalCenterId = req.user?.id_cultural_center;
      if (!userId || !userCulturalCenterId) {
        logger.warn("Missing user information for hunt creation", { route: req.originalUrl });
        throw new Error("User information missing");
      }
      const huntData = req.body;
      const newHunt = await this.huntsService.createHunt(huntData, userId, userCulturalCenterId);
      logger.info("Hunt created successfully", { route: req.originalUrl, huntId: newHunt.id, createdBy: userId });
      res.status(201).json(newHunt);
    } catch (err) {
      logger.error("Error creating hunt", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

  async getAllHunt(req: Request, res: Response, next: any) {
    try {
      const allHunt = await this.huntsService.getAllHunt();
      logger.debug("Hunts retrieved successfully", { route: req.originalUrl, count: allHunt.length });
      res.status(201).json(allHunt);
    } catch(err) {
      logger.error("Error getting all hunts", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

  async editHunt(req: Request, res: Response,next: any) {
    try {
      const userId = req.user?.id;
      const userRights = req.user?.rights;
      if (!userId || !userRights) {
        logger.warn("Missing user information for hunt edition", { route: req.originalUrl });
        throw new Error("User information missing");
      }
      const huntData = req.body;
      const editHunt = await this.huntsService.editHunt(huntData, userId, userRights)
      logger.info("Hunt edited successfully", { route: req.originalUrl, huntId: editHunt.id, editedBy: userId })
      res.status(201).json(editHunt)
    } catch (err) {
      logger.error("Error editing hunt", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

  async getHuntByCulturalCenter(req: Request, res: Response, next: any) {
    try {
      const id = req.params.id;
      const user = req.user;
      const hunts = await this.huntsService.getHuntByCulturalCenter(id, user);
      logger.info(`Hunts retrieved succesfully`, { route: req.originalUrl })
      res.status(200).json(hunts);
    } catch (err) {
      logger.error("Error getting hunts by cultural center", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

  async getHuntById(req: Request, res: Response, next: any) {
    try {
      const id = req.params.id;
      const hunt = await this.huntsService.getHuntById(id)
      if (!hunt) {
        logger.warn(`Hunt with id ${id} not found`, { route: req.originalUrl })
        res.status(404)
      }
      logger.info(`Hunt with id ${id} retrieved succesfully`, { route: req.originalUrl })
      res.status(200).json(hunt)
    } catch (err) {
      logger.error("Error getting hunts by id", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

  async deleteHunt(req: Request, res: Response, next: any) {
    try {
      const user = req.user;
      const id = req.params.id;

      if (!user) {
        logger.warn("User missing in request for deleting hunt", { route: req.originalUrl });
        throw new Error("User not found in request");
      }

      await this.huntsService.deleteHunt(user, id);
      logger.info(`Hunt with id ${id} deleted successfully`, { route: req.originalUrl, deletedBy: user.id });
      res.status(204).send();
    } catch (err) {
      logger.error("Error deleting hunt", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }
};