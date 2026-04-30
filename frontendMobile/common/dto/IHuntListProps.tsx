import { LightHuntDto } from './ILightHunt';

export interface HuntListProps {
    hunts: LightHuntDto[];
    culturalCenterId?: string;
}