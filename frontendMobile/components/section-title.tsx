import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { theme } from '../constants/theme';
import { SectionTitleProps } from '../common/dto/ISectionTitleProps';

const SectionTitle: React.FC<SectionTitleProps> = ({ title, iconUri, iconColor }) => {
    return (
        <View style={[{flexDirection: 'row', marginBottom: theme.SPACING.large, width: '100%', alignItems: 'center',}]}>
            <SvgUri uri={iconUri} width={30} height={30} color={iconColor} />
            <Text style={[{marginLeft: theme.SPACING.small, fontSize: theme.FONT_SIZES.subtitle, fontWeight: '700', color: theme.COLORS.textPrimary,}]}>{title}</Text>
        </View>
    );
};

export default SectionTitle;