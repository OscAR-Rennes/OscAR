import logger from "../common-lib/utils/logger.js";
import { CulturalCenterServiceImpl } from "../services/impl/CulturalCenterImpl.js";
import { Request, Response } from "express";
import { parsePaginationQuery } from "../common-lib/utils/pagination.js";

export class CulturalCenterController {
    private culturalCenterService: CulturalCenterServiceImpl;

    constructor() {
        this.culturalCenterService = new CulturalCenterServiceImpl();
    }

    async getAllActive(req: Request, res: Response, next: any) {
        try {
            const pagination = parsePaginationQuery(req.query as Record<string, unknown>);
            const culturalCenters = await this.culturalCenterService.getAllActiveCulturalCenters(pagination);
            logger.debug("Active cultural centers retrieved", { route: req.originalUrl, count: culturalCenters.data.length, page: culturalCenters.pagination.page, limit: culturalCenters.pagination.limit, total: culturalCenters.pagination.total });
            res.status(200).json(culturalCenters);
        } catch (err) {
            logger.error("Failed to get active cultural centers", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
            next(err);
        }
    }

    async getAll(req: Request, res: Response, next: any) {
        try {
            const pagination = parsePaginationQuery(req.query as Record<string, unknown>);
            const culturalCenters = await this.culturalCenterService.getAllCulturalCenter(pagination);
            logger.debug("All cultural centers retrieved", { route: req.originalUrl, count: culturalCenters.data.length, page: culturalCenters.pagination.page, limit: culturalCenters.pagination.limit, total: culturalCenters.pagination.total });
            res.status(200).json(culturalCenters)
        } catch (err) {
            logger.error("Failed to get all cultural centers", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
            console.error(err)
            next(err)
        }
    }

    async switchStatus(req: Request, res: Response, next:any) {
        try {
        const ids = req.body.ids
        const result = await this.culturalCenterService.switchCulturalCenterStatus(ids)
        if (!result) {
            logger.warn("Switch cultural centers status failed", { route: req.originalUrl, count: Array.isArray(ids) ? ids.length : 0 });
            return res.status(500).json({ message: "Impossible de changer le statut des centres culturels" });
        }
        logger.info("Cultural centers status switched successfully", { route: req.originalUrl, count: Array.isArray(ids) ? ids.length : 0, userId: req.user?.id });
        return res.status(200).json({ success: true });
        } catch (err){
            logger.error("Error while switching cultural centers status", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
            next(err)
        }
    }
}