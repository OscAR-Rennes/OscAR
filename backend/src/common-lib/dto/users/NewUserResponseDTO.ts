export interface NewUserResponseDTO {
  id: string;
  username: string;
  requiresTwoFactor?: boolean;
  challengeToken?: string;
  twoFactorExpiresAt?: string;
}