import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore } from "./common/store/authStore";
import { currentUser } from "./api/services/auth.api";

import Authentification from "./pages/authentification";
import ProtectedRoute from "./common/components/security/ProtectedRoute";
import UnauthentRoute from "./common/components/security/UnauthentRoute";
import Notification from "./common/components/notification/Notification";
import Users from "./pages/users";
import Layout from "./common/components/layout/Layout";
import LayoutEmpty from "./common/components/layout/LayoutEmpty";
import Accounts from "./pages/accounts";
import HuntsList from "./pages/hunts/list";
import CulturalCenters from "./pages/culturalcenters";
import StepsList from "./pages/steps/list";
import HuntsCreation from "./pages/hunts/create";
import StepsCreation from "./pages/steps/create";

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
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/home/hunts" element={<HuntsList />} />
          <Route path="/home/users" element={<Users />} />
          <Route path="/home/accounts" element={<Accounts />} />
          <Route path="/home/dashboard" element={<div>Tableau de bord</div>} />
          <Route path="/home/steps" element={<StepsList />} />
          <Route path="/home/settings" element={<div>Paramètres</div>} />
          <Route path="/home/cultural-center" element={<CulturalCenters />} />
          <Route path="/home/hunts/create" element={<HuntsCreation />} />
          <Route path="/home/hunts/:id" element={<div>Détails de la chasse</div>} />
          <Route path="/home/hunts/:id/edit" element={<div>Modifier la chasse</div>} />
          <Route path="/home/steps/create" element={<StepsCreation />} />
          <Route path="/home/steps/:id" element={<div>Détails de l'étape</div>} />
          <Route path="/home/steps/:id/edit" element={<div>Modifier l'étape</div>} />
        </Route>

        {/* Route publique */}
        <Route
          element={
            <UnauthentRoute>
              <LayoutEmpty />
            </UnauthentRoute>
          }
        >
          <Route path="/home/authentification" element={<Authentification />} />
        </Route>
      </Routes>
    </Router>
  );
}