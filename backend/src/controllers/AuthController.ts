import { Request, Response } from "express";
import { AuthServiceImpl } from "../services/impl/AuthServiceImpl.js";
import { AuthRequestDTO } from "../common-lib/dto/auth/AuthRequestDTO.js";
import AppError from "../common-lib/errors/AppError.js";
import logger from "../common-lib/utils/logger.js";

export class AuthController {

  private authService = new AuthServiceImpl();

  async authentificateUser(req: Request, res: Response, next: any) {
    try {
      logger.debug("Auth attempt started", { route: req.originalUrl, ip: req.ip });
      const authRequest: AuthRequestDTO = req.body;

      const errors = [];
      if (!authRequest.email) errors.push({ field: "email", message: "Email requis" });
      if (!authRequest.password) errors.push({ field: "password", message: "Mot de passe requis" });

      if (errors.length) {
        logger.debug("Auth validation failed", { route: req.originalUrl, errors });
        throw new AppError({
          userMessage: "Données invalides",
          details: errors,
          route: req.originalUrl,
          statusCode: 400,
        });
      }

      const result = await this.authService.connectUser(authRequest);

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24,
      });

      const { token, ...user } = result;
      logger.info("User authenticated", {route: req.originalUrl, userId: user.id});
      return res.json(user);
    } catch (err) {
      logger.warn("Authentication failed", { route: req.originalUrl, ip: req.ip, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined});
      next(err);
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    logger.debug("Get current user", { route: req.originalUrl, userId: req.user?.id });
    return res.json(req.user);
  }

  async logoutUser(req: Request, res: Response) {
    logger.info("User logged out", { route: req.originalUrl, userId: req.user?.id, ip: req.ip });
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.sendStatus(204);
  }
}