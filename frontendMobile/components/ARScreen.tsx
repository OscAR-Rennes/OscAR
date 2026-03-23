import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
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

const REQUIRED_MS = 5000;

const ARScene = ({ onHoldStart, onHoldEnd }: { onHoldStart: () => void, onHoldEnd: () => void }) => {
    return (
        <ViroARScene>
            <ViroAmbientLight color="#ffffff" intensity={200} />
            <ViroARImageMarker target="paintingTarget">
                <Viro3DObject
                    source={require('../assets/ar/object.obj')}
                    position={[0, 0.1, 0]}
                    scale={[0.1, 0.1, 0.1]}
                    type="OBJ"
                    onClickState={(stateValue) => {
                        // stateValue: 1 = click down, 2 = click up, 3 = clicked
                        if (stateValue === 1) {
                            onHoldStart();
                        } else if (stateValue === 2) {
                            onHoldEnd();
                        }
                    }}
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
    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const handleHoldStart = () => {
        setIsHolding(true);
        startTimeRef.current = Date.now();

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
            const pct = Math.min(elapsed / REQUIRED_MS, 1);
            setProgress(pct);

            if (pct >= 1) {
                clearInterval(intervalRef.current!);
                onValidated();
                onClose();
            }
        }, 50);
    };

    const handleHoldEnd = () => {
        setIsHolding(false);
        setProgress(0);
        startTimeRef.current = null;
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const size = 80;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <View style={StyleSheet.absoluteFill}>
            <ViroARSceneNavigator
                autofocus={true}
                initialScene={{
                    scene: () => (
                        <ARScene
                            onHoldStart={handleHoldStart}
                            onHoldEnd={handleHoldEnd}
                        />
                    )
                }}
                style={StyleSheet.absoluteFill}
            />

            {/* Timer circulaire — visible uniquement pendant le hold */}
            {isHolding && (
                <View style={styles.timerContainer}>
                    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                        <Circle
                            cx={size / 2} cy={size / 2} r={radius}
                            stroke="rgba(255,255,255,0.3)" strokeWidth={strokeWidth} fill="none"
                        />
                        <Circle
                            cx={size / 2} cy={size / 2} r={radius}
                            stroke="#4CAF50" strokeWidth={strokeWidth} fill="none"
                            strokeDasharray={`${circumference}`}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            rotation={-90} originX={size / 2} originY={size / 2}
                        />
                    </Svg>
                    <Text style={styles.timerText}>
                        {Math.ceil(REQUIRED_MS / 1000 - (progress * REQUIRED_MS / 1000))}s
                    </Text>
                </View>
            )}

            <View style={styles.hint}>
                <Text style={styles.hintText}>
                    {isHolding
                        ? 'Maintenez votre doigt sur l\'objet...'
                        : 'Appuyez sur l\'objet 3D et maintenez 5 secondes'}
                </Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
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
    timerContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -40 }, { translateY: -40 }],
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    timerText: {
        position: 'absolute',
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});