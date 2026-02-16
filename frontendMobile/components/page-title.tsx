import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { PageTitleProps } from '../common/dto/IPageTitleProps';

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: theme.SPACING.large,
    },
    title: {
        fontSize: theme.FONT_SIZES.subtitle,
        fontWeight: '800',
        color: theme.COLORS.textPrimary,
    },
});

export default PageTitle;