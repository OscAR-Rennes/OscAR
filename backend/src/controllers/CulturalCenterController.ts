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

    async getAllActiveForMap(req: Request, res: Response, next: any) {
        try {
            const pagination = parsePaginationQuery(req.query as Record<string, unknown>);
            const filters = {
                search: typeof req.query.search === "string" ? req.query.search.trim() : undefined,
                minLat: req.query.minLat !== undefined ? Number(req.query.minLat) : undefined,
                maxLat: req.query.maxLat !== undefined ? Number(req.query.maxLat) : undefined,
                minLng: req.query.minLng !== undefined ? Number(req.query.minLng) : undefined,
                maxLng: req.query.maxLng !== undefined ? Number(req.query.maxLng) : undefined,
            };

            const culturalCenters = await this.culturalCenterService.getAllActiveCulturalCentersForMap(pagination, filters);
            logger.debug("Map cultural centers retrieved", { route: req.originalUrl, count: culturalCenters.data.length, page: culturalCenters.pagination.page, limit: culturalCenters.pagination.limit, total: culturalCenters.pagination.total });
            res.status(200).json(culturalCenters);
        } catch (err) {
            logger.error("Failed to get map cultural centers", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
            next(err);
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

    async deleteCulturalCenter(req: Request, res: Response, next: any) {
        try {
            const user = req.user;
            const ids = req.body?.ids;

            if (!user) {
                logger.warn("User missing in request for deleting cultural centers", { route: req.originalUrl });
                throw new Error("User not found in request");
            }

            if (!Array.isArray(ids) || ids.length === 0 || ids.some((id) => typeof id !== "string" || !id.trim())) {
                logger.warn("Invalid ids payload for deleting cultural centers", { route: req.originalUrl });
                throw new Error("Invalid ids payload");
            }

            await this.culturalCenterService.deleteCulturalCenters(user, ids);
            logger.info("Cultural centers deleted successfully", { route: req.originalUrl, deletedBy: user.id, deletedCount: ids.length });
            res.status(204).send();
        } catch (err) {
            logger.error("Error deleting cultural centers", { route: req.originalUrl, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined });
            next(err);
        }
    }
}