import { IconName } from '../../components/placeholder-not-connected';

export interface PlaceholderNotConnectedProps {
    icon: IconName;
    message: string;
    buttonText: string;
    onPress: () => void;
}