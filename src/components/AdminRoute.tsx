import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogoLoader } from "./LogoLoader";

export default function AdminRoute() {
  const { currentUser, isAdmin, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full flex-center">
        <LogoLoader size="lg" />
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
