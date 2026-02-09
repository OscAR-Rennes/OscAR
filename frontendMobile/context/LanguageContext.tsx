import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the available languages
export type Language = 'fr' | 'en';

// Create the context
interface LanguageContextProps {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Create a provider
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('fr'); // Default language is French

    useEffect(() => {
        // Load language from AsyncStorage on mount
        const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem('appLanguage');
            if (savedLanguage) {
            setLanguage(savedLanguage as Language);
            }
        } catch (error) {
            console.error('Failed to load language from AsyncStorage:', error);
        }
        };

        loadLanguage();
    }, []);

    const updateLanguage = async (lang: Language) => {
        try {
            await AsyncStorage.setItem('appLanguage', lang);
            setLanguage(lang);
        } catch (error) {
            console.error('Failed to save language to AsyncStorage:', error);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: updateLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextProps => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};