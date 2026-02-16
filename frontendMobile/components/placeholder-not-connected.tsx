import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { Asset } from 'expo-asset';
import { theme } from '../constants/theme';
import { useRouter } from 'expo-router';
import { PlaceholderNotConnectedProps } from '../common/dto/IPlaceHolderNotConnectedProps';

// Icon mapping
const ICONS = {
    "group.svg": require('../assets/icon/group.svg'),
    "target-larger.svg": require('../assets/icon/target-larger.svg'),
} as const;

// Define the type for the keys of ICONS
export type IconName = keyof typeof ICONS;

// Function to get the URI of the SVG icon
function getIconUri(iconName: IconName): string {
    const iconSource = ICONS[iconName];
    if (!iconSource) {
        console.error(`Icon "${iconName}" not found in ICONS mapping.`);
        return '';
    }
    return Asset.fromModule(iconSource).uri || '';
}

// PlaceholderNotConnected component
const PlaceholderNotConnected: React.FC<PlaceholderNotConnectedProps> = ({ icon, message, buttonText, onPress }) => {
    return (
        <View style={{ borderWidth: 1, borderColor: theme.COLORS.border, borderRadius: 8, paddingVertical: theme.SPACING.large, paddingHorizontal: theme.SPACING.medium, width: '100%', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
            <SvgUri uri={getIconUri(icon)} width={50} height={50} color={"#cccccc"} />
            <Text style={{ marginTop: 10, fontSize: theme.FONT_SIZES.text, color: '#a0a0a0', marginBottom: theme.SPACING.medium, textAlign: 'center' }}>{message}</Text>
            <TouchableOpacity style={[theme.BUTTON_STYLES.default, { width: '100%' }]} onPress={onPress}>
                <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[theme.BUTTON_STYLES.default, { width: '100%', alignItems: 'center' }]}>
                    <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{buttonText}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

export default PlaceholderNotConnected;