import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {
    ViroARScene,
    ViroARSceneNavigator,
    ViroARImageMarker,
    ViroARTrackingTargets,
    Viro3DObject,
    ViroAmbientLight,
} from '@reactvision/react-viro';

ViroARTrackingTargets.createTargets({
    paintingTarget: {
        source: require('../assets/ar/target.jpg'),
        orientation: 'Up',
        physicalWidth: 0.3,
    },
});

const ARScene = ({ onValidated }: { onValidated: () => void }) => {
    const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleAnchorFound = () => {
        scanTimer.current = setTimeout(() => {
            onValidated();
        }, 5000);
    };

    const handleAnchorRemoved = () => {
        if (scanTimer.current) {
            clearTimeout(scanTimer.current);
            scanTimer.current = null;
        }
    };

    return (
        <ViroARScene>
            <ViroAmbientLight color="#ffffff" intensity={200} />
            <ViroARImageMarker
                target="paintingTarget"
                onAnchorFound={handleAnchorFound}
                onAnchorRemoved={handleAnchorRemoved}
            >
                <Viro3DObject
                    source={require('../assets/ar/object.obj')}
                    position={[0, 0.1, 0]}
                    scale={[0.1, 0.1, 0.1]}
                    type="OBJ"
                />
            </ViroARImageMarker>
        </ViroARScene>
    );
};

interface ARScreenProps {
    onClose: () => void;
    onValidated: () => void;
}

export default function ARScreen({ onClose, onValidated }: ARScreenProps) {
    const handleValidated = () => {
        onValidated();
        onClose();
    };

    return (
        <View style={StyleSheet.absoluteFill}>
            <ViroARSceneNavigator
                autofocus={true}
                initialScene={{ scene: () => <ARScene onValidated={handleValidated} /> }}
                style={StyleSheet.absoluteFill}
            />
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.hint}>
                <Text style={styles.hintText}>Pointez la caméra vers l'image cible et maintenez 5 secondes</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    closeText: { color: '#fff', fontSize: 18 },
    hint: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        padding: 12,
    },
    hintText: { color: '#fff', textAlign: 'center', fontSize: 14 },
});