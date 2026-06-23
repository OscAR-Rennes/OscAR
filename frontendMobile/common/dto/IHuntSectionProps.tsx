import { IconName } from '../../app/icon-mapping';

export interface HuntSectionItem {
    id: string;
    title: string;
    currentIndex?: number;
    totalIndexes?: number;
    completedPoints?: number;
    totalPoints?: number;
    completedSteps?: number;
    totalSteps?: number;
    culturalCenterName?: string;
}

export interface HuntSectionProps {
    title: string;
    icon: IconName;
    iconColor: string;
    placeholderIcon: string;
    placeholderMessage: string;
    buttonText: string;
    isAuthenticated: boolean;
    authMessage: string;
    pointsLabel?: string;
    stepsLabel?: string;
    partLabel?: string;
    hunts?: HuntSectionItem[];
    isLoading?: boolean;
    onHuntPress?: (hunt: HuntSectionItem) => void;
}