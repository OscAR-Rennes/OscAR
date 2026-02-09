import { UsersService } from "../UsersService.js";
import { UserRepository } from "../../common-lib/repositories/UsersRepository.js";
import { userMapper } from "../../mapper/UsersMapper.js";
import { NewUserRequestDTO } from "../../common-lib/dto/users/NewUserRequestDTO.js";
import AppError from "../../common-lib/errors/AppError.js";
import { AddressRepository } from "../../common-lib/repositories/AddressRepository.js";
import { CulturalCenterRepository } from "../../common-lib/repositories/CulturalCenterRepository.js";
import { pool } from "../../common-lib/config/database.js";
import { RoleEnum } from "../../common-lib/enum/roleEnum.js";
import { SwitchStatusUsersRequestDTO } from "../../common-lib/dto/users/SwitchStatusUsersRequestDTO.js";

const userRepository = new UserRepository();
const culturalCenterRepository = new CulturalCenterRepository();
const addressRepository = new AddressRepository();


export class UsersServiceImpl implements UsersService {

  async getAllUsers() {
    try {
      const users = await userRepository.findAll();
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

  async createUserWeb(userData: NewUserRequestDTO) {
    const client = await pool.connect(); 
    try {
      await client.query('BEGIN');
      let userToCreate = { ...userData };
      if (userData.isNewCulturalCenter) {
        if (!userData.newCulturalCenter) {
          throw new AppError({
            userMessage: 'Les informations du nouveau centre culturel sont requises',
            statusCode: 400,
          });
        };
        const address = await addressRepository.createWithClient(
          client,
          userData.newCulturalCenter.address
        );

        const culturalCenter = await culturalCenterRepository.createWithClient(
          client,
          {
            ...userData.newCulturalCenter,
            address_id: address.id,
          }
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
            userMessage: 'L\'utilisateur doit être associé à un centre culturel existant ou en créer un nouveau',
            statusCode: 400,
          });
        }
        userToCreate = {
          ...userToCreate,
          rights: [RoleEnum.HUNT_MANAGER],
        };
      }
      const newUser = await userRepository.createWithClient(client, userToCreate);
      await client.query('COMMIT');
      return userMapper.toDTONewUser(newUser);
    } catch (error: any) {
      await client.query('ROLLBACK');
      if (error instanceof AppError) {
        throw error;
      }
      if (error.code === '23505') {
        switch (error.constraint) {
          case 'users_email_key':
            throw new AppError({
              userMessage: 'Un utilisateur avec cet email existe déjà',
              statusCode: 409,
            });
          case 'cultural_centers_name_key':
            throw new AppError({
              userMessage: 'Un centre culturel avec ce nom existe déjà',
              statusCode: 409,
            });
          default:
            throw new AppError({
              userMessage: 'Conflit de contrainte d\'unicité',
              statusCode: 409,
            });
        }
      }
      throw new AppError({
        userMessage: 'Erreur lors de la création de l\'utilisateur',
        statusCode: 500,
      });    
    }
  }

  async getAllUsersByCulturalCenter(culturalcenter_id: string) {
    try {
      const users = await userRepository.findAllByCulturalCenter(culturalcenter_id);
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

  async switchUsersStatus(ids: SwitchStatusUsersRequestDTO): Promise<boolean> {
    try {
      console.log(ids)
      const updatedUsers = await userRepository.switchUsersStatus(ids);

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