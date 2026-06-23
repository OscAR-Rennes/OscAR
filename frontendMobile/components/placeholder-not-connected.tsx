import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { theme } from '../constants/theme';
import { PlaceholderNotConnectedProps } from '../common/dto/IPlaceHolderNotConnectedProps';
import { getIconUri, IconName } from '../app/icon-mapping';

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