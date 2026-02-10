import { Router } from "express";
import { DifficultyController } from "../controllers/DifficultyController.js";
import { authMiddleware, requireRole } from "../common-lib/middlewares/AuthMiddleware.js";
import { RoleEnum } from "../common-lib/enum/roleEnum.js";

const difficultyRoutes = Router();

const difficultyController = new DifficultyController();

/**
 * @swagger
 * /difficulty:
 *   get:
 *     summary: Récupérer tous les niveaux de difficulté
 *     tags: [Difficulty]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Rôles autorisés : HUNT_MANAGER, CULTURAL_CENTER_MANAGER, ADMIN
 *     responses:
 *       200:
 *         description: Liste des niveaux de difficulté
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/DifficultyLightDTO"
 */

difficultyRoutes.get(
    "/difficulty", 
    authMiddleware,
    requireRole([RoleEnum.HUNT_MANAGER, RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN]),
    (req, res, next) => difficultyController.getAll(req, res, next)
);

export default difficultyRoutes;