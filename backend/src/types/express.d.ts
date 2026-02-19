import { AuthResponseDTO } from "../common-lib/dto/auth/AuthResponseDTO.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthResponseDTO;
    }
  }
}

export {};
