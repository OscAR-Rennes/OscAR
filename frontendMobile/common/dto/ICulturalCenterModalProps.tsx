export interface CulturalCenterModalProps {
    visible: boolean;
    culturalCenterName: string;
    culturalCenterImage: string;
    culturalCenterDescription: string;
    culturalCenterId: string;
    onClose: () => void;
    onViewCenter: () => void;
}