import { Request, Response } from "express";
import { HuntServiceImpl } from "../services/impl/HuntServiceImpl.js";
import logger from "../common-lib/utils/logger.js";
import { parsePaginationQuery } from "../common-lib/utils/pagination.js";
import { EditHuntBodyRequestDTO } from "../common-lib/dto/hunt/EditHuntBodyRequestDTO.js";

export class HuntsController  {

  private huntsService: HuntServiceImpl;

  constructor() {
    this.huntsService = new HuntServiceImpl();
  }

  async createHunt(req: Request, res: Response, next: any) {
    try {
      const userId = req.user?.id;
      logger.warn(req.user)
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
      const pagination = parsePaginationQuery(req.query as Record<string, unknown>);
      const allHunt = await this.huntsService.getAllHunt(pagination);
      logger.debug("Hunts retrieved successfully", { route: req.originalUrl, count: allHunt.data.length, page: allHunt.pagination.page, limit: allHunt.pagination.limit, total: allHunt.pagination.total });
      res.status(200).json(allHunt);
    } catch(err) {
      logger.error("Error getting all hunts", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

  async editHunt(req: Request, res: Response,next: any) {
    try {
      const user = req.user
      const huntId = req.params.id;

      if (!user || !huntId) {
        logger.warn("Missing user information for hunt edition", { route: req.originalUrl });
        throw new Error("User information missing");
      }
      const huntBody: EditHuntBodyRequestDTO = req.body;
      const huntData = {
        id: huntId,
        ...huntBody,
      };
      const editHunt = await this.huntsService.editHunt(huntData, user)
      logger.info("Hunt edited successfully", { route: req.originalUrl, huntId: editHunt.id, editedBy: user.id });
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
      const pagination = parsePaginationQuery(req.query as Record<string, unknown>);
      if (!user) {
        logger.warn("User missing in request for getting hunts", { route: req.originalUrl });
        throw new Error("User not found in request");
      }
      const hunts = await this.huntsService.getHuntByCulturalCenter(id,user, pagination);
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
      const ids = req.body?.ids;

      if (!user) {
        logger.warn("User missing in request for deleting hunt", { route: req.originalUrl });
        throw new Error("User not found in request");
      }

      if (!Array.isArray(ids) || ids.length === 0 || ids.some((id) => typeof id !== "string" || !id.trim())) {
        logger.warn("Invalid ids payload for deleting hunts", { route: req.originalUrl });
        throw new Error("Invalid ids payload");
      }

      await this.huntsService.deleteHunt(user, ids);
      logger.info(`Hunts deleted successfully`, { route: req.originalUrl, deletedBy: user.id, deletedCount: ids.length });
      res.status(204).send();
    } catch (err) {
      logger.error("Error deleting hunt", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }
};