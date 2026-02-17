import { IconName } from '../../app/icon-mapping';

export interface HuntSectionProps {
    title: string;
    icon: IconName;
    iconColor: string;
    placeholderIcon: string;
    placeholderMessage: string;
    buttonText: string;
    isAuthenticated: boolean;
    authMessage: string;
}