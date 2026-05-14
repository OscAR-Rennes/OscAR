import { UserRepository } from "../../common-lib/repositories/UsersRepository.js";
import { AddressRepository } from "../../common-lib/repositories/AddressRepository.js";
import { CulturalCenterRepository } from "../../common-lib/repositories/CulturalCenterRepository.js";
import { userMapper } from "../../mapper/UsersMapper.js";
import { NewUserRequestDTO } from "../../common-lib/dto/users/NewUserRequestDTO.js";
import AppError from "../../common-lib/errors/AppError.js";
import { RoleEnum } from "../../common-lib/enum/roleEnum.js";
import { UsersService } from "../UsersService.js";
import { PaginationParamsDTO } from "../../common-lib/dto/common/PaginationParamsDTO.js";
import { PaginatedResponseDTO } from "../../common-lib/dto/common/PaginatedResponseDTO.js";
import { prisma } from "../../common-lib/config/prismaClient.js";
import logger from "../../common-lib/utils/logger.js";
import { paginateArray } from "../../common-lib/utils/pagination.js";
import { LightUserDTO } from "../../common-lib/dto/users/LightUserDTO.js";
import { AuthResponseDTO } from "../../common-lib/dto/auth/AuthResponseDTO.js";
import { FullUserDTO } from "../../common-lib/dto/users/FullUserDTO.js";
import { createTwoFactorChallengeToken, generateTwoFactorCode, generateTwoFactorExpiryDate, sendTwoFactorCodeEmail } from "../../common-lib/utils/twoFactor.js";
import { NewUserResponseDTO } from "../../common-lib/dto/users/NewUserResponseDTO.js";
import { LeaderboardUserDTO } from "../../common-lib/dto/users/LeaderboardUserDTO.js";

export class UsersServiceImpl implements UsersService {

  private userRepository: UserRepository
  private addressRepository: AddressRepository
  private culturalCenterRepository: CulturalCenterRepository

  constructor() {
    this.userRepository = new UserRepository();
    this.addressRepository = new AddressRepository();
    this.culturalCenterRepository = new CulturalCenterRepository();
  }

  async createUserWeb(userData: NewUserRequestDTO): Promise<NewUserResponseDTO> {
    let emailCode: number | undefined;
    const result = await prisma.$transaction(async (tx: any) => {
      let userToCreate = { ...userData };

      if (userData.isNewCulturalCenter) {

        if (!userData.newCulturalCenter) {
          throw new AppError({
            userMessage: "Les informations du nouveau centre culturel sont requises",
            statusCode: 400,
          });
        }

        if (!userData.newCulturalCenter.address) {
          throw new AppError({
            userMessage: "L'adresse du nouveau centre culturel est requise",
            statusCode: 400,
          });
        }
        const address = await this.addressRepository.create(userData.newCulturalCenter.address, tx);
        logger.info("Address created for new cultural center", { addressId: address.id });
        const culturalCenter = await this.culturalCenterRepository.create(
          { ...userData.newCulturalCenter, address_id: address.id},
          tx
        );
        logger.info(`Cultural center created`, { culturalCenterId: culturalCenter.id });
        userToCreate = {
          ...userToCreate,
          rights: [RoleEnum.CULTURAL_CENTER_MANAGER],
          id_cultural_center: culturalCenter.id,
        };
      }

      if (!userData.isNewCulturalCenter) {
        if (!userData.id_cultural_center) {
          throw new AppError({
            userMessage: "L'utilisateur doit être associé à un centre culturel existant ou en créer un nouveau",
            statusCode: 400,
          });
        }
        userToCreate = {
          ...userData,
          rights: [RoleEnum.HUNT_MANAGER],
        };
      }
      const newUser = await this.userRepository.create(userToCreate, tx);
      const code = generateTwoFactorCode();
      const twoFactorExpiresAt = generateTwoFactorExpiryDate();
      emailCode = code;
      const challengeToken = await createTwoFactorChallengeToken(newUser as any);

      await tx.security_code.create({
        data: {
          user_id: newUser.id,
          code,
          validity_period: twoFactorExpiresAt,
        },
      });

      return {
        ...userMapper.toDTONewUser(newUser),
        requiresTwoFactor: true,
        challengeToken,
        twoFactorExpiresAt: twoFactorExpiresAt.toISOString(),
      };
    });

    try {
      if (typeof emailCode !== "number") {
        throw new AppError({
          userMessage: "Code de double authentification introuvable",
          statusCode: 500,
        });
      }

      logger.info("Registration two-factor code sent", {
        route: "/users/web",
        email: userData.email,
        userId: result.id,
      });
      await sendTwoFactorCodeEmail(userData.email, emailCode);
      return result;
    } catch (error: any) {
      try {
        await this.userRepository.deleteById(result.id);
      } catch (deleteError) {
        logger.error("Failed to rollback user after registration email error", {
          userId: result.id,
          errorMessage: deleteError instanceof Error ? deleteError.message : deleteError,
        });
      }
      console.error(error)
      throw new AppError({
        userMessage: "Impossible d'envoyer le code de double authentification",
        statusCode: 503,
      });
    }
  }

  async createUserMobile(userData: NewUserRequestDTO) {
    try {
      let userToCreate = { ...userData };
      userToCreate = {
          ...userToCreate,
          rights: [RoleEnum.USER]
        };
      const newUser = await this.userRepository.create(userToCreate);
      const code = generateTwoFactorCode();
      const twoFactorExpiresAt = generateTwoFactorExpiryDate();
      const challengeToken = await createTwoFactorChallengeToken(newUser as any);

      await prisma.security_code.create({
        data: {
          user_id: newUser.id,
          code,
          validity_period: twoFactorExpiresAt,
        },
      });

      try {
        logger.info("Registration two-factor code sent", {
          route: "/users/mobile",
          email: newUser.email,
          userId: newUser.id,
          code: code
        });
        await sendTwoFactorCodeEmail(newUser.email, code);
      } catch (emailError) {
        await this.userRepository.deleteById(newUser.id);
        throw emailError;
      }

      return {
        ...userMapper.toDTONewUser(newUser),
        requiresTwoFactor: true,
        challengeToken,
        twoFactorExpiresAt: twoFactorExpiresAt.toISOString(),
      };
    } catch(error: any) {
      if (error instanceof AppError) throw error;

      if (error.code === "P2002") {
        let field = error.meta?.target?.[0];

        if (!field && typeof error.message === "string") {
          const match = error.message.match(/\(`(.+)`\)/);
          if (match) field = match[1];
        }

        field = field || "un champ unique";
        console.log(error)
        throw new AppError({
          userMessage: `Conflit d'unicité sur: ${field}`,
          statusCode: 409,
        });
      }
      throw new AppError({
        userMessage: "Erreur lors de la création de l'utilisateur",
        statusCode: 500,
      });
    }
  }

  async getAllUsers(pagination: PaginationParamsDTO, search: string, sort: string): Promise<PaginatedResponseDTO<LightUserDTO>> {
    try {
      const users = await this.userRepository.findAll();
      let items = users.map(userMapper.toLightDTO);

      if (search) {
          items = items.filter(u =>
              u.username?.toLowerCase().includes(search.toLowerCase()) ||
              u.email?.toLowerCase().includes(search.toLowerCase())
          );
      }

      items = items.sort((a, b) =>
          sort === "desc"
              ? b.username.localeCompare(a.username)
              : a.username.localeCompare(b.username)
      );

      return paginateArray(items, pagination);
    } catch (error:any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        userMessage: 'Erreur lors de la récupération des utilisateurs',
        statusCode: 500,
      });
    }
  }

  async getAllUsersByCulturalCenter(culturalcenter_id: string, pagination: PaginationParamsDTO, search: string, sort: string): Promise<PaginatedResponseDTO<LightUserDTO>> {
    try {
      const users = await this.userRepository.findAllByCulturalCenter(culturalcenter_id);
      let items = users.map(userMapper.toLightDTO);

      if (search) {
          items = items.filter(u =>
              u.username?.toLowerCase().includes(search.toLowerCase()) ||
              u.email?.toLowerCase().includes(search.toLowerCase())
          );
      }

      items = items.sort((a, b) =>
          sort === "desc"
              ? b.username.localeCompare(a.username)
              : a.username.localeCompare(b.username)
      );

      return paginateArray(items, pagination);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        userMessage: 'Erreur lors de la récupération des utilisateurs du centre culturel',
        statusCode: 500,
      });
    }

  }

  async switchUsersStatus(ids: string[]): Promise<boolean> {
    try {
      const updatedUsers = await this.userRepository.switchUsersStatus(ids);
      if (updatedUsers.length === 0) {
        throw new AppError({
          userMessage: "Aucun utilisateur trouvé pour les IDs fournis",
          statusCode: 404,
        });
      }

      return true;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        userMessage: "Erreur lors du changement de statut des utilisateurs",
        statusCode: 500,
      });
    }
  }

  async getById(id: string, user: AuthResponseDTO): Promise<FullUserDTO> {
    try {

      if (user.rights.includes(RoleEnum.USER) && user.id != id) {
        throw new AppError({
          userMessage: "Consultation de l'utilisateur non autorisé",
          statusCode: 403,
        });
      }

      const userData = await this.userRepository.getById(id)

      return userMapper.toFullDto(userData)

    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        userMessage: "Erreur lors du chargement de l'utilisateur",
        statusCode: 500,
      });
    }
  }

  async getGlobalLeaderboard(limit: number): Promise<LeaderboardUserDTO[]> {
    try {
      const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(1000, Math.floor(limit))) : 5;
      const users = await this.userRepository.findGlobalLeaderboard(safeLimit);

      return users.map((user) => ({
        id: user.id,
        username: user.username,
        points: user.points,
      }));
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        userMessage: "Erreur lors de la récupération du classement global",
        statusCode: 500,
      });
    }
  }
}
