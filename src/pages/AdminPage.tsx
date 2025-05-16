
import { useEffect } from "react";
import AdminPage from "@/components/AdminPage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

const AdminPageWrapper = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Double check here to ensure only admins can access
  useEffect(() => {
    if (user && !isAdmin) {
      toast.error("You don't have permission to access the admin page");
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  return <AdminPage />;
};

export default AdminPageWrapper;
