import React, { createContext, ReactNode, useContext, useState } from "react";
import { logoutUser } from '@/api/services/auth.api'
import { router } from "expo-router";

interface AuthState {
  isConnected: boolean;
  userId: string | null;
}

interface AuthContextType extends AuthState {
  login: (id: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const login = (id: string) => {
    setIsConnected(true);
    setUserId(id);
  };

  const logout = async () => {
    try {
      await logoutUser(); 
    } catch (err) {
      console.error("Erreur logout API :", err);
    }
    setIsConnected(false);
    setUserId(null);
    router.replace("/connection");
  };


  return (
    <AuthContext.Provider value={{ isConnected, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};