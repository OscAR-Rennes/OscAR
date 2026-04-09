import { Request, Response } from "express";
import { AuthServiceImpl } from "../services/impl/AuthServiceImpl.js";
import { AuthRequestDTO } from "../common-lib/dto/auth/AuthRequestDTO.js";
import AppError from "../common-lib/errors/AppError.js";
import logger from "../common-lib/utils/logger.js";
import { AuthTwoFactorVerifyRequestDTO } from "../common-lib/dto/auth/AuthTwoFactorVerifyRequestDTO.js";
import { AuthTwoFactorResendRequestDTO } from "../common-lib/dto/auth/AuthTwoFactorResendRequestDTO.js";

export class AuthController {

  private authService = new AuthServiceImpl();

  async authentificateUser(req: Request, res: Response, next: any) {
    try {
      logger.debug("Auth attempt started", { route: req.originalUrl, ip: req.ip });
      const authRequest: AuthRequestDTO = {
        ...req.body,
        trustedDeviceToken: req.cookies?.trusted_device,
      };

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

      if (!result.token) {
        logger.info("Two-factor code sent", { route: req.originalUrl, email: authRequest.email });
        return res.json(result);
      }

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24,
      });

      if (result.trustedDeviceToken) {
        res.cookie("trusted_device", result.trustedDeviceToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60 * 24 * 180,
        });
      }

      logger.info("User authenticated", {route: req.originalUrl, userId: result.id});
      return res.json(result);
    } catch (err) {
      logger.warn("Authentication failed", { route: req.originalUrl, ip: req.ip, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined});
      next(err);
    }
  }

  async verifyTwoFactorUser(req: Request, res: Response, next: any) {
    try {
      const payload: AuthTwoFactorVerifyRequestDTO = req.body;
      if (!payload.challengeToken || !payload.code) {
        throw new AppError({
          userMessage: "Données invalides",
          statusCode: 400,
        });
      }

      const result = await this.authService.verifyTwoFactorCode(payload);

      if (result.token) {
        res.cookie("token", result.token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60 * 24,
        });
      }

      if (result.trustedDeviceToken) {
        res.cookie("trusted_device", result.trustedDeviceToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60 * 24 * 180,
        });
      }

      logger.info("Two-factor code verified", { route: req.originalUrl, userId: result.id });
      return res.json(result);
    } catch (err) {
      logger.warn("Two-factor verification failed", { route: req.originalUrl, ip: req.ip, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined});
      next(err);
    }
  }

  async resendTwoFactorCode(req: Request, res: Response, next: any) {
    try {
      const payload: AuthTwoFactorResendRequestDTO = req.body;
      if (!payload.challengeToken) {
        throw new AppError({
          userMessage: "Données invalides",
          statusCode: 400,
        });
      }

      const result = await this.authService.resendTwoFactorCode(payload);

      logger.info("Two-factor code resent", { route: req.originalUrl, userId: result.id });
      return res.json(result);
    } catch (err) {
      logger.warn("Two-factor resend failed", { route: req.originalUrl, ip: req.ip, errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined});
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