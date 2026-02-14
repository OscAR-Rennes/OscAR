import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';
import { useLocalSearchParams } from 'expo-router';
import HeaderNavbar from '@/components/ui/header-navbar';
import BottomNavbar from '@/components/ui/bottom-navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HuntList from '@/components/hunt-cc';
import data from '@/assets/data.json';
import { useLanguage } from '../context/LanguageContext';
import { Asset } from 'expo-asset';
import { SvgUri } from 'react-native-svg';

// Icon mapping
const ICONS = {
    "target.svg": require('../assets/icon/target-larger.svg'),
    "loyalty-points.svg": require('../assets/icon/loyalty-points-larger.svg'),
} as const;

// Define the type for the keys of ICONS
type IconName = keyof typeof ICONS;

// Function to get the URI of the SVG icon
function getIconUri(iconName: IconName): string {
    const iconSource = ICONS[iconName];
    if (!iconSource) {
        console.error(`Icon "${iconName}" not found in ICONS mapping.`);
        return '';
    }
    return Asset.fromModule(iconSource).uri || '';
}

const CulturalCenterScreen: React.FC = () => {
    const router = useRouter();
    const { name, description, image, id } = useLocalSearchParams();
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language];

    // Handle cases where parameters might be arrays (if passed multiple times) or undefined
    const imageUrl = Array.isArray(image) ? image[0] : image;
    const centerName = Array.isArray(name) ? name[0] : name;
    const centerDescription = Array.isArray(description) ? description[0] : description;
    const centerId = Array.isArray(id) ? id[0] : id;

    // Fetch hunts related to the cultural center
    const hunts = data.hunts
        .filter(hunt => hunt.cultural_center_id === centerId)
        .map(hunt => {
            const difficulty = data.difficulty.find(d => d.id === hunt.difficulty_id);
            const difficultyName = difficulty ? difficulty.name.toLowerCase() : 'textSecondary';
            const difficultyColor = theme.COLORS[difficultyName as keyof typeof theme.COLORS] || theme.COLORS.textSecondary;

            // Count the number of steps for the hunt
            const stepsCount = data.steps.filter(step => step.hunt_id === hunt.id).length;

            return {
                title: hunt.title,
                difficulty: difficulty ? difficulty.name : texts.unknown,
                difficultyColor: difficultyColor,
                steps: stepsCount, // Counted steps
                points: hunt.points,
            };
        });

    // State for active button
    const [activeButton, setActiveButton] = useState<'chasses' | 'classement'>('chasses');
    const slideAnim = useRef(new Animated.Value(0)).current;

    // Handle button press
    const handleButtonPress = (button: 'chasses' | 'classement') => {
        Animated.timing(slideAnim, {
            toValue: button === 'chasses' ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();

        setActiveButton(button);
    };

    // Interpolations for sliding animation
    const translateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 165],
    });

    // Verify that all parameters are present
    if (!centerName || !centerDescription || !imageUrl) {
        return <Text style={{ color: theme.COLORS.textPrimary, textAlign: 'center', marginTop: theme.SPACING.large }}>{texts.missingInfo}</Text>;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.background }}>
            <HeaderNavbar/>
            <ScrollView style={{ flex: 1, padding: theme.SPACING.large }}>
                {/* Back Button */}
                <TouchableOpacity style={[{ flexDirection: 'row', gap: theme.SPACING.medium, justifyContent: 'flex-start', marginBottom: theme.SPACING.large }]} onPress={() => router.push('/')} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={24} color={theme.COLORS.icon} />
                    <Text style={[{ color: theme.COLORS.icon, fontWeight: '500', fontSize: 20 }]}>{texts.backToMenu}</Text>
                </TouchableOpacity>

                <Image
                    source={{ uri: 'https://picsum.photos/800/1200' }}
                    style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: theme.SPACING.medium }}
                />
                <Text style={{ fontSize: theme.FONT_SIZES.title, fontWeight: 'bold', marginBottom: theme.SPACING.small, color: theme.COLORS.textPrimary }}>
                    {centerName}
                </Text>
                <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary, marginBottom: theme.SPACING.medium }}>
                    {centerDescription}
                </Text>

                {/* Double Button */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: theme.SPACING.medium, shadowColor: theme.COLORS.icon, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.15, shadowRadius: 5,}}>
                    <View style={{ flexDirection: 'row', backgroundColor: theme.COLORS.background, borderRadius: 18, padding: 5 }}>
                        <Animated.View
                            style={{
                                position: 'absolute',
                                top: 5,
                                left: 5,
                                width: '50%',
                                height: '100%',
                                borderRadius: 15,
                                transform: [{ translateX }],
                            }}
                        >
                            <LinearGradient
                                colors={[theme.COLORS.primary, theme.COLORS.secondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ flex: 1, borderRadius: 15 }}
                            />
                        </Animated.View>
                        <TouchableOpacity
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}
                            onPress={() => handleButtonPress('chasses')}
                            activeOpacity={1}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small }}>
                                <SvgUri uri={getIconUri("target.svg")} width={25} height={25} color={activeButton === 'chasses' ? theme.COLORS.background : theme.COLORS.textPrimary} />
                                <Animated.Text
                                    style={{
                                        color: activeButton === 'chasses' ? theme.COLORS.background : theme.COLORS.textPrimary, // Blanc pour actif, noir pour inactif
                                        fontWeight: 'bold',
                                        fontSize: 17,
                                    }}
                                >
                                    {texts.hunts}
                                </Animated.Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}
                            onPress={() => handleButtonPress('classement')}
                            activeOpacity={1}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small }}>
                                <SvgUri uri={getIconUri("loyalty-points.svg")} width={33} height={33} color={activeButton === 'classement' ? theme.COLORS.background : theme.COLORS.textPrimary} />
                                <Animated.Text
                                    style={{
                                        color: activeButton === 'classement' ? theme.COLORS.background : theme.COLORS.textPrimary, // Blanc pour actif, noir pour inactif
                                        fontWeight: 'bold',
                                        fontSize: 17,
                                    }}
                                >
                                    {texts.leaderboard}
                                </Animated.Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Section Content */}
                {activeButton === 'chasses' ? (
                    hunts.length > 0 ? (
                        <HuntList hunts={hunts} />
                    ) : (
                        <Text style={{ color: theme.COLORS.textSecondary, fontSize: theme.FONT_SIZES.text, textAlign: 'center', marginTop: theme.SPACING.large }}>
                            {texts.noHunts}
                        </Text>
                    )
                ) : (
                    <Text style={{ color: theme.COLORS.textPrimary, fontSize: theme.FONT_SIZES.text }}>{texts.centerLeaderboard}</Text>
                )}
            </ScrollView>
            <BottomNavbar/>
        </SafeAreaView>
    );
};

const STATIC_TEXTS = {
    fr: {
        backToMenu: 'Retour au menu',
        missingInfo: 'Les informations du centre culturel sont manquantes.',
        hunts: 'Chasses',
        leaderboard: 'Classement',
        noHunts: 'Aucune chasse disponible pour ce centre culturel.',
        centerLeaderboard: 'Classement du centre à venir',
        unknown: 'Inconnu',
    },
    en: {
        backToMenu: 'Back to menu',
        missingInfo: 'Cultural center information is missing.',
        hunts: 'Hunts',
        leaderboard: 'Leaderboard',
        noHunts: 'No hunts available for this cultural center.',
        centerLeaderboard: 'Center leaderboard coming soon',
        unknown: 'Unknown',
    },
};

export default CulturalCenterScreen;