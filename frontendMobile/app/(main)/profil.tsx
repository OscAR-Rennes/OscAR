import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../../constants/theme';
import StatsCard from '../../components/ui/stats-card';
import { SvgUri } from 'react-native-svg';
import { Asset } from 'expo-asset';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../constants/language-en.json';
import translationsFr from '../../constants/language-fr.json';

// Icon mapping
const ICONS = {
    "image-placeholder.svg": require('../../assets/icon/image-placeholder.svg'),
    "logout.svg": require('../../assets/icon/logout.svg'),
    "trophy.svg": require('../../assets/icon/trophy.svg'),
} as const;

// Function to get the URI of the SVG icon
function getIconUri(iconName: keyof typeof ICONS): string {
    const iconSource = ICONS[iconName];
    return Asset.fromModule(iconSource).uri || '';
}

export default function ProfilScreen() {
    const router = useRouter();
    const { language } = useLanguage(); // Retrieve current language
    const texts = STATIC_TEXTS[language]; // Retrieve translated texts

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: theme.SPACING.large, paddingVertical: theme.SPACING.xLarge }}>
                {/* Profile Picture */}
                <View style={{ alignItems: 'center', marginBottom: theme.SPACING.large }}>
                    <View style={{ width: 140, height: 140, borderRadius: 500, backgroundColor: '#dfdfdf', justifyContent: 'center', alignItems: 'center' }}>
                        <SvgUri uri={getIconUri("image-placeholder.svg")} width={60} height={60} color={theme.COLORS.background} />
                    </View>
                    <Text style={{ fontSize: 25, fontWeight: '700', color: theme.COLORS.textPrimary, marginTop: theme.SPACING.small }}>{texts.profilePicturePlaceholder}</Text>
                </View>

                {/* Total Points Section */}
                <LinearGradient
                    colors={[theme.COLORS.primary, theme.COLORS.secondary]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0.3, y: 0 }}
                    style={[{ width: '100%', paddingHorizontal: theme.SPACING.medium, paddingVertical: theme.SPACING.medium, borderRadius: 12, marginBottom: theme.SPACING.medium, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                >
                    <View>
                        <Text style={[{ color: theme.COLORS.background, fontWeight: '900' }]}>{texts.totalPointsTitle}</Text>
                        <Text style={[{ color: theme.COLORS.background, fontSize: 30, fontWeight: '900' }]}>{texts.totalPointsValue}</Text>
                    </View>
                    <View>
                        <SvgUri uri={getIconUri("trophy.svg")} width={60} height={60} color={theme.COLORS.background} />
                    </View>
                </LinearGradient>

                {/* Stats Section */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.SPACING.large, gap: theme.SPACING.medium }}>
                    <StatsCard icon="target-larger.svg" value={0} label={texts.statsHuntLabel} backgroundColor="#fce4ec" iconColor={theme.COLORS.primary} width={30} height={30} />
                    <StatsCard icon="pin.svg" value={0} label={texts.statsCulturalCenterLabel} backgroundColor="#fff9c4" iconColor={theme.COLORS.secondary} width={30} height={30} />
                    <StatsCard icon="group.svg" value={0} label={texts.statsFriendsLabel} backgroundColor="#e3f2fd" iconColor={theme.COLORS.tertiary} width={35} height={35} />
                </View>

                {/* Buttons */}
                <TouchableOpacity
                    style={{ width: '100%', paddingVertical: theme.SPACING.medium, borderRadius: 12, backgroundColor: theme.COLORS.background, borderWidth: 1, borderColor: theme.COLORS.border, marginBottom: theme.SPACING.medium }}
                    onPress={() => router.push('/profil-modify')}
                >
                    <Text style={{ fontSize: theme.FONT_SIZES.text, fontWeight: '700', color: theme.COLORS.textPrimary, textAlign: 'center' }}>{texts.modifyProfileButton}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '100%', paddingVertical: theme.SPACING.medium, borderRadius: 12, backgroundColor: '#ffebee', borderWidth: 1, borderColor: theme.COLORS.error }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.SPACING.small }}>
                        <SvgUri uri={getIconUri("logout.svg")} width={25} height={25} color={theme.COLORS.error} />
                        <Text style={{ fontSize: theme.FONT_SIZES.text, fontWeight: '700', color: theme.COLORS.error }}>{texts.logoutButton}</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.profil,
    fr: translationsFr.profil
};
