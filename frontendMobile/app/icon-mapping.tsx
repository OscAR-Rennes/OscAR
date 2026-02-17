import { Asset } from 'expo-asset';

// Icon mapping
export const ICONS = {
    "target.svg": require('../assets/icon/target.svg'),
    "loyalty-points.svg": require('../assets/icon/loyalty-points.svg'),
    "star.svg": require('../assets/icon/star.svg'),
    "camera.svg": require('../assets/icon/camera.svg'),
    "step.svg": require('../assets/icon/step.svg'),
    "play-button.svg": require('../assets/icon/play-button.svg'),
    "lock.svg": require('../assets/icon/lock.svg'),
    "mail.svg": require('../assets/icon/mail.svg'),
    "target-larger.svg": require('../assets/icon/target-larger.svg'),
    "check.svg": require('../assets/icon/check.svg'),
    "globe.svg": require('../assets/icon/globe.svg'),
    "image-placeholder.svg": require('../assets/icon/image-placeholder.svg'),
    "logout.svg": require('../assets/icon/logout.svg'),
    "trophy.svg": require('../assets/icon/trophy.svg'),
    "pin.svg": require('../assets/icon/pin.svg'),
    "group.svg": require('../assets/icon/group.svg'),
    "envelope.svg": require('../assets/icon/envelope.svg'),
    "plus.svg": require('../assets/icon/plus.svg'),
    "user.svg": require('../assets/icon/user.svg'),
    "map.svg": require('../assets/icon/map.svg'),
    "send.svg": require('../assets/icon/send.svg'),
    "lock-larger.svg": require('../assets/icon/lock-larger.svg'),
} as const;

// Define the type for the keys of ICONS
export type IconName = keyof typeof ICONS;

// Function to get the URI of the SVG icon
export function getIconUri(iconName: IconName): string {
    const iconSource = ICONS[iconName];
    if (!iconSource) {
        console.error(`Icon "${iconName}" not found in ICONS mapping.`);
        return '';
    }
    return Asset.fromModule(iconSource).uri || '';
}