export interface AuthRequestDTO {
  email: string;
  password: string;
  trustedDeviceToken?: string;
}