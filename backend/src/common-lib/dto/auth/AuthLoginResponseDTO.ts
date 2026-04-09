import { AuthResponseDTO } from "./AuthResponseDTO.js";

export interface AuthLoginResponseDTO extends AuthResponseDTO {
  token?: string;
  requiresTwoFactor?: boolean;
  challengeToken?: string;
  twoFactorExpiresAt?: string;
  trustedDeviceToken?: string;
}