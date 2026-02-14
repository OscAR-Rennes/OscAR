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
import { Asset } from 'expo-asset';
import { useRouter } from 'expo-router';
import HeaderNavbar from '@/components/ui/header-navbar';
import Ionicons from '@expo/vector-icons/build/Ionicons';

interface Step {
    id: string;
    title: string;
    description: string;
    points: number;
    hunt_id: string;
    latitude: number;
    longitude: number;
    index_id: string;
    created_at: string;
    updated_at: string;
}


// Icon mapping
const ICONS = {
    "star.svg": require('../assets/icon/star.svg'),
    "camera.svg": require('../assets/icon/camera.svg'),
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

const CurrentStepScreen: React.FC = () => {
    const router = useRouter();
    const { stepId, huntId } = useLocalSearchParams();
    const [currentStep, setCurrentStep] = useState<Step | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    const { language } = useLanguage(); // Retrieve current language
    const texts = STATIC_TEXTS[language]; // Retrieve translated texts

    const steps = data.steps.filter((s: Step) => s.hunt_id === huntId); // Fix missing steps reference

    useEffect(() => {
        if (stepId) {
            const step = data.steps.find((s: Step) => s.id === stepId);
            setCurrentStep(step || null);
        }
    }, [stepId]);

    const handleScanPress = () => {
        setShowSuccessModal(true);
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
    };

    if (!currentStep) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.COLORS.background }}>
                <Text style={globalStyles.text}>Étape introuvable.</Text>
            </SafeAreaView>
        );
    }

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
                        <Text style={[globalStyles.text, { fontWeight: 'bold' }]}>Étape 1 / {steps.length}</Text>
                    </View>
                    <View style={{ height: 8, backgroundColor: '#d8d8d8', borderRadius: 4, width: '100%' }}>
                        <View style={{ height: '100%', backgroundColor: theme.COLORS.secondary, borderRadius: 4, width: `${(1 / steps.length) * 100}%` }} />
                    </View>
                </View>

                {/* Step Details */}
                <View style={{ backgroundColor: theme.COLORS.background, paddingHorizontal: theme.SPACING.medium, paddingVertical: theme.SPACING.xLarge, borderRadius: theme.SPACING.medium, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 5 }}>
                    <View style={{ alignItems: 'center', marginBottom: theme.SPACING.medium }}>
                        <View style={{ backgroundColor: theme.COLORS.primary, borderRadius: 500, width: 70, height: 70, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: theme.FONT_SIZES.subtitle }}>1</Text>
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
                        <LinearGradient
                            colors={[theme.COLORS.primary, theme.COLORS.secondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[theme.BUTTON_STYLES.default, { width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: theme.SPACING.small, height: 50 }]} >
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
                        <Text style={[globalStyles.title, { color: theme.COLORS.secondary }]}>0</Text>
                        <Text style={[globalStyles.text, { fontWeight: '700', textAlign: 'center' }]}>{texts.pointsEarned}</Text>
                    </View>
                    <View style={{ width: '46%', height: 110, backgroundColor: theme.COLORS.background, shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 5, padding: theme.SPACING.medium, borderRadius: theme.SPACING.medium, alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                        <Text style={[globalStyles.title, { color: theme.COLORS.tertiary }]}>{steps.length - 1}</Text>
                        <Text style={[globalStyles.text, { fontWeight: '700', textAlign: 'center' }]}>{texts.stepsRemaining}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Success Modal */}
            {showSuccessModal && <SuccessStepModal onClose={handleCloseModal} points={currentStep.points} />}

            <BottomNavbar />
        </SafeAreaView>
    );
};

const STATIC_TEXTS = {
    fr: {
        backToMenu: 'Retour au Menu',
        pointsEarned: 'Points gagnés',
        stepsRemaining: 'Étapes restantes',
        scanButton: 'Scanner / Caméra RA',
        informationText: "Utilisez votre caméra pour scanner l’oeuvre ou le lieu !",
    },
    en: {
        backToMenu: 'Back to Menu',
        pointsEarned: 'Points Earned',
        stepsRemaining: 'Steps Remaining',
        scanButton: 'Scan / AR Camera',
        informationText: "Use your camera to scan the artwork or location !",
    },
};

export default CurrentStepScreen;
