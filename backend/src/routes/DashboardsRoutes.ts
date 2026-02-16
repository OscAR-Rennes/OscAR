import { Router } from "express";
import { DashboardsController } from "../controllers/DashboardsController.js";
import { authMiddleware, requireRole } from "../common-lib/middlewares/AuthMiddleware.js";
import { RoleEnum } from "../common-lib/enum/roleEnum.js";

const dashboardsRoutes = Router();

const dashboardsController = new DashboardsController();

/** 
 * @swagger
 * /dashboards/hunt/{huntId}:
 *   get:
 *     summary: Récupérer les dashboards d'une chasse
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Rôles autorisés : HUNT_MANAGER, CULTURAL_CENTER_MANAGER, ADMIN 
 *     parameters:
 *       - in: path
 *         name: hunt_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste de dashboards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/DashboardHuntLightDTO"
 */

dashboardsRoutes.get(
    "/dashboards/hunt/:hunt_id", 
    authMiddleware,
    requireRole([RoleEnum.HUNT_MANAGER, RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN]),
    (req, res, next) => dashboardsController.getDashboardByHunt(req, res, next)
);

/** 
 * @swagger
 * /dashboards/culturalCenter/{culturalcenterId}:
 *   get:
 *     summary: Récupérer les dashboards d'un centre culturel
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Rôles autorisés : CULTURAL_CENTER_MANAGER, ADMIN 
 *     parameters:
 *       - in: path
 *         name: culturalcenter_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste de dashboards d'un centre culturel
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/DashboardCentreCulturelLightDTO"
 */

dashboardsRoutes.get(
    "/dashboards/culturalCenter/:culturalcenter_id", 
    authMiddleware,
    requireRole([RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN]),
    (req, res, next) => dashboardsController.getDashboardByCulturalCenter(req, res, next)
);

export default dashboardsRoutes;