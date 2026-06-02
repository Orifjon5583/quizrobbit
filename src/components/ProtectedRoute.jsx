import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "./UI";

export function ProtectedRoute({ children, admin = false }) {
  const { user, profile, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && profile?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}
