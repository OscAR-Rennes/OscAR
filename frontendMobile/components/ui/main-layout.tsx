import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderNavbar from './header-navbar';
import BottomNavbar from './bottom-navbar';
import { MainLayoutProps } from '../../common/dto/IMainLayoutProps';

// Main layout component wrapping all screens with header and bottom navigation
export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FEFEFE' }}>
            <HeaderNavbar />
            <View style={{ flex: 1}}>
                {children}
            </View>
            <BottomNavbar />
        </SafeAreaView>
    );
}
