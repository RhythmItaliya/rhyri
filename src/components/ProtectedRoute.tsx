import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogoLoader } from "./LogoLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full flex-center">
        <LogoLoader size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return children;
}
