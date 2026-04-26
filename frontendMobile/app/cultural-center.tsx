import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
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
import { useLanguage } from '../context/LanguageContext';
import { SvgUri } from 'react-native-svg';
import translations from '../constants/language-en.json';
import translationsFr from '../constants/language-fr.json';
import { getIconUri } from './icon-mapping';
import { CulturalCenter } from '@/common/dto/ICulturalCenter';
import { getCulturalCenterById } from '@/api/services/culturalcenter.api';
import { getHuntsByCulturalCenter } from '@/api/services/hunt.api'
import { LightHuntDto } from '@/common/dto/ILightHunt'

const CulturalCenterScreen: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const culturalCenterId = Array.isArray(id) ? id[0] : id;
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language];

    const [culturalCenter, setCulturalCenter] = useState<CulturalCenter | null>(null)
    const [hunts, setHunts] = useState<LightHuntDto[]>([])

    // Fetch Cultural Center information
    useEffect(() => {
        const fetchData = async () => {
            const data = await getCulturalCenterById(culturalCenterId)
            const huntsData = await getHuntsByCulturalCenter(culturalCenterId)
            setHunts(Array.isArray(huntsData) ? huntsData : [])
            setCulturalCenter(data)
        }
        if (culturalCenterId != null && culturalCenterId != "") {
            fetchData()
        }
    }, [culturalCenterId])

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
    const [toggleContainerWidth, setToggleContainerWidth] = useState(0);
    const sliderInset = 5;
    const sliderWidth = Math.max(0, (toggleContainerWidth - sliderInset * 2) / 2);

    const translateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, sliderWidth],
    });


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.background }}>
            <HeaderNavbar/>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: theme.SPACING.large, paddingBottom: theme.SPACING.xLarge + 90, }} nestedScrollEnabled keyboardShouldPersistTaps="handled" >
                {/* Back Button */}
                <TouchableOpacity style={[{ flexDirection: 'row', gap: theme.SPACING.medium, justifyContent: 'flex-start', marginBottom: theme.SPACING.large }]} onPress={() => router.push('/')} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={24} color={theme.COLORS.icon} />
                    <Text style={[{ color: theme.COLORS.icon, fontWeight: '500', fontSize: 20 }]}>{texts.backToMenu}</Text>
                </TouchableOpacity>

                <Image source={{ uri: 'https://picsum.photos/800/1200' }} style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: theme.SPACING.medium }} />
                <Text style={{ fontSize: theme.FONT_SIZES.title, fontWeight: 'bold', marginBottom: theme.SPACING.small, color: theme.COLORS.textPrimary }}>
                    {culturalCenter?.name}
                </Text>
                <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary, marginBottom: theme.SPACING.medium }}>
                    {culturalCenter?.name}
                </Text>

                {/* Double Button */}
                <View
                    style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: theme.SPACING.medium, borderRadius: 18, backgroundColor: theme.COLORS.background,
                        ...(Platform.OS === 'ios'
                            ? { shadowColor: theme.COLORS.icon, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.15, shadowRadius: 5, }
                            : { elevation: 6, }), }} >
                    <View onLayout={(event) => setToggleContainerWidth(event.nativeEvent.layout.width)} style={{ flexDirection: 'row', width: '100%', backgroundColor: theme.COLORS.background, borderRadius: 18, padding: sliderInset }} >
                        <Animated.View style={{ position: 'absolute', top: sliderInset, left: sliderInset, bottom: sliderInset, width: sliderWidth, borderRadius: 15, transform: [{ translateX }], }} >
                            <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, borderRadius: 15 }} />
                        </Animated.View>

                        {/* All Hunts */}
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }} onPress={() => handleButtonPress('chasses')} activeOpacity={1} >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small }}>
                                <SvgUri uri={getIconUri("target-larger.svg")} width={25} height={25} color={activeButton === 'chasses' ? theme.COLORS.background : theme.COLORS.textPrimary} />
                                <Animated.Text style={{ color: activeButton === 'chasses' ? theme.COLORS.background : theme.COLORS.textPrimary, fontWeight: 'bold', fontSize: 17, }} >
                                    {texts.hunts}
                                </Animated.Text>
                            </View>
                        </TouchableOpacity>

                        {/* Leaderboard for cultural center */}
                        <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }} onPress={() => handleButtonPress('classement')} activeOpacity={1} >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small }}>
                                <SvgUri uri={getIconUri("loyalty-points.svg")} width={28} height={28} color={activeButton === 'classement' ? theme.COLORS.background : theme.COLORS.textPrimary} />
                                <Animated.Text style={{ color: activeButton === 'classement' ? theme.COLORS.background : theme.COLORS.textPrimary, fontWeight: 'bold', fontSize: 17, }} >
                                    {texts.leaderboard}
                                </Animated.Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Section Content */}
                {activeButton === 'chasses' ? (
                    hunts && hunts.length > 0 ? (
                        <HuntList hunts={hunts} culturalCenterId={String(id)} />
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

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.culturalCenter,
    fr: translationsFr.culturalCenter
};

export default CulturalCenterScreen;