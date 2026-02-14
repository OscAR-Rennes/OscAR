import { Router } from "express";
import { IndexController } from "../controllers/IndexController.js";
import { authMiddleware, requireRole } from "../common-lib/middlewares/AuthMiddleware.js";
import { RoleEnum } from "../common-lib/enum/roleEnum.js";

const indexRoutes = Router();

const indexController = new IndexController();

/**
 * @swagger
 * /index:
 *   post:
 *     summary: Créer un index pour une chasse
 *     tags: [Index]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Rôles autorisés : HUNT_MANAGER, CULTURAL_CENTER_MANAGER, ADMIN
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/IndexCreateRequestDTO"
 *     responses:
 *       201:
 *         description: Index créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/IndexCreateResponseDTO"
 */
indexRoutes.post(
    "/index", 
    authMiddleware,
    requireRole([RoleEnum.HUNT_MANAGER, RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN]), 
    (req, res, next) => indexController.createIndex(req, res, next)
);

/**
 * @swagger
 * /index/hunt/{huntId}:
 *   get:
 *     summary: Récupérer l'index d'une chasse
 *     tags: [Index]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Rôles autorisés : HUNT_MANAGER, CULTURAL_CENTER_MANAGER, ADMIN
 *     parameters:
 *       - in: path
 *         name: huntId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Index récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/IndexLightDTO"
 */
indexRoutes.get (
    "/index/hunt/:huntId",
    authMiddleware,
    requireRole([RoleEnum.HUNT_MANAGER, RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN]),
    (req, res, next) => indexController.getIndexByHunt(req, res, next)
);

export default indexRoutes;