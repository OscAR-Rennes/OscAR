import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot, useRouter, usePathname } from 'expo-router';
import HeaderNavbar from '../../components/ui/header-navbar';
import BottomNavbar from '../../components/ui/bottom-navbar';
import { theme } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { LogBox } from 'react-native';

function normalizeRoute(route: string): string {
    return route.replace('/(main)', '');
}

export default function MainLayout() {
    const router = useRouter();
    const pathname = usePathname();
    const { isConnected } = useAuth();

    useEffect(() => {
        if (normalizeRoute(pathname) === '/connection' && isConnected) {
            router.replace('/'); 
        }
    }, [pathname, isConnected]);

    const isConnectionPage = normalizeRoute(pathname) === '/connection';

    const Container = isConnectionPage ? View : SafeAreaView;

    LogBox.ignoreAllLogs();

    return (
        <Container style={[{flex: 1, backgroundColor: theme.COLORS.background }]}>
            
            {!isConnectionPage && <HeaderNavbar />}
            <View style={[{ flex: 1 }]}>
                <Slot />
            </View>
            
            {!isConnectionPage && <BottomNavbar currentRoute={pathname} />}
        </Container>
    );
}
