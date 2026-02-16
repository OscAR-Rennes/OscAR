import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Asset } from 'expo-asset';
import { useRouter, usePathname } from 'expo-router';
import { theme } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext'; 
import translations from '../../constants/language-en.json';
import translationsFr from '../../constants/language-fr.json';

// Icon paths
const ICON_PATHS = {
    index: require('../../assets/icon/map.svg'),
    hunt: require('../../assets/icon/target.svg'),
    social: require('../../assets/icon/loyalty-points.svg'),
    connexion: require('../../assets/icon/user.svg'),
};

// Get URI from icon module
function getIconUri(iconSource: number): string {
    return Asset.fromModule(iconSource).uri || '';
}

// Normalize routes to ignore the /(main) prefix
function normalizeRoute(route: string): string {
    return route.replace('/(main)', '');
}

// Tab interface
interface Tab {
    key: string;
    label: string;
    route: string;
    icon: number;
}

// Bottom navigation bar component
interface BottomNavbarProps {
    currentRoute?: string;
    onNavigate?: (route: string) => void;
}

export default function BottomNavbar({ currentRoute, onNavigate }: BottomNavbarProps) {
    const router = useRouter();
    const pathname = currentRoute || usePathname();
    const { isAuthenticated } = useAuth();
    const { language } = useLanguage(); // Retrieve current language

    // Define tab labels based on the current language
    const labels = STATIC_TEXTS[language];

    const connectionTab = {
        key: 'connection',
        label: isAuthenticated ? labels.profile : labels.connection,
        route: isAuthenticated ? '/profil' : '/connection',
        icon: ICON_PATHS.connexion,
    };

    const tabs: Tab[] = [
        { key: 'index', label: labels.maps, route: '/(main)', icon: ICON_PATHS.index },
        { key: 'hunt', label: labels.hunt, route: '/(main)/hunt', icon: ICON_PATHS.hunt },
        { key: 'social', label: labels.social, route: '/(main)/social', icon: ICON_PATHS.social },
        connectionTab,
    ];

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                height: 80,
                paddingTop: theme.SPACING.large,
                paddingHorizontal: theme.SPACING.small,
                backgroundColor: theme.COLORS.background,
                borderTopWidth: 3,
                borderTopColor: theme.COLORS.active,
            }}
        >
            {tabs.map((tab) => {
                const isActive =
                    (tab.key === 'index' && (pathname === '/' || normalizeRoute(pathname) === normalizeRoute(tab.route))) ||
                    normalizeRoute(pathname) === normalizeRoute(tab.route);
                const itemColor = isActive ? theme.COLORS.active : theme.COLORS.inactive;
                const iconUri = getIconUri(tab.icon);

                return (
                    <TouchableOpacity
                        key={tab.key}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: theme.SPACING.small,
                            gap: theme.SPACING.small,
                        }}
                        onPress={() => onNavigate ? onNavigate(tab.route) : router.push(tab.route as any)}
                        activeOpacity={0.7}
                    >
                        {iconUri && (
                            <SvgUri
                                uri={iconUri}
                                width={28}
                                height={28}
                                color={itemColor}
                            />
                        )}
                        <Text
                            style={{
                                fontSize: theme.FONT_SIZES.tinyText,
                                fontWeight: '600',
                                marginTop: 2,
                                color: itemColor,
                            }}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// Translations of tab labels
const STATIC_TEXTS = {
    en: translations.bottomNavbar,
    fr: translationsFr.bottomNavbar
};
