import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { LanguageProvider } from '../context/LanguageContext';

// Root layout defining the main navigation stack

export default function RootLayout() {
    useEffect(() => {
        const errorUtils = (global as any).ErrorUtils;
        const originalGlobalHandler = errorUtils?.getGlobalHandler?.();

        if (errorUtils?.setGlobalHandler) {
            errorUtils.setGlobalHandler((error: unknown, isFatal?: boolean) => {
                if (error instanceof Error) {
                    console.error('[GlobalCrash][JSException]', {
                        isFatal: Boolean(isFatal),
                        name: error.name,
                        message: error.message,
                        stack: error.stack,
                    });
                } else {
                    console.error('[GlobalCrash][JSException][Unknown]', {
                        isFatal: Boolean(isFatal),
                        error,
                    });
                }

                if (typeof originalGlobalHandler === 'function') {
                    originalGlobalHandler(error, isFatal);
                }
            });
        }

        const onUnhandledRejection = (event: any) => {
            const reason = event?.reason;
            if (reason instanceof Error) {
                console.error('[GlobalCrash][UnhandledPromise]', {
                    name: reason.name,
                    message: reason.message,
                    stack: reason.stack,
                });
                return;
            }

            console.error('[GlobalCrash][UnhandledPromise][Unknown]', { reason });
        };

        const addGlobalListener = (globalThis as any)?.addEventListener;
        const removeGlobalListener = (globalThis as any)?.removeEventListener;
        if (typeof addGlobalListener === 'function') {
            addGlobalListener('unhandledrejection', onUnhandledRejection);
        }

        return () => {
            if (errorUtils?.setGlobalHandler && typeof originalGlobalHandler === 'function') {
                errorUtils.setGlobalHandler(originalGlobalHandler);
            }

            if (typeof removeGlobalListener === 'function') {
                removeGlobalListener('unhandledrejection', onUnhandledRejection);
            }
        };
    }, []);

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
