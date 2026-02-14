import { Router } from "express";
import { StepsController } from "../controllers/StepsController.js";
import { authMiddleware, requireRole } from "../common-lib/middlewares/AuthMiddleware.js";
import { RoleEnum } from "../common-lib/enum/roleEnum.js";

const stepsRoutes = Router();

const stepsController = new StepsController();

/**
 * @swagger
 * /step:
 *   post:
 *     summary: Créer une étape pour une chasse
 *     tags: [Step]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Rôles autorisés : HUNT_MANAGER, CULTURAL_CENTER_MANAGER, ADMIN
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/StepCreateRequestDTO"
 *     responses:
 *       201:
 *         description: Étape créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/StepCreateResponseDTO"
 */

stepsRoutes.post(
    "/step", 
    authMiddleware, 
    requireRole([RoleEnum.HUNT_MANAGER, RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN]),
    (req, res, next) => stepsController.createStep(req, res, next)
);

export default stepsRoutes;