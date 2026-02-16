import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { theme } from '../constants/theme';
import { SvgUri } from 'react-native-svg';
import { Asset } from 'expo-asset';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../context/LanguageContext';
import translations from '../constants/language-en.json';
import translationsFr from '../constants/language-fr.json';

// Icon mapping
const ICONS = {
    "group.svg": require('../assets/icon/group.svg'),
    "send.svg": require('../assets/icon/send.svg'),
    "plus.svg": require('../assets/icon/plus.svg'),
    "user.svg": require('../assets/icon/user.svg'),
} as const;

// Function to get the URI of the SVG icon
function getIconUri(iconName: keyof typeof ICONS): string {
    const iconSource = ICONS[iconName];
    return Asset.fromModule(iconSource).uri || '';
}

// AddFriends component
export default function AddFriends() {
    const [isVisible, setIsVisible] = useState(false);
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language];

    return (
        <>
            <TouchableOpacity style={{ width: '100%', marginTop: theme.SPACING.medium, backgroundColor: '#d1f2cd', paddingVertical: theme.SPACING.medium, borderRadius: 12 }} onPress={() => setIsVisible(true)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.SPACING.small }}>
                    <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textPrimary, fontWeight: '700' }}>{texts.addFriends}</Text>
                    <SvgUri uri={getIconUri('plus.svg')} width={20} height={20} color={theme.COLORS.textPrimary} />
                </View>
            </TouchableOpacity>

            <Modal visible={isVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableWithoutFeedback>
                            <View style={{ backgroundColor: theme.COLORS.background, borderRadius: 18, paddingHorizontal: theme.SPACING.large, paddingTop: theme.SPACING.large, paddingBottom: theme.SPACING.large, width: '85%' }}>
                                <View style={{ borderRadius: 500, backgroundColor: theme.COLORS.secondary, width: 80, height: 80, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                    <SvgUri uri={getIconUri('group.svg')} width={50} height={50} color={theme.COLORS.background} />
                                </View>
                                <Text style={{ fontSize: theme.FONT_SIZES.subtitle, fontWeight: '700', textAlign: 'center', marginTop: theme.SPACING.medium }}>{texts.inviteFriends}</Text>

                                <View style={{ marginTop: theme.SPACING.xLarge }}>
                                    <View style={[theme.INPUT_STYLES.container, { gap: theme.SPACING.small }]}>
                                        <SvgUri uri={getIconUri('user.svg')} width={20} height={20} color={theme.COLORS.placeholder} />
                                        <TextInput style={[theme.INPUT_STYLES.text, { paddingVertical: theme.SPACING.medium }]} placeholder={texts.pseudoPlaceholder} placeholderTextColor={theme.COLORS.placeholder} />
                                    </View>
                                </View>

                                <Text style={{ fontSize: theme.FONT_SIZES.smallText, color: theme.COLORS.textSecondary, marginTop: theme.SPACING.small, fontWeight: '600' }}>{texts.pseudoHint}</Text>

                                <TouchableOpacity style={{ width: '100%', marginTop: theme.SPACING.medium }}>
                                    <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 8, height: 50 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.SPACING.small }}>
                                            <Text style={{ fontSize: 13, color: theme.COLORS.background, fontWeight: '700' }}>{texts.sendRequest}</Text>
                                            <SvgUri uri={getIconUri('send.svg')} width={20} height={20} color={theme.COLORS.background} />
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ marginTop: theme.SPACING.large, alignSelf: 'center' }} onPress={() => setIsVisible(false)}>
                                    <Text style={{ fontSize: theme.FONT_SIZES.label, color: theme.COLORS.textSecondary }}>{texts.back}</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
}

// Translated static texts
const STATIC_TEXTS = {
    en: translations.addFriends,
    fr: translationsFr.addFriends
};