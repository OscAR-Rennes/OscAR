import { Router } from "express";
import { HuntsController } from "../controllers/HuntsController.js";
import { authMiddleware, requireRole } from "../common-lib/middlewares/AuthMiddleware.js";
import { RoleEnum } from "../common-lib/enum/roleEnum.js";

const huntsRoutes = Router();

const huntsController = new HuntsController();

/**
 * @swagger
 * /hunt:
 *   post:
 *     summary: Créer une chasse
 *     tags: [Hunt]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Rôles autorisés : HUNT_MANAGER, CULTURAL_CENTER_MANAGER, ADMIN
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/HuntCreateRequestDTO"
 *     responses:
 *       201:
 *         description: Chasse créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/HuntCreateResponseDTO"
 */


huntsRoutes.post(
    "/hunt", 
    authMiddleware,
    requireRole([RoleEnum.HUNT_MANAGER, RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN]),
    (req, res, next) => huntsController.createHunt(req, res, next)
);

/**
 * @swagger
 * /hunt:
 *   get:
 *     summary: Récupérer toutes les chasses
 *     tags: [Hunt]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Rôles autorisés : HUNT_MANAGER, CULTURAL_CENTER_MANAGER, ADMIN
 *     responses:
 *       200:
 *         description: Liste des chasses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/HuntLightDTO"
 */
huntsRoutes.get(
    "/hunt", 
    authMiddleware,
    requireRole([RoleEnum.HUNT_MANAGER, RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN]),
    (req, res, next) => huntsController.getAllHunt(req, res, next)
);

export default huntsRoutes;