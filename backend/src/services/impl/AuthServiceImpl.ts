import { AuthService } from "../AuthService.js";
import { UserRepository } from "../../common-lib/repositories/UsersRepository.js";
import { authMapper } from "../../mapper/AuthMapper.js";
import { AuthRequestDTO } from "../../common-lib/dto/auth/AuthRequestDTO.js";
import { AuthLoginResponseDTO } from "../../common-lib/dto/auth/AuthLoginResponseDTO.js";
import { generateToken } from "../../common-lib/security/auth.js";
import bcrypt from "bcrypt";
import AppError from "../../common-lib/errors/AppError.js";
import logger from "../../common-lib/utils/logger.js";
import { RoleEnum } from "../../common-lib/enum/roleEnum.js";
import { createTrustedDeviceToken, createTwoFactorChallengeToken, generateTwoFactorCode, generateTwoFactorExpiryDate, requiresTwoFactor, resolveTrustedDeviceToken, resolveTwoFactorChallengeToken, sendTwoFactorCodeEmail } from "../../common-lib/utils/twoFactor.js";
import { SecurityCodeRepository } from "../../common-lib/repositories/SecurityCodeRepository.js";
import { AuthTwoFactorVerifyRequestDTO } from "../../common-lib/dto/auth/AuthTwoFactorVerifyRequestDTO.js";
import { AuthTwoFactorResendRequestDTO } from "../../common-lib/dto/auth/AuthTwoFactorResendRequestDTO.js";

const userRepository = new UserRepository();
const securityCodeRepository = new SecurityCodeRepository();

export class AuthServiceImpl implements AuthService {

  async connectUser(userData: AuthRequestDTO): Promise<AuthLoginResponseDTO> {

    let user;
    try {
      user = await userRepository.findByCredentials(userData.email);
    } catch (err) {
      logger.error(`Database error during user authentication for email ${userData.email}`, { errorMessage: err instanceof Error ? err.message : err, errorStack: err instanceof Error ? err.stack : undefined});
      throw new AppError({
        userMessage: "Problème de connexion à la base de données",
        statusCode: 503,
      });
    }

    if (!user) {
      throw new AppError({
        userMessage: "Identifiants invalides",
        statusCode: 401,
      });
    }

    const isBasicUser = user.rights.length === 1 && user.rights[0] === RoleEnum.USER;

    if (!isBasicUser && !user.isActive) {
      throw new AppError({
        userMessage: "Compte inactif. Veuillez contacter un administrateur.",
        statusCode: 403,
      });
    }

    const isValid = await bcrypt.compare(userData.password, user.password);
    if (!isValid) {
      throw new AppError({
        userMessage: "Identifiants invalides",
        statusCode: 401,
      });
    }

    if (userData.trustedDeviceToken) {
      try {
        const trustedUserId = await resolveTrustedDeviceToken(userData.trustedDeviceToken);
        if (trustedUserId === user.id) {
          const userDTO = authMapper.toResponseAuthDTO(user);
          const token = await generateToken(userDTO);

          return {
            ...userDTO,
            token,
          };
        }
      } catch (error) {
        logger.info("Trusted device token rejected, falling back to 2FA", { email: userData.email });
      }
    }

    if (requiresTwoFactor(user)) {
      const challenge = await this.createAndSendTwoFactorChallenge(user);

      return {
        ...authMapper.toResponseAuthDTO(user),
        requiresTwoFactor: true,
        challengeToken: challenge.challengeToken,
        twoFactorExpiresAt: challenge.twoFactorExpiresAt.toISOString(),
      };
    }

    const userDTO = authMapper.toResponseAuthDTO(user);
    const token = await generateToken(userDTO);

    return {
      ...userDTO,
      token,
    };
  }

  async verifyTwoFactorCode(data: AuthTwoFactorVerifyRequestDTO): Promise<AuthLoginResponseDTO> {
    const userId = await resolveTwoFactorChallengeToken(data.challengeToken);
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError({
        userMessage: "Utilisateur introuvable",
        statusCode: 404,
      });
    }

    const code = Number(data.code);
    if (!Number.isInteger(code) || code < 100000 || code > 999999) {
      throw new AppError({
        userMessage: "Code invalide",
        statusCode: 400,
      });
    }

    const storedCode = await securityCodeRepository.findValidCode(user.id, code);
    if (!storedCode) {
      throw new AppError({
        userMessage: "Code invalide ou expiré",
        statusCode: 401,
      });
    }

    await securityCodeRepository.deleteByUserId(user.id);

    const trustedDeviceToken = await createTrustedDeviceToken(user.id);

    if (!user.isActive) {
      await userRepository.setActive(user.id, true);
    }

    const userDTO = authMapper.toResponseAuthDTO(user);
    const token = await generateToken(userDTO);

    return {
      ...userDTO,
      token,
      trustedDeviceToken,
    };
  }

  async resendTwoFactorCode(data: AuthTwoFactorResendRequestDTO): Promise<Omit<AuthLoginResponseDTO, "token">> {
    const userId = await resolveTwoFactorChallengeToken(data.challengeToken);
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError({
        userMessage: "Utilisateur introuvable",
        statusCode: 404,
      });
    }

    if (!requiresTwoFactor(user)) {
      throw new AppError({
        userMessage: "La double authentification n'est pas active pour ce compte",
        statusCode: 400,
      });
    }

    const challenge = await this.createAndSendTwoFactorChallenge(user);

    return {
      ...authMapper.toResponseAuthDTO(user),
      requiresTwoFactor: true,
      challengeToken: challenge.challengeToken,
      twoFactorExpiresAt: challenge.twoFactorExpiresAt.toISOString(),
    };
  }

  private async createAndSendTwoFactorChallenge(user: NonNullable<Awaited<ReturnType<typeof userRepository.findById>>>) {
    const challengeToken = await createTwoFactorChallengeToken(user);
    const code = generateTwoFactorCode();
    const twoFactorExpiresAt = generateTwoFactorExpiryDate();

    await securityCodeRepository.deleteByUserId(user.id);
    await securityCodeRepository.createCode(user.id, code, twoFactorExpiresAt);

    try {
      logger.info("Two-factor code sent", {
        email: user.email,
        userId: user.id,
        code
      });
      await sendTwoFactorCodeEmail(user.email, code);
    } catch (error) {
      await securityCodeRepository.deleteByUserId(user.id);
      logger.error(`Failed to send two-factor email for ${user.email}`, {
        errorMessage: error instanceof Error ? error.message : error,
        errorStack: error instanceof Error ? error.stack : undefined,
      });
      throw new AppError({
        userMessage: "Impossible d'envoyer le code de double authentification",
        statusCode: 503,
      });
    }

    return { challengeToken, twoFactorExpiresAt };
  }
}