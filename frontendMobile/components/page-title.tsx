import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { PageTitleProps } from '../common/dto/IPageTitleProps';

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
    return (
        <View style={[{paddingVertical: theme.SPACING.large,}]}>
            <Text style={[{ fontSize: theme.FONT_SIZES.subtitle, fontWeight: '800', color: theme.COLORS.textPrimary,}]} >{title}</Text>
        </View>
    );
};

export default PageTitle;