import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, globalStyles } from '../../constants/theme';

const HeaderNavbar = () => (
    <View style={{ width: '100%', shadowColor: theme.COLORS.icon, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 6, }}>
        <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: -0.15, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: '100%', height: 70, justifyContent: 'center', alignItems: 'center', }} >
            <Text style={[globalStyles.title, { fontSize: 30, color: theme.COLORS.background }]}>LOOTOPIA</Text>
        </LinearGradient>
  </View>
);

export default HeaderNavbar;