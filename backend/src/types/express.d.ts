import { Prisma } from "@prisma/client";
import { AuthResponseDTO } from "../common-lib/dto/auth/AuthResponseDTO.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthResponseDTO;
    }
  }
}

export type HuntWithRelations =
  Prisma.huntsGetPayload<{
    include: {
      users: {
        select: {
          id: true;
          username: true;
          id_cultural_center: true;
        };
      };
      cultural_centers: {
        select: {
          id: true;
          name: true;
        }
      }
      difficulty: {
        select: {
          id: true;
          name: true;
        };
      };
      steps: {
        select: {
          id: true;
          title: true;
        };
      };
    };
  }>;
  
export {};
