export interface LanguageButtonProps {
    languageCode: 'fr' | 'en';
    currentLanguage: 'fr' | 'en';
    onPress: () => void;
    label: string;
    countryCode: string;
}