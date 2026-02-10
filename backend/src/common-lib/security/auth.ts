import { SignJWT } from "jose";
import { jwtVerify } from "jose";
import { AuthResponseDTO } from "../dto/auth/AuthResponseDTO.js";
import { NextFunction } from "express";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateToken(user: AuthResponseDTO) {
  return await new SignJWT({
    id: user.id.toString(),
    username: user.username, //to delete
    rights: user.rights,
    cultural_center: user.id_cultural_center,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2h")
    .sign(secret);
}


export async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return await jwtVerify(token, secret);
}

