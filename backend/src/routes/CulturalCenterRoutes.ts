import { Router } from 'express';
import { CulturalCenterController } from '../controllers/CulturalCenterController.js';
import { authMiddleware, requireRole } from '../common-lib/middlewares/AuthMiddleware.js';
import { RoleEnum } from '../common-lib/enum/roleEnum.js';

const culturalCenterRoutes = Router();

const culturalCenterController = new CulturalCenterController();

/**
 * @swagger
 * /culturalcenter/active:
 *   get:
 *     summary: Récupérer tous les centres culturels actifs
 *     tags: [CulturalCenter]
 *     responses:
 *       200:
 *         description: Liste des centres culturels actifs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/CulturalCenterLightDTOWithoutActive"
 */

culturalCenterRoutes.get(
    '/culturalcenter/active', 
    (req, res, next) => culturalCenterController.getAllActive(req, res, next)
);

/**
 * @swagger
 * /culturalcenter:
 *   get:
 *     summary: Récupérer tous les centres culturels
 *     tags: [CulturalCenter]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Rôles autorisés : ADMIN
 *     responses:
 *       200:
 *         description: Liste des centres culturels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/CulturalCenterLightDTO"
 */

culturalCenterRoutes.get(
    '/culturalcenter',
    authMiddleware,
    requireRole([RoleEnum.ADMIN]), 
    (req, res, next) => culturalCenterController.getAll(req, res, next)
)


/** 
 * @swagger
 * /culturalcenter/switchactivation:
 *   put:
 *     summary: Switcher le statut actif d'un centre culturel
 *     tags: [CulturalCenter]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Rôles autorisés : ADMIN 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CulturalCenterSwitchStatus"
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Success"
 */
culturalCenterRoutes.put(
    "/culturalcenter/switchactivation",
    authMiddleware,
    requireRole([RoleEnum.CULTURAL_CENTER_MANAGER, RoleEnum.ADMIN]),
    (req, res, next) => culturalCenterController.switchStatus(req, res, next)
)

export default culturalCenterRoutes;