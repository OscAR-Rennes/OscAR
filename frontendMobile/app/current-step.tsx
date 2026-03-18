import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { theme, globalStyles } from '../constants/theme';
import data from '../assets/data.json';
import SuccessStepModal from '../components/success-step-modal';
import BottomNavbar from '@/components/ui/bottom-navbar';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'expo-router';
import HeaderNavbar from '@/components/ui/header-navbar';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import translations from '../constants/language-en.json';
import translationsFr from '../constants/language-fr.json';
import { LightStepDTO } from '../common/dto/ILightStep';
import { getIconUri } from './icon-mapping';
import { getStepByHunt } from '@/api/services/step.api'

const CurrentStepScreen: React.FC = () => {
    const router = useRouter();
    const { huntId } = useLocalSearchParams();
    const [currentStepIndex, setCurrentStepIndex] = useState(0); // Track the current step index
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [totalPoints, setTotalPoints] = useState(0); // Track total points earned

    const { language } = useLanguage(); // Retrieve current language
    const texts = STATIC_TEXTS[language]; // Retrieve translated texts
    const [steps, setSteps] = useState<LightStepDTO[]>([]);
    const currentStep = steps[currentStepIndex]; // Get the current step based on the index

    
    const handleScanPress = () => {
        setShowSuccessModal(true);
    };

    // Handle closing the success modal and moving to the next step or ending the hunt
    const handleCloseModal = () => {
        setShowSuccessModal(false);
        setTotalPoints(totalPoints + currentStep.points); // Increment total points after closing modal
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1); // Increment the step index
        } else {
            router.push('/');
        }
    };


    useEffect(() => {
            const fetchData = async () => {
                const data = await getStepByHunt(huntId)
                setSteps(data)
            }
            if (huntId != null && huntId != "") {
                fetchData()
            }
        }, [])


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.background }}>
            <HeaderNavbar />
            <ScrollView contentContainerStyle={{ padding: theme.SPACING.large }}>
                {/* Back Button */}
                <View style={{ alignItems: 'flex-start', marginBottom: theme.SPACING.medium }}>
                    <TouchableOpacity style={[theme.BUTTON_STYLES.default, { flexDirection: 'row', gap: theme.SPACING.medium, justifyContent: 'flex-start' }]} onPress={() => router.push('/')}>
                        <Ionicons name="arrow-back" size={24} color={theme.COLORS.icon} />
                        <Text style={[globalStyles.text, { color: theme.COLORS.icon, fontWeight: '500', fontSize: 20 }]}>{texts.backToMenu}</Text>
                    </TouchableOpacity>
                </View>

                {/* Step Progression */}
                <View style={[{ flexDirection: 'column', marginBottom: theme.SPACING.large, backgroundColor: theme.COLORS.background, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 5, padding: theme.SPACING.medium, borderRadius: theme.SPACING.medium}]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small, marginBottom: theme.SPACING.medium }}>
                        <Text style={[globalStyles.text, { fontWeight: 'bold' }]}>Progression</Text>
                        <Text style={[globalStyles.text, { fontWeight: 'bold' }]}>Étape {currentStepIndex + 1} / {steps.length}</Text>
                    </View>
                    <View style={{ height: 8, backgroundColor: '#d8d8d8', borderRadius: 4, width: '100%' }}>
                        <View style={{ height: '100%', backgroundColor: theme.COLORS.secondary, borderRadius: 4, width: `${((currentStepIndex + 1) / steps.length) * 100}%` }} />
                    </View>
                </View>

                {/* Step Details */}
                <View style={{ backgroundColor: theme.COLORS.background, paddingHorizontal: theme.SPACING.medium, paddingVertical: theme.SPACING.xLarge, borderRadius: theme.SPACING.medium, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 5 }}>
                    <View style={{ alignItems: 'center', marginBottom: theme.SPACING.medium }}>
                        <View style={{ backgroundColor: theme.COLORS.primary, borderRadius: 500, width: 70, height: 70, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: theme.FONT_SIZES.subtitle }}>{currentStepIndex + 1}</Text>
                        </View>
                        <Text style={[globalStyles.title, { marginTop: theme.SPACING.small, textAlign: 'center' }]}>{currentStep.title}</Text>
                        <Text style={[globalStyles.text, { textAlign: 'center', marginTop: theme.SPACING.small }]}>{currentStep.description}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: theme.SPACING.medium, gap: 4, backgroundColor: "#ffe2a7", padding: theme.SPACING.small, borderRadius: 500, borderWidth: 1, borderColor: theme.COLORS.secondary, width: '45%' }}>
                        <SvgUri uri={getIconUri("star.svg")} width={20} height={20} color="#d38f08" />
                        <Text style={[globalStyles.text, { fontWeight: '700', fontSize: theme.FONT_SIZES.text, color: "#d38f08" }]}>+ {currentStep.points} points</Text>
                    </View>

                    {/* Scan Button */}
                    <TouchableOpacity onPress={handleScanPress} style={{ width: '100%' }}>
                        <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[theme.BUTTON_STYLES.default, { width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: theme.SPACING.small, height: 50 }]} >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.SPACING.small }}>
                                <SvgUri uri={getIconUri("camera.svg")} width={35} height={35} color={theme.COLORS.background} />
                                <Text style={[{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.background, fontWeight: '700' }]}>{texts.scanButton}</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text style={[globalStyles.text, { textAlign: 'center', fontSize: theme.FONT_SIZES.smallText, marginTop: theme.SPACING.medium, color: theme.COLORS.textTertiary }]}>{texts.informationText}</Text>
                </View>

                {/* Points and Remaining Steps */}
                <View style={{ flexDirection: 'row', marginTop: theme.SPACING.large, justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ width: '46%', height: 110, backgroundColor: theme.COLORS.background, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 5, padding: theme.SPACING.medium, borderRadius: theme.SPACING.medium, alignItems: 'center', gap: 5  }}>
                        <Text style={[globalStyles.title, { color: theme.COLORS.secondary }]}>{totalPoints}</Text>
                        <Text style={[globalStyles.text, { fontWeight: '700', textAlign: 'center' }]}>{texts.pointsEarned}</Text>
                    </View>
                    <View style={{ width: '46%', height: 110, backgroundColor: theme.COLORS.background, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 5, padding: theme.SPACING.medium, borderRadius: theme.SPACING.medium, alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                        <Text style={[globalStyles.title, { color: theme.COLORS.tertiary }]}>{steps.length - currentStepIndex - 1}</Text>
                        <Text style={[globalStyles.text, { fontWeight: '700', textAlign: 'center' }]}>{texts.stepsRemaining}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Success Modal */}
            {showSuccessModal && <SuccessStepModal onClose={handleCloseModal} points={currentStep.points} isLastStep={currentStepIndex === steps.length - 1} totalPoints={totalPoints} />}

            <BottomNavbar />
        </SafeAreaView>
    );
};

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.currentStep,
    fr: translationsFr.currentStep
};

export default CurrentStepScreen;
