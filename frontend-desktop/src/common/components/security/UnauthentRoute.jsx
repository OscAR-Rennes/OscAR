import { useAuthStore } from "../../store/authStore";
import { Navigate } from "react-router-dom";

export default function UnauthentRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/home/hunts" replace />;
  }

  return children;
}
