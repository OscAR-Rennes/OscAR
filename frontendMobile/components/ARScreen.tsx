import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';

import Svg, { Circle } from 'react-native-svg';
import * as FileSystem from 'expo-file-system/legacy';

import {
    ViroARScene,
    ViroARSceneNavigator,
    ViroARImageMarker,
    ViroARTrackingTargets,
    Viro3DObject,
    ViroAmbientLight,
    ViroAnimations,
    ViroNode,
} from '@reactvision/react-viro';

ViroAnimations.registerAnimations({
    rotate: {
        properties: {
            rotateZ: '+=360',
        },
        duration: 4000,
    },
});

const REQUIRED_MS = 2000;

type ARSceneProps = {
    onHoldStart: () => void;
    onHoldEnd: () => void;
    targetUri: string;
    objUri: string;
    resources: { uri: string }[];
};

const ARScene = ({
    onHoldStart,
    onHoldEnd,
    targetUri,
    objUri,
    resources,
}: ARSceneProps) => {

    useEffect(() => {
        ViroARTrackingTargets.createTargets({
            paintingTarget: {
                source: { uri: targetUri },
                orientation: 'Up',
                physicalWidth: 0.3,
            },
        });
    }, [targetUri]);

    return (
        <ViroARScene>
            <ViroAmbientLight
                color="#ffffff"
                intensity={300}
            />

            <ViroARImageMarker target="paintingTarget">
                <ViroNode
                    position={[0, 0, 0]}
                    dragType="FixedToWorld"
                    animation={{
                        name: 'rotate',
                        run: true,
                        loop: true,
                        interruptible: true,
                    }}
                >
                    <Viro3DObject
                        source={{ uri: objUri }}
                        resources={resources}
                        position={[0, 0, 0]}
                        rotation={[180, 0, 0]}
                        scale={[0.01, 0.01, 0.01]}
                        type="OBJ"
                        onClickState={(stateValue) => {
                            if (stateValue === 1) {
                                onHoldStart();
                            } else if (stateValue === 2) {
                                onHoldEnd();
                            }
                        }}
                    />
                </ViroNode>
            </ViroARImageMarker>
        </ViroARScene>
    );
};

interface ARScreenProps {
    onClose: () => void;
    onValidated: () => void;
    targetUri: string;
    arDir: string;
}

export default function ARScreen({
    onClose,
    onValidated,
    targetUri,
    arDir,
}: ARScreenProps) {

    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const [objUri, setObjUri] = useState<string | null>(null);
    const [resources, setResources] = useState<{ uri: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const readFilesRecursive = async (dir: string): Promise<string[]> => {
        const entries = await FileSystem.readDirectoryAsync(dir);
        const results = await Promise.all(
            entries.map(async (entry) => {

                const fullPath = `${dir}/${entry}`;

                const info = await FileSystem.getInfoAsync(fullPath);

                if (info.isDirectory) {
                    return await readFilesRecursive(fullPath);
                }
                return [fullPath];
            })
        );
        return results.flat();
    };

    useEffect(() => {
        const loadAssets = async () => {
            try {

                const files = await readFilesRecursive(arDir);
                const objFile = files.find((file) =>
                    file.toLowerCase().endsWith('.obj')
                );

                if (!objFile) {
                    throw new Error('Aucun fichier OBJ trouvé');
                }

                setObjUri(objFile);
                const resourceFiles = files.filter((file) => {

                    const lower = file.toLowerCase();
                    return (
                        lower.endsWith('.mtl') ||
                        lower.endsWith('.png') ||
                        lower.endsWith('.jpg') ||
                        lower.endsWith('.jpeg') ||
                        lower.endsWith('.webp')
                    );
                });
                setResources(
                    resourceFiles.map((file) => ({
                        uri: file,
                    }))
                );
            } catch (err) {
                console.error('Erreur chargement assets AR', err);
            } finally {
                setLoading(false);
            }
        };

        loadAssets();
    }, [arDir]);

    const handleHoldStart = () => {
        setIsHolding(true);
        startTimeRef.current = Date.now();

        intervalRef.current = setInterval(() => {
            const elapsed =
                Date.now() - (startTimeRef.current ?? Date.now());

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
    const strokeDashoffset =
        circumference * (1 - progress);

    if (loading || !objUri) {

        return (
            <View style={[StyleSheet.absoluteFill, styles.loader]}>
                <ActivityIndicator
                    size="large"
                    color="#fff"
                />

                <Text
                    style={{
                        color: '#fff',
                        marginTop: 12,
                    }}
                >
                    Chargement du modèle 3D...
                </Text>
            </View>
        );
    }

    return (
        <View style={StyleSheet.absoluteFill}>

            <ViroARSceneNavigator
                autofocus={true}
                initialScene={{
                    scene: () => (
                        <ARScene
                            onHoldStart={handleHoldStart}
                            onHoldEnd={handleHoldEnd}
                            targetUri={targetUri}
                            objUri={objUri}
                            resources={resources}
                        />
                    ),
                }}
                style={StyleSheet.absoluteFill}
            />

            {isHolding && (
                <View style={styles.timerContainer}>
                    <Svg
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                    >

                        <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth={strokeWidth}
                            fill="none"
                        />

                        <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke="#4CAF50"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={`${circumference}`}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            rotation={-90}
                            originX={size / 2}
                            originY={size / 2}
                        />
                    </Svg>

                    <Text style={styles.timerText}>
                        {
                            Math.ceil(
                                REQUIRED_MS / 1000 -
                                (progress * REQUIRED_MS / 1000)
                            )
                        }s
                    </Text>
                </View>
            )}

            <View style={styles.hint}>
                <Text style={styles.hintText}>
                    {
                        isHolding
                            ? 'Maintenez votre doigt sur l’objet...'
                            : 'Appuyez sur l’objet 3D et maintenez 2 secondes'
                    }
                </Text>
            </View>

            <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
            >
                <Text style={styles.closeText}>
                    ✕
                </Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({

    loader: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },

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

    closeText: {
        color: '#fff',
        fontSize: 18,
    },

    hint: {
        position: 'absolute',
        bottom: 60,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        padding: 12,
    },

    hintText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 14,
    },

    timerContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [
            { translateX: -40 },
            { translateY: -40 },
        ],
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