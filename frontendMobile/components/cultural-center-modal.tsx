import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity } from 'react-native';
import { theme, globalStyles } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface CulturalCenterModalProps {
    visible: boolean;
    culturalCenterName: string;
    culturalCenterImage: string;
    culturalCenterDescription: string;
    onClose: () => void;
    onViewCenter: () => void;
}

const CulturalCenterModal: React.FC<CulturalCenterModalProps> = ({
    visible,
    culturalCenterName,
    culturalCenterDescription,
    onClose,
}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
                <View style={{ height: '42%', width: '100%', backgroundColor: theme.COLORS.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: theme.SPACING.large, }}>
                    
                    {/* Cultural Center Informations */}
                    <Image source={{ uri: 'https://picsum.photos/800/1200' }} style={{ width: '100%', height: 150, borderRadius: 10, marginBottom: theme.SPACING.medium, }} />
                    <Text style={{ ...globalStyles.title, marginBottom: theme.SPACING.small }}> {culturalCenterName} </Text>
                    <Text style={{ ...globalStyles.text, color: theme.COLORS.textSecondary, marginBottom: theme.SPACING.medium }}> {culturalCenterDescription} </Text>
                    
                    <View style={{ flexDirection: 'column', width: '100%', gap: theme.SPACING.small }}>
                        
                        {/* See more informations */}
                        <TouchableOpacity style={[{ width: '100%' }]} onPress={onClose}>
                            <LinearGradient
                                colors={[theme.COLORS.primary, theme.COLORS.secondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[theme.BUTTON_STYLES.default, { width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 10, height: 50 }]}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.SPACING.small }}>
                                    <Text style={[{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.background, fontWeight: '700' }]}>Voir le centre</Text>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CulturalCenterModal;