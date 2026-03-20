import { Request, Response } from "express";
import { IndexServiceImpl } from "../services/impl/IndexServiceImpl.js";
import logger from "../common-lib/utils/logger.js";
import { parsePaginationQuery } from "../common-lib/utils/pagination.js";

export class IndexController  {

  private indexService: IndexServiceImpl;

  constructor() {
    this.indexService = new IndexServiceImpl();
  }

  async createIndex(req: Request, res: Response, next: any) {
    try {
      const indexData = req.body;
      const newIndex = await this.indexService.createIndex(indexData);
      logger.info("Index created successfully", { route: req.originalUrl, indexId: newIndex.id, createdBy: req.user?.id });
      res.status(201).json(newIndex);
    } catch (err) {
      logger.error("Error creating index", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

  async getIndexByHunt(req: Request, res: Response, next: any) {
    try {
        const { huntId } = req.params;
        const pagination = parsePaginationQuery(req.query as Record<string, unknown>);
        const index = await this.indexService.getIndexByHunt(huntId, pagination);
        logger.info("Index retrieved by hunt", { route: req.originalUrl, huntId });
        res.status(200).json(index)
    } catch (err) {
      logger.error("Error getting index by hunt", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

  async deleteIndex(req: Request, res: Response, next: any) {
    try {
      const user = req.user;
      const ids = req.body?.ids;

      if (!user) {
        logger.warn("User missing in request for deleting index", { route: req.originalUrl });
        throw new Error("User not found in request");
      }

      if (!Array.isArray(ids) || ids.length === 0 || ids.some((id) => typeof id !== "string" || !id.trim())) {
        logger.warn("Invalid ids payload for deleting index", { route: req.originalUrl });
        throw new Error("Invalid ids payload");
      }

      await this.indexService.deleteIndex(user, ids);
      logger.info("Indexes deleted successfully", { route: req.originalUrl, deletedBy: user.id, deletedCount: ids.length });
      res.status(204).send();
    } catch (err) {
      logger.error("Error deleting index", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

};