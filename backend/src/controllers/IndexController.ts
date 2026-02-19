import { Request, Response } from "express";
import { IndexServiceImpl } from "../services/impl/IndexServiceImpl.js";
import logger from "../common-lib/utils/logger.js";

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
        const index = await this.indexService.getIndexByHunt(huntId);
        logger.info("Index retrieved by hunt", { route: req.originalUrl, huntId });
        res.status(201).json(index)
    } catch (err) {
      logger.error("Error getting index by hunt", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
      next(err);
    }
  }

};