import axios from 'axios';
import Constants from 'expo-constants';

const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';
const apiKey = Constants.expoConfig?.extra?.deeplApiKey;

if (!apiKey) {
    throw new Error('DEEPL_API_KEY is not defined in the environment variables.');
}

interface DeepLResponse {
    translations: { text: string }[];
}

export const translateText = async (text: string, targetLang: string): Promise<string> => {
    try {
        const response = await axios.post<DeepLResponse>(
            DEEPL_API_URL,
            new URLSearchParams({
                text,
                target_lang: targetLang,
                source_lang: 'FR',
            }),
            {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  Authorization: `DeepL-Auth-Key ${apiKey}`,
              },
            }
        );

        const translations = response.data.translations;
        if (translations && translations.length > 0) {
            return translations[0].text;
        }

        throw new Error('No translations found in the response.');
    } catch (error) {
        console.error('Error while translating text:', error);
        throw error;
    }
};