import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot, useRouter, usePathname } from 'expo-router';
import HeaderNavbar from '../../components/ui/header-navbar';
import BottomNavbar from '../../components/ui/bottom-navbar';
import { theme } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

// Normalize routes to ignore the /(main) prefix
function normalizeRoute(route: string): string {
    return route.replace('/(main)', '');
}

export default function MainLayout() {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();

    // Redirect logic for the "connection" / "profil" page
    useEffect(() => {
        if (normalizeRoute(pathname) === '/connection' && isAuthenticated) {
            router.replace('/profil'); // Redirect to profil if already logged in
        }
    }, [pathname, isAuthenticated]);

    // Check if the current route is "connection"
    const isConnectionPage = normalizeRoute(pathname) === '/connection';

    // Use SafeAreaView only if not on the connection page
    const Container = isConnectionPage ? View : SafeAreaView;

    return (
        <Container style={[{flex: 1, backgroundColor: theme.COLORS.background }]}>
            
            {/* Only show HeaderNavbar if not on the connection page */}
            {!isConnectionPage && <HeaderNavbar />}
            <View style={[{ flex: 1 }]}>
                <Slot />
            </View>
            
            {/* Only show BottomNavbar if not on the connection page */}
            {!isConnectionPage && <BottomNavbar currentRoute={pathname} />}
        </Container>
    );
}
