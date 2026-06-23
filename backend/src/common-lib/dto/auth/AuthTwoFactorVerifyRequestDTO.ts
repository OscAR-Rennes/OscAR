export interface AuthTwoFactorVerifyRequestDTO {
  challengeToken: string;
  code: string;
  trustedDeviceToken?: string;
}