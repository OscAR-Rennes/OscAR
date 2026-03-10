import { hunts } from "@prisma/client";
import { AuthResponseDTO } from "../dto/auth/AuthResponseDTO.js";
import { RoleEnum } from "../enum/roleEnum.js";
import AppError from "../errors/AppError.js";
import { UserRepository } from "../repositories/UsersRepository.js";

export async function assertUserCanAccessHunt(
  user: AuthResponseDTO,
  hunt: hunts,
  userRepository: UserRepository
): Promise<void> {

  if (user.rights.includes(RoleEnum.ADMIN)) {
    return;
  }

  if (user.rights.includes(RoleEnum.CULTURAL_CENTER_MANAGER)) {
    const creator = await userRepository.findById(hunt.creator_id);

    if (creator?.id_cultural_center === user.id_cultural_center) {
      return;
    }
  }

  if (
    user.rights.includes(RoleEnum.HUNT_MANAGER) &&
    hunt.creator_id === user.id
  ) {
    return;
  }

  throw new AppError({
    userMessage: "Vous n'avez pas les droits pour accéder à cette chasse",
    statusCode: 403,
  });
}