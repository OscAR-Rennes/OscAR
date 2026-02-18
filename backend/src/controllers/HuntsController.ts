import { NextFunction, Request, Response } from "express";
import { HuntServiceImpl } from "../services/impl/HuntServiceImpl.js";

export class HuntsController  {

  private huntsService: HuntServiceImpl;

  constructor() {
    this.huntsService = new HuntServiceImpl();
  }

  async createHunt(req: Request, res: Response, next: any) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User ID not found in request");
      }
      const userCulturalCenterId = req.user?.id_cultural_center;
      if (!userCulturalCenterId) {
        throw new Error("User cultural center ID not found in request");
      }
      const huntData = req.body;
      const newHunt = await this.huntsService.createHunt(huntData, userId, userCulturalCenterId);
      res.status(201).json(newHunt);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  async getAllHunt(req: Request, res: Response, next: any) {
    try {
      const allHunt = await this.huntsService.getAllHunt();
      res.status(201).json(allHunt);
    } catch(err) {
      console.error(err);
      next(err);
    }
  }

  async editHunt(req: Request, res: Response,next: any) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User ID not found in request");
      }
      const userRights = req.user?.rights;
      if (!userRights) {
        throw new Error("User rights not found in request");
      }
      const huntData = req.body;
      const editHunt = await this.huntsService.editHunt(huntData, userId, userRights)
      res.status(201).json(editHunt)
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  async getHuntByCulturalCenter(req: Request, res: Response, next: any) {
    try {
      const user = req.user;
      if (!user) {
        throw new Error("User not found in request");
      }
      const hunts = await this.huntsService.getHuntByCulturalCenter(user);
      res.status(200).json(hunts);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
};