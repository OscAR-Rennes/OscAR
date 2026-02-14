import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity } from 'react-native';
import { theme, globalStyles } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { router } from 'expo-router/build/exports';
import { useLanguage } from '../context/LanguageContext';

interface CulturalCenterModalProps {
    visible: boolean;
    culturalCenterName: string;
    culturalCenterImage: string;
    culturalCenterDescription: string;
    culturalCenterId: string;
    onClose: () => void;
    onViewCenter: () => void;
}

const CulturalCenterModal: React.FC<CulturalCenterModalProps> = ({ visible, culturalCenterName, culturalCenterDescription, culturalCenterImage, culturalCenterId, onClose, onViewCenter }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { language } = useLanguage();
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
                name: culturalCenterName,
                description: culturalCenterDescription,
                image: culturalCenterImage,
                id: culturalCenterId,
            },
        });
    };

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={closeModalWithAnimation}
        >
            <Animated.View style={{ flex: 1, backgroundColor: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)']
            }) }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={closeModalWithAnimation} />
                <Animated.View style={{ transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [500, 0] }) }], height: '42%', width: '100%', backgroundColor: theme.COLORS.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: theme.SPACING.large }}>
                    {/* Cultural Center Informations */}
                    <Image source={{ uri: 'https://picsum.photos/800/1200' }} style={{ width: '100%', height: 150, borderRadius: 10, marginBottom: theme.SPACING.medium, }} />
                    <Text style={{ ...globalStyles.title, marginBottom: theme.SPACING.small }}> {culturalCenterName} </Text>
                    <Text style={{ ...globalStyles.text, color: theme.COLORS.textSecondary, marginBottom: theme.SPACING.medium }}> {culturalCenterDescription} </Text>
                    <View style={{ flexDirection: 'column', width: '100%', gap: theme.SPACING.small }}>
                        <TouchableOpacity style={[{ width: '100%' }]} onPress={navigateToCulturalCenter}>
                            <LinearGradient
                                colors={[theme.COLORS.primary, theme.COLORS.secondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[theme.BUTTON_STYLES.default, { width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 10, height: 50 }]}>
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

const STATIC_TEXTS = {
    fr: {
        viewCenter: 'Voir le centre',
    },
    en: {
        viewCenter: 'View center',
    },
};

export default CulturalCenterModal;