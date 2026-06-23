import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';

const QUEUE_KEY = 'offline_queue';

export type QueuedRequest = {
    id: string;
    type: 'saveProgress';
    payload: {
        hunt_id: string;
        step_id: string;
    };
    timestamp: number;
};

export const useOfflineQueue = () => {

    const getQueue = async (): Promise<QueuedRequest[]> => {
        try {
            const raw = await AsyncStorage.getItem(QUEUE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    };

    const addToQueue = async (request: Omit<QueuedRequest, 'id' | 'timestamp'>) => {
        const queue = await getQueue();
        const newRequest: QueuedRequest = {
            ...request,
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            timestamp: Date.now(),
        };
        await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify([...queue, newRequest]));
        console.log('[OfflineQueue] Added to queue:', newRequest);
    };

    const removeFromQueue = async (id: string) => {
        const queue = await getQueue();
        const filtered = queue.filter((r) => r.id !== id);
        await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
    };

    const clearQueue = async () => {
        await AsyncStorage.removeItem(QUEUE_KEY);
    };

    const flushQueue = async (
        handlers: {
            saveProgress: (payload: QueuedRequest['payload']) => Promise<void>;
        }
    ) => {
        const state = await Network.getNetworkStateAsync();
        if (!state.isConnected) {
            console.log('[OfflineQueue] No network, skipping flush');
            return;
        }

        const queue = await getQueue();
        if (queue.length === 0) return;

        console.log(`[OfflineQueue] Flushing ${queue.length} request(s)`);

        for (const request of queue) {
            try {
                if (request.type === 'saveProgress') {
                    await handlers.saveProgress(request.payload);
                }
                await removeFromQueue(request.id);
                console.log(`[OfflineQueue] Replayed and removed: ${request.id}`);
            } catch (err) {
                console.warn(`[OfflineQueue] Failed to replay ${request.id}:`, err);
            }
        }
    };

    return { getQueue, addToQueue, removeFromQueue, clearQueue, flushQueue };
};
