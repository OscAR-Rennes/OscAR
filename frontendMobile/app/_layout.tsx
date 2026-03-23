import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { LanguageProvider } from '../context/LanguageContext';


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
