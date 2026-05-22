import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useRouter, usePathname } from 'expo-router';
import { theme } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext'; 
import translations from '../../constants/language-en.json';
import translationsFr from '../../constants/language-fr.json';
import { Tab } from '../../common/dto/ITab';
import { getIconUri, IconName } from '../../app/icon-mapping';

// Icon paths
const ICON_PATHS: Record<string, IconName> = {
    index: "map.svg",
    hunt: "target.svg",
    social: "loyalty-points.svg",
    connexion: "user.svg",
};

// Normalize routes to ignore the /(main) prefix
function normalizeRoute(route: string): string {
    return route.replace('/(main)', '');
}

interface BottomNavbarProps {
    currentRoute?: string;
    onNavigate?: (route: string) => void;
    disabled?: boolean; 
}

export default function BottomNavbar({ currentRoute, onNavigate, disabled }: BottomNavbarProps) {
    const router = useRouter();
    const pathname = currentRoute || usePathname();
    const { isConnected } = useAuth();
    const { language } = useLanguage(); 

    // Define tab labels based on the current language
    const labels = STATIC_TEXTS[language];

    const connectionTab = {
        key: 'connection',
        label: isConnected ? labels.profile : labels.connection,
        route: isConnected ? '/profil' : '/connection',
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
                
                let iconWidth = 28;
                let iconHeight = 28;
                
                if (tab.key === 'social') {
                    iconWidth = 30;
                    iconHeight = 30;
                }

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
                        onPress={() => {
                            if (disabled) return; 
                            onNavigate ? onNavigate(tab.route) : router.push(tab.route as any)
                        }}
                        activeOpacity={0.7}
                        disabled={disabled}
                    >
                        {iconUri && (
                            <SvgUri
                                uri={iconUri}
                                width={iconWidth}
                                height={iconHeight}
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
