import { CulturalCenterServiceImpl } from "../services/impl/CulturalCenterImpl";
import { Request, Response } from "express";

export class CulturalCenterController {
    private culturalCenterService: CulturalCenterServiceImpl;

    constructor() {
        this.culturalCenterService = new CulturalCenterServiceImpl();
    }

    async getAllActive(req: Request, res: Response, next: any) {
        try {
            const culturalCenters = await this.culturalCenterService.getAllActiveCulturalCenters();
            res.status(200).json(culturalCenters);
        } catch (err) {
            console.error(err);
            next(err);
        }
    }

    async getAll(req: Request, res: Response, next: any) {
        try {
            const culturalCenters = await this.culturalCenterService.getAllCulturalCenter();
            res.status(200).json(culturalCenters)
        } catch (err) {
            console.error(err)
            next(err)
        }
    }

    async switchStatus(req: Request, res: Response, next:any) {
        try {
        console.log("Switch cultural centers status")
        const ids = req.body.ids
        const result = await this.culturalCenterService.switchCulturalCenterStatus(ids)
        if (!result) {
            return res.status(500).json({ message: "Impossible de changer le statut des centres culturels" });
            }
            return res.status(200).json({ success: true });
        } catch (err){
        next(err)
        }
    }
}