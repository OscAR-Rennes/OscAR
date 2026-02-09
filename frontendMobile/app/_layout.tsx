import { Stack } from 'expo-router';
import { LanguageProvider } from '../context/LanguageContext';

// Root layout defining the main navigation stack

export default function RootLayout() {
    return (
        <LanguageProvider>
            <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
                <Stack.Screen name="(main)" options={{ headerShown: false }} />
                <Stack.Screen name="connection" />
                <Stack.Screen name="profil" />
                <Stack.Screen name="inscription" />
            </Stack>
        </LanguageProvider>
    );
}
