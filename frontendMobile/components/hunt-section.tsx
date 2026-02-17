import React from 'react';
import { View, Text } from 'react-native';
import { theme, globalStyles } from '../constants/theme';
import PlaceholderNotConnected from './placeholder-not-connected';
import { useRouter } from 'expo-router';
import { SvgUri } from 'react-native-svg';
import { getIconUri, IconName } from '../app/icon-mapping';
import { HuntSectionProps } from '../common/dto/IHuntSectionProps';

const HuntSection: React.FC<HuntSectionProps> = ({ title, icon, iconColor, placeholderIcon, placeholderMessage, buttonText, isAuthenticated, authMessage }) => {
    const router = useRouter();

    return (
        <View style={{ flexDirection: 'column', marginBottom: theme.SPACING.medium }}>
            <View style={{ flexDirection: 'row', marginBottom: theme.SPACING.medium, alignItems: 'center' }}>
                <SvgUri uri={getIconUri(icon)} width={25} height={25} color={iconColor} />
                <Text style={{ ...globalStyles.subtitle, fontSize: theme.FONT_SIZES.text, marginLeft: theme.SPACING.small }}>{title}</Text>
            </View>
            {isAuthenticated ? (
                <Text style={{ color: theme.COLORS.textSecondary }}>{authMessage}</Text>
            ) : (
                <PlaceholderNotConnected
                    icon={placeholderIcon as any}
                    message={placeholderMessage}
                    buttonText={buttonText}
                    onPress={() => router.push('/connection')}
                />
            )}
        </View>
    );
};

export default HuntSection;
