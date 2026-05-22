import { useEffect, useState } from 'react';
import * as Network from 'expo-network';

export function useNetworkStatus() {
    const [hasNetwork, setHasNetwork] = useState(true);

    useEffect(() => {
        const check = async () => {
            const state = await Network.getNetworkStateAsync();
            setHasNetwork(Boolean(state.isConnected && state.isInternetReachable));
        };

        check();

        const interval = setInterval(check, 5000);
        return () => clearInterval(interval);
    }, []);

    return { hasNetwork };
}