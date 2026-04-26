import { IconName } from '../../app/icon-mapping';

export interface HuntSectionItem {
    id: string;
    title: string;
    currentIndex?: number;
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
    hunts?: HuntSectionItem[];
    isLoading?: boolean;
    onHuntPress?: (hunt: HuntSectionItem) => void;
}