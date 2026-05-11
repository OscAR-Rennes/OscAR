import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { theme, globalStyles } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { router } from 'expo-router/build/exports';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import translations from '../constants/language-en.json';
import translationsFr from '../constants/language-fr.json';
import { CulturalCenterModalProps } from '../common/dto/ICulturalCenterModalProps';

const CulturalCenterModal: React.FC<CulturalCenterModalProps> = ({ visible, culturalCenterName, culturalCenterDescription, culturalCenterImage, culturalCenterId, onClose, onViewCenter }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { language } = useLanguage();
    const insets = useSafeAreaInsets();
    const { height: screenHeight } = useWindowDimensions();
    const bottomInset = Platform.OS === 'android' ? Math.min(insets.bottom, theme.SPACING.small) : insets.bottom;
    const bottomSafePadding = theme.SPACING.xsmall + bottomInset;
    const texts = STATIC_TEXTS[language];

    const resetAnimation = () => {
        fadeAnim.setValue(0);
    };

    useEffect(() => {
        if (visible) {
            resetAnimation();
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                onClose();
            });
        }
    }, [visible]);

    const closeModalWithAnimation = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            onClose();
        });
    };
    
    const navigateToCulturalCenter = () => {
        onClose();
        router.push({
            pathname: '/cultural-center',
            params: {
                id: culturalCenterId,
            },
        });
    };

    return (
        <Modal animationType="none" transparent={true} visible={visible} onRequestClose={closeModalWithAnimation} >
            <Animated.View style={{ flex: 1, backgroundColor: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)']
            }) }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={closeModalWithAnimation} />
                <Animated.View style={{ transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [500, 0] }) }], width: '100%', maxHeight: screenHeight * 0.75, backgroundColor: theme.COLORS.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: theme.SPACING.large, paddingHorizontal: theme.SPACING.large, paddingBottom: bottomSafePadding, position: 'absolute', bottom: 0 }}>
                    
                    {/* Cultural Center Informations */}
                    <Image source={{ uri: 'https://picsum.photos/800/1200' }} style={{ width: '100%', height: 140, borderRadius: 10, marginBottom: theme.SPACING.small }} />
                    <View style={{ width: '100%', paddingLeft: theme.SPACING.xsmall, marginBottom: theme.SPACING.small }}>
                        <Text numberOfLines={1} style={{ ...globalStyles.subtitle, width: '100%', textAlignVertical: 'center', marginBottom: theme.SPACING.xsmall, }} > 
                            {culturalCenterName} 
                        </Text>
                        <Text numberOfLines={2} style={{ ...globalStyles.text, width: '100%', textAlignVertical: 'center', color: theme.COLORS.textSecondary, marginBottom: theme.SPACING.small }} >
                            {culturalCenterDescription ?? texts.description}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'column', width: '100%', alignItems: 'center' }}>
                        <TouchableOpacity style={{ width: '100%' }} onPress={navigateToCulturalCenter}>
                            <LinearGradient
                                colors={[theme.COLORS.primary, theme.COLORS.secondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[theme.BUTTON_STYLES.default, { width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 10, height: 44 }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.SPACING.small }}>
                                    <Text style={[{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.background, fontWeight: '700' }]}>{texts.viewCenter}</Text>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.culturalCenterModal,
    fr: translationsFr.culturalCenterModal
};

export default CulturalCenterModal;