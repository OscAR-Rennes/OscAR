export interface LightUserDTO {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  rights?: string[];
}