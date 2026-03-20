import { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";
import { AuthResponseDTO } from "../dto/auth/AuthResponseDTO.js";

export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token;

  // Aucun token → on continue sans rien ajouter
  if (!token) {
    return next();
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Ajout du user dans la requête
    req.user = payload as unknown as AuthResponseDTO;

  } catch (err) {
    req.user = undefined;
  }

  return next();
}