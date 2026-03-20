import { useState } from 'react';

// Simulated authentication hook

export const useAuth = () => {
    const [isAuthenticated] = useState(true); // Change to true to simulate "connected" state
    return { isAuthenticated };
};