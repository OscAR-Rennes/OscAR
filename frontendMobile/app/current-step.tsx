import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { theme, globalStyles } from '../constants/theme';
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
import { getStepByHunt, getStepById } from '@/api/services/step.api'
import { FullStepDTO } from '@/common/dto/IStep'
import { saveProgress } from '@/api/services/progression.api'
import { useAuth } from '@/context/AuthContext';

const ARScreen = React.lazy(() => import('@/components/ARScreen'));

const CurrentStepScreen: React.FC = () => {
    const router = useRouter();
    const { huntId } = useLocalSearchParams();
    const { isConnected } = useAuth();

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [totalPoints, setTotalPoints] = useState(0);

    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language];

    const [steps, setSteps] = useState<LightStepDTO[]>([]);
    const [currentStep, setCurrentStep] = useState<FullStepDTO | null>(null);

    const [showAR, setShowAR] = useState(false);

    const handleScanPress = () => {
        setShowAR(true);
    };

    const handleARValidated = () => {
        setShowAR(false);
        setShowSuccessModal(true);
    };
    const handleCloseModal = async () => {
        setShowSuccessModal(false);

        if (currentStep) {

            console.log(isConnected)
            if (isConnected) {
                await saveProgress({
                    hunt_id: huntId as string,
                    step_id: currentStep.id,
                });
            }

            setTotalPoints(prev => prev + currentStep.points);
        }

        setCurrentStepIndex(prevIndex => {
            if (prevIndex < steps.length - 1) {
                return prevIndex + 1;
            } else {
                router.push('/');
                return prevIndex;
            }
        });
    };

    useEffect(() => {
        const fetchSteps = async () => {
        const data = await getStepByHunt(huntId as string);
        setSteps(data);
        if (data.length > 0) {
            const full = await getStepById(data[0].id);
            setCurrentStep(full);
        }
        };

        if (huntId) {
        fetchSteps();
        }
    }, [huntId]);

    useEffect(() => {
        const fetchCurrentStep = async () => {
        const light = steps[currentStepIndex];
        if (!light) return;
            const full = await getStepById(light.id);
            setCurrentStep(full);
        };

        if (steps.length > 0) {
            fetchCurrentStep();
        }
    }, [currentStepIndex, steps]);




    return (
        <>
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
                    { steps && 
                        <View style={[{ flexDirection: 'column', marginBottom: theme.SPACING.large, backgroundColor: theme.COLORS.background, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 5, padding: theme.SPACING.medium, borderRadius: theme.SPACING.medium}]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small, marginBottom: theme.SPACING.medium }}>
                                <Text style={[globalStyles.text, { fontWeight: 'bold' }]}>Progression</Text>
                                <Text style={[globalStyles.text, { fontWeight: 'bold' }]}>Étape {currentStepIndex + 1} / {steps.length}</Text>
                            </View>
                            <View style={{ height: 8, backgroundColor: '#d8d8d8', borderRadius: 4, width: '100%' }}>
                                <View style={{ height: '100%', backgroundColor: theme.COLORS.secondary, borderRadius: 4, width: `${((currentStepIndex + 1) / steps.length) * 100}%` }} />
                            </View>
                        </View>
                    }

                    {/* Step Details */}
                    <View style={{ backgroundColor: theme.COLORS.background, paddingHorizontal: theme.SPACING.medium, paddingVertical: theme.SPACING.xLarge, borderRadius: theme.SPACING.medium, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 5 }}>
                        { currentStep &&
                            <>
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
                            </>
                        }

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
                    { steps && 
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
                    }
                </ScrollView>

                {/* Success Modal */}
                {showSuccessModal && currentStep && <SuccessStepModal onClose={handleCloseModal} points={currentStep.points} isLastStep={currentStepIndex === steps.length - 1} totalPoints={totalPoints} />}

                <BottomNavbar />
            </SafeAreaView>

            {showAR && (
                <ARScreen
                    onClose={() => setShowAR(false)}
                    onValidated={handleARValidated}
                />
            )}
        </>
    );
};

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.currentStep,
    fr: translationsFr.currentStep
};

export default CurrentStepScreen;
