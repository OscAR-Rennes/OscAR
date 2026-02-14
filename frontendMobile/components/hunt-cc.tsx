import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { theme, globalStyles } from '../constants/theme';
import { Asset } from 'expo-asset';
import { SvgUri } from 'react-native-svg';
import { useLanguage } from '../context/LanguageContext';

type Hunt = {
    title: string;
    difficulty: string;
    steps: number;
    points: number;
};

type HuntListProps = {
    hunts: Hunt[];
};

// Icon mapping
const ICONS = {
    "star.svg": require('../assets/icon/star.svg'),
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

const HuntList: React.FC<HuntListProps> = ({ hunts }) => {
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language];

    const getDifficultyStyles = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'facile':
                return {
                    backgroundColor: '#DFF2E1',
                    borderColor: theme.COLORS.easy,
                    color: '#36a22f',
                };
            case 'moyen':
                return {
                    backgroundColor: '#FFF4CC',
                    borderColor: theme.COLORS.medium,
                    color: '#f3ac20',
                };
            case 'difficile':
                return {
                    backgroundColor: '#FAD4D4',
                    borderColor: theme.COLORS.hard,
                    color: '#e21b15',
                };
            default:
                return {};
        }
    };

    return (
        <View>
            {hunts.map((hunt: Hunt, index: number) => (
                <TouchableOpacity key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.COLORS.background, padding: theme.SPACING.medium, marginBottom: theme.SPACING.medium, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 }}>
                    {/* Hunt Informations */}
                    <View style={{ flex: 1 }}>
                        <Text style={[{ marginBottom: theme.SPACING.small, fontSize: 20, fontWeight: 'bold' }]}>{hunt.title}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small }}>
                            <Text style={{ paddingHorizontal: theme.SPACING.small, paddingVertical: theme.SPACING.xsmall, borderRadius: 500, ...getDifficultyStyles(hunt.difficulty), borderWidth: 1, fontSize: 12, fontWeight: '700', color: getDifficultyStyles(hunt.difficulty).color || theme.COLORS.textPrimary }}>{hunt.difficulty}</Text>
                            <Text style={{ backgroundColor: '#F0F0F0', borderColor: theme.COLORS.border, borderWidth: 1, borderRadius: 500, paddingHorizontal: theme.SPACING.small, paddingVertical: theme.SPACING.xsmall, color: theme.COLORS.textSecondary, fontSize: 12, fontWeight: '700' }}>{hunt.steps} {texts.steps}</Text>
                        </View>
                    </View>

                    {/* Points Section */}
                    <View style={[{ height: '100%', flexDirection: 'column'}]}>
                        <View style={[{ flexDirection: 'row', gap: 4 }]}>
                            <Text style={[{ fontSize: 25, fontWeight: '700' }]}>{hunt.points}</Text>
                            <SvgUri uri={getIconUri("star.svg")} width={28} height={28} color={theme.COLORS.secondary} />
                        </View>
                        <Text style={[{ textAlign: 'center', fontWeight: '500' }]}>{texts.points}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const STATIC_TEXTS = {
    fr: {
        steps: 'étapes',
        points: 'Points',
    },
    en: {
        steps: 'steps',
        points: 'Points',
    },
};

export default HuntList;