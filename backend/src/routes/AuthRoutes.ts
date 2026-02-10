import { Router } from 'express';
import { authMiddleware } from '../common-lib/middlewares/AuthMiddleware.js';
import { AuthServiceImpl } from '../services/impl/AuthServiceImpl.js';
import { AuthController } from '../controllers/AuthController.js';
const authRoutes = Router();

const authController = new AuthController();

/**
 * @swagger
 * /api/auth/login/web:
 *   post:
 *     summary: Authentification utilisateur (web)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AuthRequest"
 *     responses:
 *       200:
 *         description: Utilisateur authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 */

authRoutes.post(
    '/auth/login/web', 
    (req, res, next) => authController.authentificateUser(req, res, next)
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Récupérer l'utilisateur courant
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur courant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       401:
 *         description: Non authentifié
 */

authRoutes.get(
    '/auth/me', 
    authMiddleware, 
    (req, res) => authController.getCurrentUser(req, res)
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Déconnecté
 */

authRoutes.post(
    '/auth/logout', 
    authMiddleware, 
    (req, res) => authController.logoutUser(req, res)
);

export default authRoutes;