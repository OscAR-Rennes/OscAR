import { UserRepository } from "../../common-lib/repositories/UsersRepository.js";
import { AddressRepository } from "../../common-lib/repositories/AddressRepository.js";
import { CulturalCenterRepository } from "../../common-lib/repositories/CulturalCenterRepository.js";
import { userMapper } from "../../mapper/UsersMapper.js";
import { NewUserRequestDTO } from "../../common-lib/dto/users/NewUserRequestDTO.js";
import AppError from "../../common-lib/errors/AppError.js";
import { RoleEnum } from "../../common-lib/enum/roleEnum.js";
import { UsersService } from "../UsersService.js";
import { SwitchStatusUsersRequestDTO } from "../../common-lib/dto/users/SwitchStatusUsersRequestDTO.js";
import { prisma } from "../../common-lib/config/prismaClient.js";

export class UsersServiceImpl implements UsersService {

  private userRepository: UserRepository
  private addressRepository: AddressRepository
  private culturalCenterRepository: CulturalCenterRepository

  constructor() {
    this.userRepository = new UserRepository();
    this.addressRepository = new AddressRepository();
    this.culturalCenterRepository = new CulturalCenterRepository();
  }

  async createUserWeb(userData: NewUserRequestDTO) {
    return prisma.$transaction(async (tx: any) => {
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

        const culturalCenter = await this.culturalCenterRepository.create(
          { ...userData.newCulturalCenter, address_id: address.id},
          tx
        );
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
      return userMapper.toDTONewUser(newUser);
    }).catch((error: any) => {
      if (error instanceof AppError) throw error;

      if (error.code === "P2002") {
        throw new AppError({
          userMessage: "Conflit de contrainte d'unicité",
          statusCode: 409,
        });
      }

      throw new AppError({
        userMessage: "Erreur lors de la création de l'utilisateur",
        statusCode: 500,
      });
    });
  }

  async getAllUsers() {
    try {
      const users = await this.userRepository.findAll();
      return users.map(userMapper.toLightDTO);
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

  async getAllUsersByCulturalCenter(culturalcenter_id: string) {
    try {
      const users = await this.userRepository.findAllByCulturalCenter(culturalcenter_id);
      return users.map(userMapper.toLightDTO);
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
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        userMessage: "Erreur lors du changement de statut des utilisateurs",
        statusCode: 500,
      });
    }
  }
}
