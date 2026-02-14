import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore } from "./common/store/authStore";
import { currentUser } from "./api/services/auth.api";

import Home from "./pages/hunts";
import Authentification from "./pages/authentification";
import ProtectedRoute from "./common/components/security/ProtectedRoute";
import Notification from "./common/components/notification/Notification";
import Users from "./pages/users";

export default function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    currentUser("/auth/me")
      .then((user) => setUser(user))
      .catch(() => clearUser());
  }, []);

  return (
    <Router>
      <Notification />
      <Routes>
        {/* Redirection par défaut */}
        <Route path="/" element={<Navigate to="/home/authentification" replace />} />

        {/* Route protégée */}
        <Route
          path="/home/hunts"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Route publique */}
        <Route path="/home/authentification" element={<Authentification />} />
      </Routes>
    </Router>
  );
}