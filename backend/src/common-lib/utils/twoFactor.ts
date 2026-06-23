import { SignJWT, jwtVerify } from "jose";
import { randomInt } from "node:crypto";
import nodemailer from "nodemailer";
import AppError from "../errors/AppError.js";
import { UserEntity } from "../entity/UsersEntity.js";
import { RoleEnum } from "../enum/roleEnum.js";
import logger from "./logger.js";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const emailTransport = process.env.EMAIL_URL
  ? nodemailer.createTransport(process.env.EMAIL_URL)
  : process.env.EMAIL_HOST && process.env.EMAIL_PORT
    ? nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === "true",
        tls: { rejectUnauthorized: process.env.NODE_ENV === "production" },
        auth: process.env.EMAIL_USER && process.env.EMAIL_PASSWORD
          ? { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
          : undefined,
      } as nodemailer.TransportOptions)
    : null;

const TWO_FACTOR_CODE_LENGTH = 6;
const TWO_FACTOR_CODE_TTL_MINUTES = 10;
const TWO_FACTOR_CHALLENGE_TTL = "15m";
const TRUSTED_DEVICE_TTL = "180d";

export function requiresTwoFactor(user: UserEntity) {
  if (process.env.NODE_ENV === "development" && user.rights.includes(RoleEnum.ADMIN)) {
    return false;
  }

  const mandatoryRoles = [RoleEnum.ADMIN, RoleEnum.HUNT_MANAGER, RoleEnum.CULTURAL_CENTER_MANAGER];
  return user.isSecure || user.rights.some((right) => mandatoryRoles.includes(right as RoleEnum));
}

export function generateTwoFactorCode() {
  return randomInt(100000, 1000000);
}

export async function createTwoFactorChallengeToken(user: UserEntity) {
  return new SignJWT({
    userId: user.id,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(TWO_FACTOR_CHALLENGE_TTL)
    .sign(secret);
}

export async function resolveTwoFactorChallengeToken(challengeToken: string) {
  const { payload } = await jwtVerify(challengeToken, secret);

  if (typeof payload.userId !== "string") {
    throw new AppError({
      userMessage: "Jeton de double authentification invalide",
      statusCode: 401,
    });
  }

  return payload.userId;
}

export function generateTwoFactorExpiryDate() {
  return new Date(Date.now() + TWO_FACTOR_CODE_TTL_MINUTES * 60 * 1000);
}

export async function sendTwoFactorCodeEmail(email: string, code: number) {
  if (!emailTransport) {
    throw new AppError({
      userMessage: "Le service d'envoi d'email n'est pas configuré",
      statusCode: 503,
    });
  }

  const from = process.env.EMAIL_FROM ?? (process.env.EMAIL_DOMAIN ? `Lootopia <no-reply@${process.env.EMAIL_DOMAIN}>` : "Lootopia <no-reply@localhost>");

  logger.info("Sending two-factor code email", {
    email,
    code
  });
  console.log("Message sent:", from);
  const info = await emailTransport.sendMail({
    from,
    to: email,
    subject: "Votre code de connexion Lootopia",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
        <h2>Votre code de connexion</h2>
        <p>Voici votre code à usage unique pour finaliser la connexion :</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px;">${String(code).padStart(TWO_FACTOR_CODE_LENGTH, "0")}</p>
        <p>Ce code expire dans 10 minutes.</p>
      </div>
    `,
  });

  console.log("Message sent:", info.messageId);
}

export async function createTrustedDeviceToken(userId: string) {
  return new SignJWT({
    userId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(TRUSTED_DEVICE_TTL)
    .sign(secret);
}

export async function resolveTrustedDeviceToken(trustedDeviceToken: string) {
  const { payload } = await jwtVerify(trustedDeviceToken, secret);

  if (typeof payload.userId !== "string") {
    throw new AppError({
      userMessage: "Jeton d'appareil de confiance invalide",
      statusCode: 401,
    });
  }

  return payload.userId;
}