import { Request, Response } from "express";
import { IndexServiceImpl } from "../services/impl/IndexServiceImpl.js";

export class IndexController  {

  private indexService: IndexServiceImpl;

  constructor() {
    this.indexService = new IndexServiceImpl();
  }

  async createIndex(req: Request, res: Response, next: any) {
    try {
      const indexData = req.body;
      const newIndex = await this.indexService.createIndex(indexData);
      res.status(201).json(newIndex);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  async getIndexByHunt(req: Request, res: Response, next: any) {
    try {
        const { huntId } = req.params;
        const index = await this.indexService.getIndexByHunt(huntId);
        res.status(201).json(index)
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

};