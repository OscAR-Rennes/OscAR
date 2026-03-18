import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';
import { SvgUri } from 'react-native-svg';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from 'expo-router';
import translations from '../constants/language-en.json';
import translationsFr from '../constants/language-fr.json';
import { HuntListProps } from '../common/dto/IHuntListProps';
import { getIconUri } from '../app/icon-mapping';
import { LightHuntDto } from '@/common/dto/ILightHunt';

const HuntList: React.FC<HuntListProps> = ({ hunts }) => {
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language];
    const router = useRouter();

    const getDifficultyStyles = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return {
                    backgroundColor: '#DFF2E1',
                    borderColor: theme.COLORS.easy,
                    color: '#36a22f',
                };
            case 'medium':
                return {
                    backgroundColor: '#FFF4CC',
                    borderColor: theme.COLORS.medium,
                    color: '#f3ac20',
                };
            case 'hard':
                return {
                    backgroundColor: '#FAD4D4',
                    borderColor: theme.COLORS.hard,
                    color: '#e21b15',
                };
            default:
                return {};
        }
    };

    const handleHuntPress = (hunt: LightHuntDto & { id: string }) => {
        router.push({
            pathname: '/hunt-details',
            params: {
                id: hunt.id,
                title: hunt.title,
                description: `Description for ${hunt.title}`
            },
        });
    };

    return (
        <View>
            {hunts.map((hunt: LightHuntDto, index: number) => (
                <TouchableOpacity  key={index}  style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.COLORS.background, padding: theme.SPACING.medium, marginBottom: theme.SPACING.medium, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 }} onPress={() => handleHuntPress(hunt)} >
                    {/* Hunt Informations */}
                    <View style={{ flex: 1 }}>
                        <Text style={[{ marginBottom: theme.SPACING.small, fontSize: 20, fontWeight: 'bold' }]}>{hunt.title}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small }}>
                            <Text style={{ paddingHorizontal: theme.SPACING.small, paddingVertical: theme.SPACING.xsmall, borderRadius: 500, ...getDifficultyStyles(hunt.difficulty.name), borderWidth: 1, fontSize: 12, fontWeight: '700', color: getDifficultyStyles(hunt.difficulty.name).color || theme.COLORS.textPrimary }}>{hunt.difficulty.name}</Text>
                            <Text style={{ backgroundColor: '#F0F0F0', borderColor: theme.COLORS.border, borderWidth: 1, borderRadius: 500, paddingHorizontal: theme.SPACING.small, paddingVertical: theme.SPACING.xsmall, color: theme.COLORS.textSecondary, fontSize: 12, fontWeight: '700' }}>{hunt.steps} {texts.steps}</Text>
                        </View>
                    </View>

                    {/* Points Section */}
                    <View style={[{ height: '100%', flexDirection: 'column'}]}>
                        <View style={[{ flexDirection: 'row', gap: 4 }]}>
                            <Text style={[{ fontSize: 25, fontWeight: '700', }]}>+ {hunt.points}</Text>
                            <SvgUri uri={getIconUri("star.svg")} width={28} height={28} color={theme.COLORS.secondary} />
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.huntList,
    fr: translationsFr.huntList
};

export default HuntList;