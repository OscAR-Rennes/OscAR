import { useState } from 'react';

// Simulated authentication hook

export const useAuth = () => {
    const [isAuthenticated] = useState(false); // Change to true to simulate "connected" state
    return { isAuthenticated };
};