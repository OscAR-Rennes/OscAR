import { Router } from "express";
import { StepsController } from "../controllers/StepsController.js";
import { authMiddleware, requireRole } from "../common-lib/middlewares/AuthMiddleware.js";
import { RoleEnum } from "../common-lib/enum/roleEnum.js";
import { uploadStepFiles } from "../common-lib/middlewares/UploadMiddleware.js";

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
    uploadStepFiles,
    requireRole([RoleEnum.HUNT_MANAGER, RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN]),
    (req, res, next) => stepsController.createStep(req, res, next)
);

stepsRoutes.get(
    "/step/culturalcenter",
    authMiddleware,
    requireRole([RoleEnum.HUNT_MANAGER, RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN]),
    (req, res, next) => stepsController.getStepsByCulturalCenter(req, res, next)
);

stepsRoutes.get(
    "/step/getbyid/:id",
    (req, res, next) => stepsController.getStepById(req, res, next)
)

stepsRoutes.get(
    "/step/index/:indexId",
    authMiddleware,
    requireRole([RoleEnum.HUNT_MANAGER, RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN]),
    (req, res, next) => stepsController.getStepsByIndex(req, res, next)
)

stepsRoutes.put(
    "/step/edit/:id",
    authMiddleware,
    requireRole([RoleEnum.HUNT_MANAGER, RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN]),
    (req, res, next) => stepsController.editStep(req, res, next)
)

stepsRoutes.delete(
    "/step",
    authMiddleware,
    requireRole([RoleEnum.HUNT_MANAGER, RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN]),
    (req, res, next) => stepsController.deleteStep(req, res, next)
)

stepsRoutes.get(
    "/step/getByHunt/:id",
    (req, res, next) => stepsController.getStepByHunt(req, res, next)
)

stepsRoutes.get(
    "/step/downloadAr/:id",
    (req, res, next) => stepsController.downloadStepAr(req, res, next)
)

stepsRoutes.get(
    "/step/downloadTarget/:id",
    (req, res, next) => stepsController.downloadStepTarget(req, res, next)
)

export default stepsRoutes;