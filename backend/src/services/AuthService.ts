import { AuthRequestDTO } from "../common-lib/dto/auth/AuthRequestDTO.js";
import { AuthLoginResponseDTO } from "../common-lib/dto/auth/AuthLoginResponseDTO.js";
import { AuthTwoFactorResendRequestDTO } from "../common-lib/dto/auth/AuthTwoFactorResendRequestDTO.js";
import { AuthTwoFactorVerifyRequestDTO } from "../common-lib/dto/auth/AuthTwoFactorVerifyRequestDTO.js";

export interface AuthService {
  connectUser(userData: AuthRequestDTO): Promise<AuthLoginResponseDTO>;
  verifyTwoFactorCode(data: AuthTwoFactorVerifyRequestDTO): Promise<AuthLoginResponseDTO>;
  resendTwoFactorCode(data: AuthTwoFactorResendRequestDTO): Promise<Omit<AuthLoginResponseDTO, "token">>;
}