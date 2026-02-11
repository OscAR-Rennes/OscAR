import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { theme } from '../constants/theme';

interface CulturalCenter {
    id: string;
    name: string;
    description: string;
    picture_path: string;
    hunts: Array<{
        id: string;
        name: string;
        difficulty: string;
        steps: number;
        points: number;
    }>;
}

const CulturalCenterScreen: React.FC = () => {
    const route = useRoute();
    const { culturalCenter } = route.params as { culturalCenter: CulturalCenter };

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: culturalCenter.picture_path || 'https://picsum.photos/800/1200' }}
                style={styles.image}
            />
            <Text style={styles.title}>{culturalCenter.name}</Text>
            <Text style={styles.description}>{culturalCenter.description}</Text>

            <View style={styles.huntsContainer}>
                <Text style={styles.huntsTitle}>Chasses disponibles :</Text>
                {culturalCenter.hunts.map((hunt) => (
                    <View key={hunt.id} style={styles.huntCard}>
                        <Text style={styles.huntName}>{hunt.name}</Text>
                        <Text style={styles.huntDetails}>Difficulté : {hunt.difficulty}</Text>
                        <Text style={styles.huntDetails}>Étapes : {hunt.steps}</Text>
                        <Text style={styles.huntDetails}>Points : {hunt.points}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.COLORS.background,
        padding: theme.SPACING.large,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: theme.SPACING.medium,
    },
    title: {
        fontSize: theme.FONT_SIZES.title,
        fontWeight: 'bold',
        marginBottom: theme.SPACING.small,
        color: theme.COLORS.textPrimary,
    },
    description: {
        fontSize: theme.FONT_SIZES.text,
        color: theme.COLORS.textSecondary,
        marginBottom: theme.SPACING.medium,
    },
    huntsContainer: {
        marginTop: theme.SPACING.large,
    },
    huntsTitle: {
        fontSize: theme.FONT_SIZES.subtitle,
        fontWeight: 'bold',
        marginBottom: theme.SPACING.medium,
        color: theme.COLORS.textPrimary,
    },
    huntCard: {
        backgroundColor: 'red',
        padding: theme.SPACING.medium,
        borderRadius: 10,
        marginBottom: theme.SPACING.small,
    },
    huntName: {
        fontSize: theme.FONT_SIZES.text,
        fontWeight: 'bold',
        color: theme.COLORS.textPrimary,
    },
    huntDetails: {
        fontSize: theme.FONT_SIZES.text,
        color: theme.COLORS.textSecondary,
    },
});

export default CulturalCenterScreen;