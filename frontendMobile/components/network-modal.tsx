import { View, Text, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { globalStyles } from '../constants/theme'; 

export default function NetworkModal({ visible }: { visible: boolean }) {
    return (
        <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.6)',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 32,
            }}>
                <View style={{
                    backgroundColor: theme.COLORS.background,
                    borderRadius: 16,
                    padding: 24,
                    alignItems: 'center',
                    width: '100%',
                }}>
                    <Ionicons name="cloud-offline-outline" size={48} color="#f59e0b" style={{ marginBottom: 16 }} />
                    <Text style={[globalStyles.text, { fontWeight: '700', fontSize: 18, marginBottom: 8, textAlign: 'center' }]}>
                        Connexion perdue
                    </Text>
                    <Text style={[globalStyles.text, { color: theme.COLORS.textSecondary, textAlign: 'center' }]}>
                        Vérifiez votre connexion internet. La page se rechargera automatiquement une fois la connexion rétablie.
                    </Text>
                </View>
            </View>
        </Modal>
    );
}