import { Request, Response } from "express";
import { AuthServiceImpl } from "../services/impl/AuthServiceImpl.js";
import { AuthRequestDTO } from "../common-lib/dto/auth/AuthRequestDTO.js";
import AppError from "../common-lib/errors/AppError.js";

export class AuthController {

  private authService = new AuthServiceImpl();

  async authentificateUser(req: Request, res: Response, next: any) {
    try {
      console.log("Authenticating user");
      const authRequest: AuthRequestDTO = req.body;

      const errors = [];
      if (!authRequest.email) errors.push({ field: "email", message: "Email requis" });
      if (!authRequest.password) errors.push({ field: "password", message: "Mot de passe requis" });

      if (errors.length) {
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
      console.log("User authenticated", user);

      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    console.log("Getting current user", req.user);
    return res.json(req.user);
  }

  async logoutUser(req: Request, res: Response) {
    console.log("Logging out user", req.user);
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.sendStatus(204);
  }
}