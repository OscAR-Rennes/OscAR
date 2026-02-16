import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import HeaderNavbar from '@/components/ui/header-navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNavbar from '@/components/ui/bottom-navbar';
import { globalStyles, theme } from '../constants/theme';
import data from '../assets/data.json';
import { SvgUri } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../context/LanguageContext';
import translations from '../constants/language-en.json';
import translationsFr from '../constants/language-fr.json';
import { Step } from '../common/dto/IStep';
import { getIconUri } from './icon-mapping';

const HuntDetailsScreen: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language];

    // Handle cases where parameters might be undefined
    const huntId = Array.isArray(id) ? id[0] : id;

    const [steps, setSteps] = useState<Step[]>([]); // Explicitly define the type for steps

    useEffect(() => {
        if (huntId) {
            // Filter steps related to the hunt ID
            const relatedSteps = data.steps.filter((step: Step) => step.hunt_id === huntId);
            setSteps(relatedSteps);
        }
    }, [huntId]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.background }}>
            <HeaderNavbar />
            <ScrollView contentContainerStyle={{ paddingHorizontal: theme.SPACING.large, paddingTop: theme.SPACING.medium, paddingBottom: theme.SPACING.xLarge }}>
                {/* Back Button */}
                <View style={{ alignItems: 'flex-start', marginBottom: theme.SPACING.small }}>
                    <TouchableOpacity style={[theme.BUTTON_STYLES.default, { flexDirection: 'row', gap: theme.SPACING.medium, justifyContent: 'flex-start' }]} onPress={() => router.push('/')}>
                        <Ionicons name="arrow-back" size={24} color={theme.COLORS.icon} />
                        <Text style={[globalStyles.text, { color: theme.COLORS.icon, fontWeight: '500', fontSize: 20 }]}>{texts.backToMenu}</Text>
                    </TouchableOpacity>
                </View>

                {/* Steps List */}
                <View style={{ marginTop: theme.SPACING.small, backgroundColor: theme.COLORS.background, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5, padding: theme.SPACING.medium, borderRadius: theme.SPACING.medium }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small, marginBottom: theme.SPACING.medium }}>
                        <SvgUri uri={getIconUri("step.svg")} width={37} height={37} color={theme.COLORS.tertiary} />
                        <Text style={[globalStyles.subtitle]}>{texts.stepsTitle} ({steps.length})</Text>
                    </View>
                    {steps.length > 0 ? (
                        steps.map((step, index) => (
                            <View key={index} style={{ flexDirection: 'row', backgroundColor: theme.COLORS.background, padding: theme.SPACING.medium, borderRadius: theme.SPACING.small, marginBottom: theme.SPACING.small, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>
                                <View style={{ backgroundColor: theme.COLORS.primary, borderRadius: 500, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: theme.SPACING.small }}>
                                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: theme.FONT_SIZES.text }}> {index + 1} </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[globalStyles.text, { fontWeight: 'bold', paddingRight: theme.SPACING.medium }]}>{step.title}</Text>
                                    <Text style={[globalStyles.text, { color: theme.COLORS.textSecondary, paddingRight: theme.SPACING.medium }]}>{step.description}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', gap: theme.SPACING.small }}>
                                    <Text style={{ fontWeight: '700', fontSize: theme.FONT_SIZES.text }}>+ {step.points}</Text>
                                    <SvgUri uri={getIconUri("star.svg")} width={20} height={20} color={theme.COLORS.secondary} />
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={globalStyles.text}>{texts.noSteps}</Text>
                    )}
                </View>

                {/* Start Hunt Button */}
                <TouchableOpacity
                    style={{ width: '100%', marginTop: theme.SPACING.medium }}
                    onPress={() => {
                        if (steps.length > 0) {
                            router.push({
                                pathname: '/current-step',
                                params: {
                                    stepId: steps[0].id,
                                    huntId: huntId,
                                },
                            });
                        }
                    }}
                >
                    <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[theme.BUTTON_STYLES.default, { width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: theme.SPACING.small, height: 50 }]} >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.SPACING.small }}>
                            <SvgUri uri={getIconUri("play-button.svg")} width={20} height={20} color={theme.COLORS.background} />
                            <Text style={[{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.background, fontWeight: '700' }]}>{texts.startHunt}</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
            <BottomNavbar />
        </SafeAreaView>
    );
};

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.huntDetails,
    fr: translationsFr.huntDetails
};

export default HuntDetailsScreen;