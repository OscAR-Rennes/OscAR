import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import HeaderNavbar from '@/components/ui/header-navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNavbar from '@/components/ui/bottom-navbar';
import { globalStyles, theme } from '../constants/theme';
import { SvgUri } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../context/LanguageContext';
import translations from '../constants/language-en.json';
import translationsFr from '../constants/language-fr.json';
import { LightStepDTO } from '../common/dto/ILightStep';
import { FullStepDTO } from '../common/dto/IStep';
import { getIconUri } from './icon-mapping';
import { downloadStepArFiles, downloadStepTarget, getStepByHunt, getStepById } from '@/api/services/step.api';
import { getProgressionByHunt, saveProgress } from '@/api/services/progression.api';
import SuccessStepModal from '../components/success-step-modal';
import { useAuth } from '@/context/AuthContext';
import * as Network from 'expo-network';
import { useLocalProgression } from '@/hooks/useLocalProgression';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { useHuntPreload } from '@/hooks/useHuntPreload';

type ProgressionByHunt = {
    hunt_id: string;
    isComplete: boolean;
    current_index?: {
        id: string;
        index: number;
        remaining_steps: { id: string; title: string }[];
    };
};

type GroupedSteps = {
    indexNumber: number;
    steps: LightStepDTO[];
};

type PartStatus = 'locked' | 'available' | 'completed';

const ARScreen = React.lazy(() => import('@/components/ARScreen'));

const HuntDetailsScreen: React.FC = () => {
    const router = useRouter();
    const { id, culturalCenterId, from } = useLocalSearchParams();
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language] as {
        backToCulturalCenter?: string;
        backToMenu?: string;
        stepsTitle: string;
        noSteps: string;
        startHunt: string;
        resumeHunt?: string;
        completedHuntMessage?: string;
        partLabel: string;
        lockedPartMessage: string;
        pointsEarned: string;
        stepsRemaining: string;
    };
    const { isConnected: isLoggedIn } = useAuth();

    const huntId = Array.isArray(id) ? id[0] : id;
    const centerId = Array.isArray(culturalCenterId) ? culturalCenterId[0] : culturalCenterId;
    const fromScreen = Array.isArray(from) ? from[0] : from;

    // Réseau
    const [hasNetwork, setHasNetwork] = useState(true);

    // Données
    const [steps, setSteps] = useState<LightStepDTO[]>([]);
    const [progression, setProgression] = useState<ProgressionByHunt | null>(null);

    // AR
    const [showAR, setShowAR] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [scannedStep, setScannedStep] = useState<FullStepDTO | null>(null);
    const [totalPoints, setTotalPoints] = useState(0);

    const localProgression = useLocalProgression();
    const offlineQueue = useOfflineQueue();
    const { isPreloading, preloadProgress, preloadHunt, getCachedStep } = useHuntPreload();

    useEffect(() => {
        const interval = setInterval(async () => {
            const state = await Network.getNetworkStateAsync();
            const connected = Boolean(state.isConnected && state.isInternetReachable);
            setHasNetwork(connected);

            if (connected && isLoggedIn) {
                offlineQueue.flushQueue({
                    saveProgress: async (payload) => {
                        await saveProgress(payload);
                        if (huntId) {
                            const serverProgression = await getProgressionByHunt(huntId);
                            if (serverProgression) setProgression(serverProgression);
                        }
                    },
                });
            }
        }, 5000);

    return () => clearInterval(interval);
    }, [isLoggedIn, huntId]);

    // Charge les étapes et la progression
    useEffect(() => {
        const fetchData = async () => {
            if (!huntId) return;

            const data = await getStepByHunt(huntId);
            const loadedSteps = Array.isArray(data) ? data : [];
            setSteps(loadedSteps);

            // Progression : serveur si connecté et réseau, sinon local
            if (isLoggedIn && hasNetwork) {
                const serverProgression = await getProgressionByHunt(huntId);
                setProgression(serverProgression ?? null);
            } else if (!isLoggedIn) {
                // Utilisateur non connecté → progression locale uniquement
                const local = await localProgression.getProgression(huntId);
                if (local) setProgression(localProgression.toServerFormat(local));
            } else {
                // Connecté mais pas de réseau → progression locale en attendant le flush
                const local = await localProgression.getProgression(huntId);
                if (local) setProgression(localProgression.toServerFormat(local));
            }

            await preloadHunt(huntId, loadedSteps, getStepById);

        };

        fetchData();
    }, [huntId, isLoggedIn]);

    // Calcul des étapes complétées
    const completedStepIds = useMemo(() => {
        const set = new Set<string>();
        if (!steps.length) return set;

        if (progression?.isComplete) {
            steps.forEach((s) => set.add(s.id));
            return set;
        }

        if (progression?.current_index) {
            const remainingIds = new Set(
                (progression.current_index.remaining_steps ?? []).map((r) => r.id)
            );
            steps.forEach((step) => {
                const stepIndex = step.index_number ?? 1;
                const currentIndex = progression.current_index?.index ?? 1;
                if (stepIndex < currentIndex) {
                    set.add(step.id);
                } else if (stepIndex === currentIndex && !remainingIds.has(step.id)) {
                    set.add(step.id);
                }
            });
        }

        return set;
    }, [steps, progression]);

    useEffect(() => {
        const pts = steps
            .filter((s) => completedStepIds.has(s.id))
            .reduce((sum, s) => sum + (s.points ?? 0), 0);
        setTotalPoints(pts);
    }, [steps, completedStepIds]);

    const groupedSteps = useMemo(() =>
        steps
            .reduce((acc: GroupedSteps[], step) => {
                const indexNumber = step.index_number ?? 1;
                const existing = acc.find((g) => g.indexNumber === indexNumber);
                if (existing) existing.steps.push(step);
                else acc.push({ indexNumber, steps: [step] });
                return acc;
            }, [])
            .sort((a, b) => a.indexNumber - b.indexNumber),
        [steps]
    );

    const isPartUnlocked = useCallback((indexNumber: number) => {
        if (!isLoggedIn) return indexNumber === 1;
        if (!progression) return indexNumber === 1;
        if (progression.isComplete) return true;
        return indexNumber <= (progression.current_index?.index ?? 1);
    }, [isLoggedIn, progression]);

    const isStepCompleted = useCallback((step: LightStepDTO, indexNumber: number) => {
        if (!isLoggedIn && !progression) return false;
        if (progression?.isComplete) return true;

        const currentIndex = progression?.current_index?.index ?? 1;
        if (indexNumber < currentIndex) return true;
        if (indexNumber > currentIndex) return false;

        const remainingIds = new Set(
            (progression?.current_index?.remaining_steps ?? []).map((r) => r.id)
        );
        return !remainingIds.has(step.id);
    }, [isLoggedIn, progression]);

    const getPartStatus = useCallback((group: GroupedSteps): PartStatus => {
        const isCompleted = group.steps.every((step) => isStepCompleted(step, group.indexNumber));
        if (isCompleted) return 'completed';
        if (isPartUnlocked(group.indexNumber)) return 'available';
        return 'locked';
    }, [isStepCompleted, isPartUnlocked]);

    const completedStepsCount = useMemo(() =>
        groupedSteps
            .flatMap((g) => g.steps.map((s) => ({ step: s, indexNumber: g.indexNumber })))
            .filter(({ step, indexNumber }) => isStepCompleted(step, indexNumber)).length,
        [groupedSteps, isStepCompleted]
    );

    const totalHuntPoints = useMemo(() =>
        steps.reduce((sum, s) => sum + (s.points ?? 0), 0),
        [steps]
    );

    const isHuntCompleted = isLoggedIn && Boolean(
        progression?.isComplete || (steps.length > 0 && completedStepsCount >= steps.length)
    );

    // Scan d'une étape — utilise le cache si disponible
    const handleScanPress = async (step: LightStepDTO) => {
        const cached = getCachedStep(step.id);

        if (!hasNetwork) {
            if (!cached) return;
            // Mode offline : on construit un FullStepDTO minimal depuis le LightStepDTO si stepData absent
            const fullStep: FullStepDTO = cached.stepData ?? {
                id: step.id,
                title: step.title,
                description: step.description,
                points: step.points ?? 0,
                // complète avec les champs requis par FullStepDTO
            } as FullStepDTO;

            setScannedStep(fullStep);
            setArFiles({ targetUri: cached.targetUri, arDir: cached.arDir });
            setShowAR(true);
            return;
        }

        // Mode online
        const [full, targetUri, arDir] = await Promise.all([
            getStepById(step.id),
            cached ? Promise.resolve(cached.targetUri) : downloadStepTarget(step.id),
            cached ? Promise.resolve(cached.arDir) : downloadStepArFiles(step.id),
        ]);

        setScannedStep(full);
        setArFiles({ targetUri, arDir });
        setShowAR(true);
    };

    const [arFiles, setArFiles] = useState<{
        targetUri: string;
        arDir: string;
    } | null>(null);

    const handleARValidated = () => {
        setShowAR(false);
        if (scannedStep) {
            setShowSuccessModal(true);
        }
    };

    const handleCloseModal = async () => {
        setShowSuccessModal(false);
        if (!scannedStep || !huntId) return;

        const payload = { hunt_id: huntId, step_id: scannedStep.id };

        const networkState = await Network.getNetworkStateAsync();
        const isNetworkAvailable = Boolean(networkState.isConnected && networkState.isInternetReachable);

        if (isLoggedIn && isNetworkAvailable) {
            await saveProgress(payload);
            const serverProgression = await getProgressionByHunt(huntId);
            setProgression(serverProgression ?? null);
        } else if (isLoggedIn && !isNetworkAvailable) {
            await offlineQueue.addToQueue({ type: 'saveProgress', payload });
            const updated = await localProgression.saveStepLocally(huntId, scannedStep.id, steps);
            setProgression(localProgression.toServerFormat(updated));
        } else {
            const updated = await localProgression.saveStepLocally(huntId, scannedStep.id, steps);
            setProgression(localProgression.toServerFormat(updated));
        }

        setTotalPoints((prev) => prev + (scannedStep.points ?? 0));
        setScannedStep(null);
    };

    // Loader de préchargement
    if (isPreloading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.COLORS.primary} />
                <Text style={[globalStyles.text, { marginTop: 16, fontWeight: '600' }]}>
                    Préparation de la chasse...
                </Text>
                <Text style={[globalStyles.text, { color: theme.COLORS.textSecondary, marginTop: 8 }]}>
                    {Math.round(preloadProgress * 100)}%
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.background }}>
            <HeaderNavbar />

            {/* Bandeau hors ligne */}
            {!hasNetwork && (
                <View style={{ backgroundColor: '#f59e0b', paddingVertical: 6, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="cloud-offline-outline" size={16} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>
                        Mode hors ligne — progression sauvegardée localement
                    </Text>
                </View>
            )}

            <ScrollView contentContainerStyle={{ paddingHorizontal: theme.SPACING.large, paddingTop: theme.SPACING.medium, paddingBottom: theme.SPACING.xLarge }}>
                {/* Back Button */}
                <View style={{ alignItems: 'flex-start', marginBottom: theme.SPACING.small }}>
                    <TouchableOpacity
                        style={[theme.BUTTON_STYLES.default, { flexDirection: 'row', gap: theme.SPACING.medium, justifyContent: 'flex-start' }]}
                        onPress={() => {
                            if (centerId) {
                                router.replace({ pathname: '/cultural-center', params: { id: centerId } });
                                return;
                            }
                            if (fromScreen === 'hunt') { router.replace('/hunt'); return; }
                            router.back();
                        }}
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.COLORS.icon} />
                        <Text style={[globalStyles.text, { color: theme.COLORS.icon, fontWeight: '500', fontSize: 20 }]}>
                            {texts.backToCulturalCenter ?? texts.backToMenu}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Progression / Points Summary */}
                <View style={{ backgroundColor: theme.COLORS.background, padding: theme.SPACING.medium, borderRadius: theme.SPACING.medium, marginBottom: theme.SPACING.medium, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.SPACING.small }}>
                        <Text style={[globalStyles.text, { fontWeight: '700' }]}>Progression</Text>
                        <Text style={[globalStyles.text, { fontWeight: '700' }]}>{completedStepsCount} / {steps.length} étapes</Text>
                    </View>
                    <View style={{ height: 8, backgroundColor: '#d8d8d8', borderRadius: 4, width: '100%', marginBottom: theme.SPACING.medium }}>
                        <View style={{ height: '100%', backgroundColor: theme.COLORS.secondary, borderRadius: 4, width: `${steps.length > 0 ? (completedStepsCount / steps.length) * 100 : 0}%` }} />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, marginRight: theme.SPACING.small, backgroundColor: '#f9f9f9', padding: theme.SPACING.medium, borderRadius: theme.SPACING.medium, alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small, marginBottom: theme.SPACING.small }}>
                                <Text style={[globalStyles.title, { color: theme.COLORS.secondary }]}>{totalPoints}</Text>
                                <SvgUri uri={getIconUri('star.svg')} width={28} height={28} color={theme.COLORS.secondary} />
                            </View>
                            <Text style={[globalStyles.text, { fontWeight: '400', color: theme.COLORS.textSecondary, fontSize: theme.FONT_SIZES.tinyText }]}>{texts.pointsEarned}</Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: theme.SPACING.small, backgroundColor: '#f9f9f9', padding: theme.SPACING.medium, borderRadius: theme.SPACING.medium, alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small, marginBottom: theme.SPACING.small }}>
                                <Text style={[globalStyles.title, { color: theme.COLORS.tertiary }]}>{steps.length - completedStepsCount}</Text>
                                <SvgUri uri={getIconUri('step.svg')} width={28} height={28} color={theme.COLORS.tertiary} />
                            </View>
                            <Text style={[{ fontWeight: '400', color: theme.COLORS.textSecondary, fontSize: theme.FONT_SIZES.tinyText }]}>{texts.stepsRemaining}</Text>
                        </View>
                    </View>
                </View>

                {/* Steps List */}
                <View style={{ marginTop: theme.SPACING.small, backgroundColor: theme.COLORS.background, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5, padding: theme.SPACING.medium, borderRadius: theme.SPACING.medium }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small, marginBottom: theme.SPACING.medium }}>
                        <SvgUri uri={getIconUri("step.svg")} width={37} height={37} color={theme.COLORS.tertiary} />
                        <Text style={[globalStyles.subtitle]}>{texts.stepsTitle} ({steps.length})</Text>
                    </View>
                    {groupedSteps.length > 0 ? (
                        groupedSteps.map((group) => {
                            const partStatus = getPartStatus(group);
                            const unlocked = partStatus !== 'locked';

                            const partContent = (
                                <View style={{ backgroundColor: theme.COLORS.background, borderRadius: 5, padding: theme.SPACING.small, opacity: unlocked ? 1 : 0.85 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.SPACING.small, paddingVertical: theme.SPACING.small }}>
                                        <Text style={[globalStyles.text, { fontWeight: '700', fontSize: theme.FONT_SIZES.subtitle }]}>
                                            {texts.partLabel} {group.indexNumber}
                                        </Text>
                                        {partStatus === 'completed' ? (
                                            <View style={{ backgroundColor: '#2eb85c', borderRadius: 999, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
                                                <SvgUri uri={getIconUri('check.svg')} width={12} height={12} color={theme.COLORS.background} />
                                            </View>
                                        ) : partStatus === 'locked' ? (
                                            <SvgUri uri={getIconUri('lock.svg')} width={20} height={20} color={theme.COLORS.textSecondary} />
                                        ) : null}
                                    </View>

                                    {group.steps.map((step, stepIndex) => {
                                        const stepCompleted = isStepCompleted(step, group.indexNumber);
                                        return (
                                            <View key={step.id} style={{ flexDirection: 'column', backgroundColor: unlocked ? theme.COLORS.background : '#f5f5f5', padding: theme.SPACING.medium, borderRadius: theme.SPACING.small, marginBottom: theme.SPACING.small, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: unlocked ? 0.1 : 0, shadowRadius: 4, elevation: unlocked ? 2 : 0 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: stepCompleted || !unlocked ? 0 : theme.SPACING.small }}>
                                                    <View style={{ backgroundColor: unlocked ? theme.COLORS.primary : '#9f9f9f', borderRadius: 500, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: theme.SPACING.small }}>
                                                        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: theme.FONT_SIZES.text }}>{stepIndex + 1}</Text>
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={[globalStyles.text, { fontWeight: 'bold', paddingRight: theme.SPACING.medium }]}>{step.title}</Text>
                                                        <Text style={[{ color: theme.COLORS.textSecondary, paddingRight: theme.SPACING.medium, fontSize: theme.FONT_SIZES.tinyText }]}>
                                                            {unlocked ? step.description : texts.lockedPartMessage}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', gap: theme.SPACING.small, alignItems: 'center' }}>
                                                        {stepCompleted ? (
                                                            <View style={{ backgroundColor: '#2eb85c', borderRadius: 999, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
                                                                <SvgUri uri={getIconUri('check.svg')} width={11} height={11} color={theme.COLORS.background} />
                                                            </View>
                                                        ) : unlocked ? (
                                                            <>
                                                                <Text style={{ fontWeight: '700', fontSize: theme.FONT_SIZES.text }}>+ {step.points}</Text>
                                                                <SvgUri uri={getIconUri("star.svg")} width={20} height={20} color={theme.COLORS.secondary} />
                                                            </>
                                                        ) : (
                                                            <SvgUri uri={getIconUri('lock.svg')} width={16} height={16} color={theme.COLORS.textSecondary} />
                                                        )}
                                                    </View>
                                                </View>

                                                {!stepCompleted && unlocked && (
                                                    <TouchableOpacity
                                                        onPress={() => handleScanPress(step)}
                                                        style={{ width: '100%' }}
                                                        disabled={!hasNetwork && !getCachedStep(step.id)}
                                                    >
                                                        <LinearGradient
                                                            colors={hasNetwork || getCachedStep(step.id) ? [theme.COLORS.primary, theme.COLORS.secondary] : ['#ccc', '#aaa']}
                                                            start={{ x: 0, y: 0 }}
                                                            end={{ x: 1, y: 0 }}
                                                            style={[theme.BUTTON_STYLES.default, { width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: theme.SPACING.small, paddingVertical: 10 }]}
                                                        >
                                                            <Text style={{ color: theme.COLORS.background, fontWeight: '700' }}>
                                                                {!hasNetwork && !getCachedStep(step.id) ? 'Non disponible hors ligne' : 'Scanner'}
                                                            </Text>
                                                        </LinearGradient>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        );
                                    })}
                                </View>
                            );

                            return (
                                <View key={`part-${group.indexNumber}`} style={{ marginBottom: theme.SPACING.medium }}>
                                    {unlocked ? (
                                        <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: theme.SPACING.small, padding: 3 }}>
                                            {partContent}
                                        </LinearGradient>
                                    ) : (
                                        <View style={{ borderRadius: theme.SPACING.small, borderWidth: 1, borderColor: '#d9d9d9', padding: 1 }}>
                                            {partContent}
                                        </View>
                                    )}
                                </View>
                            );
                        })
                    ) : (
                        <Text style={globalStyles.text}>{texts.noSteps}</Text>
                    )}
                </View>

                {isHuntCompleted && (
                    <View style={{ width: '100%', marginTop: theme.SPACING.medium, borderRadius: theme.SPACING.medium, borderWidth: 1, borderColor: `${theme.COLORS.secondary}55`, backgroundColor: `${theme.COLORS.secondary}22`, padding: theme.SPACING.medium }}>
                        <Text style={[globalStyles.text, { fontWeight: '700', marginBottom: theme.SPACING.small }]}>
                            {texts.completedHuntMessage}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small }}>
                            <Text style={[globalStyles.subtitle, { fontSize: theme.FONT_SIZES.text }]}>{totalHuntPoints}</Text>
                            <SvgUri uri={getIconUri('star.svg')} width={20} height={20} color={theme.COLORS.secondary} />
                        </View>
                    </View>
                )}
            </ScrollView>

            {showSuccessModal && scannedStep && (
                <SuccessStepModal
                    onClose={handleCloseModal}
                    points={scannedStep.points}
                    isLastStep={false}
                    totalPoints={totalPoints}
                />
            )}

            <BottomNavbar />

            {showAR && arFiles && (
                <React.Suspense fallback={<View><Text>Chargement AR...</Text></View>}>
                    <ARScreen
                        onClose={() => setShowAR(false)}
                        onValidated={handleARValidated}
                        targetUri={arFiles.targetUri}
                        arDir={arFiles.arDir}
                    />
                </React.Suspense>
            )}
        </SafeAreaView>
    );
};

const STATIC_TEXTS = {
    en: translations.huntDetails,
    fr: translationsFr.huntDetails,
};

export default HuntDetailsScreen;
