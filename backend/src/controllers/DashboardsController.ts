import { Request, Response } from "express";
import { DashboardsServiceImpl } from "../services/impl/DashboardsServiceImpl";

export class DashboardsController  {

  private dashboardsService: DashboardsServiceImpl;

  constructor() {
    this.dashboardsService = new DashboardsServiceImpl();
  }

  async getDashboardByHunt(req: Request, res: Response, next: any) {
    try {
      const huntId = req.params.hunt_id;
      const dashboards = await this.dashboardsService.getDashboardByHunt(huntId);
      return res.json(dashboards);
    } catch (err) {
      next(err);
    }
  }

    async getDashboardByCulturalCenter(req: Request, res: Response, next: any) {
      try {
        const culturalCenterId = req.params.culturalcenter_id;
        const dashboards = await this.dashboardsService.getDashboardByCulturalCenter(culturalCenterId);
        return res.json(dashboards);
      } catch (err) {
        next(err);
      }
  }
}