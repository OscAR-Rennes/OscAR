import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { theme, globalStyles } from '../constants/theme';
import PlaceholderNotConnected from './placeholder-not-connected';
import { useRouter } from 'expo-router';
import { SvgUri } from 'react-native-svg';
import { getIconUri } from '../app/icon-mapping';
import { HuntSectionProps } from '../common/dto/IHuntSectionProps';

const HuntSection: React.FC<HuntSectionProps> = ({ title, icon, iconColor, placeholderIcon, placeholderMessage, buttonText, isAuthenticated, authMessage, hunts = [], isLoading = false, onHuntPress }) => {
    const router = useRouter();

    return (
        <View style={{ flexDirection: 'column', marginBottom: theme.SPACING.medium }}>
            <View style={{ flexDirection: 'row', marginBottom: theme.SPACING.medium, alignItems: 'center' }}>
                <SvgUri uri={getIconUri(icon)} width={25} height={25} color={iconColor} />
                <Text style={{ ...globalStyles.subtitle, fontSize: theme.FONT_SIZES.text, marginLeft: theme.SPACING.small }}>{title}</Text>
            </View>
            {isAuthenticated ? (
                isLoading ? (
                    <Text style={{ color: theme.COLORS.textSecondary }}>{authMessage}</Text>
                ) : hunts.length > 0 ? (
                    <View style={{ gap: theme.SPACING.small }}>
                        {hunts.map((hunt) => (
                            <TouchableOpacity
                                key={hunt.id}
                                activeOpacity={onHuntPress ? 0.75 : 1}
                                onPress={() => onHuntPress?.(hunt)}
                                style={{
                                    backgroundColor: theme.COLORS.background,
                                    borderRadius: theme.SPACING.small,
                                    paddingHorizontal: theme.SPACING.medium,
                                    paddingVertical: theme.SPACING.medium,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.12,
                                    shadowRadius: 3,
                                    elevation: 2,
                                }}
                            >
                                <Text style={[globalStyles.text, { fontWeight: '700' }]}>{hunt.title}</Text>
                                {typeof hunt.currentIndex === 'number' && (
                                    <Text style={[globalStyles.smallText, { color: theme.COLORS.textSecondary }]}>Index {hunt.currentIndex}</Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <Text style={{ color: theme.COLORS.textSecondary }}>{authMessage}</Text>
                )
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
