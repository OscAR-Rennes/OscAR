import React from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { theme, globalStyles } from '../constants/theme';
import { SvgUri } from 'react-native-svg';
import { Asset } from 'expo-asset';
import { useLanguage } from '../context/LanguageContext';
import translations from '../constants/language-en.json';
import translationsFr from '../constants/language-fr.json';
import { SuccessStepModalProps } from '../common/dto/ISuccessStepModalProps';

// Icon mapping
const ICONS = {
    "star.svg": require('../assets/icon/star.svg'),
    "check.svg": require('../assets/icon/check.svg'),
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

const SuccessStepModal: React.FC<SuccessStepModalProps> = ({ onClose, points, isLastStep, totalPoints }) => {
    const { language } = useLanguage(); // Retrieve current language
    const texts = STATIC_TEXTS[language]; // Retrieve translated texts

    return (
        <Modal animationType="fade" transparent={true} visible={true} onRequestClose={onClose} >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <TouchableWithoutFeedback>
                        <View style={{ backgroundColor: theme.COLORS.background, paddingHorizontal: theme.SPACING.large, paddingTop: theme.SPACING.xLarge, paddingBottom: theme.SPACING.large, borderRadius: theme.SPACING.medium, alignItems: 'center', width: '80%' }}>
                            <View style={[{ borderRadius: 500, backgroundColor: theme.COLORS.success, width: 100, height: 100, alignItems: 'center', justifyContent: 'center' }]}>                            
                                <SvgUri uri={getIconUri("check.svg")} width={50} height={50} color="#FFF" style={{ marginTop: 5}}/>
                            </View>
                            <Text style={[{ marginTop: theme.SPACING.medium, fontSize: 27, fontWeight: '700'  }]}>{texts.bravo}</Text>
                            {isLastStep ? (
                                <>
                                    <Text style={[globalStyles.text, { textAlign: 'center', marginTop: theme.SPACING.small, color: '#a7a7a7', fontWeight: '600' }]}>{texts.completedHunt}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small, marginTop: theme.SPACING.medium }}>
                                        <Text style={[{ textAlign: 'center', fontSize: 35, fontWeight: '800' }]}>+ {totalPoints}</Text>
                                        <SvgUri uri={getIconUri("star.svg")} width={40} height={40} color={theme.COLORS.secondary} />
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Text style={[globalStyles.text, { textAlign: 'center', marginTop: theme.SPACING.small, color: '#a7a7a7', fontWeight: '600' }]}>{texts.foundMessage}</Text>
                                    <Text style={[{ color: theme.COLORS.secondary, marginTop: theme.SPACING.medium, fontSize: 35, fontWeight: '800' }]}>+ {points} points</Text>
                                </>
                            )}

                            <TouchableOpacity onPress={onClose} style={[{ width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: theme.SPACING.small, height: 50, marginTop: theme.SPACING.small}]}>                            
                                <Text style={[{ fontSize: theme.FONT_SIZES.text, color: '#a7a7a7', fontWeight: '700' }]}>{isLastStep ? texts.returnToMenu : texts.nextStepButton}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const STATIC_TEXTS = {
    en: translations.successStepModal,
    fr: translationsFr.successStepModal
};

export default SuccessStepModal;
