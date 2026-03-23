import { Router } from "express";
import { authMiddleware, requireRole } from "../common-lib/middlewares/AuthMiddleware.js";
import { RoleEnum } from "../common-lib/enum/roleEnum.js";
import { optionalAuthMiddleware } from "../common-lib/middlewares/OptionnalAuthMiddleware.js";
import { ProgressionController } from "../controllers/ProgressionController.js";

const progressionRoutes = Router();

const progressionController = new ProgressionController();

progressionRoutes.post(
    "/progression/progress",
    requireRole([RoleEnum.USER]),
    (req, res, next) => progressionController.addProgress(req, res, next)
);

progressionRoutes.get(
    "/progression",
    requireRole([RoleEnum.USER]),
    (req, res, next) => progressionController.getTotalProgress(req, res, next)
)

progressionRoutes.get(
    "/progression/getByHunt/:id",
    requireRole([RoleEnum.USER]),
    (req, res, next) => progressionController.getProgressByHunt(req, res, next)
)
export default progressionRoutes;