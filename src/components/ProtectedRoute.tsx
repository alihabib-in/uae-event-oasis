
import { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "user";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && requiredRole === "admin" && user && !isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate("/");
    }
  }, [isLoading, user, isAdmin, requiredRole, navigate]);
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for admin role if required
  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
