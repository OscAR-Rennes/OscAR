import React from 'react';
import { View, Text } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { theme } from '../../constants/theme';
import { StatsCardProps } from '../../common/dto/IStatsCardProps';
import { getIconUri } from '../../app/icon-mapping';

const StatsCard: React.FC<StatsCardProps> = ({ icon, value, label, backgroundColor, iconColor, width, height }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', padding: theme.SPACING.medium, backgroundColor, borderRadius: 12, gap: theme.SPACING.small }}>
            <SvgUri uri={getIconUri(icon)} width={width} height={height} color={iconColor} />
            <Text style={{ fontSize: theme.FONT_SIZES.smallText, fontWeight: '800', color: theme.COLORS.textPrimary }}>{value}</Text>
            <Text style={{ fontSize: theme.FONT_SIZES.tinyText, color: theme.COLORS.textSecondary, textAlign: 'center' }}>{label}</Text>
        </View>
    );
};

export default StatsCard;