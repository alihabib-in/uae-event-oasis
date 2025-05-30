
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fetch admin settings from supabase
async function fetchOtpSettings() {
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      console.error("Error fetching OTP settings:", error);
      return false; // Default to NOT requiring OTP if there's an error
    }
    
    // Check if the field exists before accessing it
    // Since the database schema doesn't match the TypeScript types,
    // we need to check if the field exists as a dynamic property
    return data && 'require_otp_verification' in data 
      ? Boolean(data.require_otp_verification)
      : false; // Default to NOT requiring OTP
  } catch (error) {
    console.error("Exception fetching OTP settings:", error);
    return false; // Default to NOT requiring OTP
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [requireOtpVerification, setRequireOtpVerification] = useState(false);

  // Fetch OTP settings when the component mounts
  useEffect(() => {
    fetchOtpSettings().then(requireOtp => {
      if (requireOtp !== undefined) {
        setRequireOtpVerification(requireOtp);
      }
    });
  }, []);

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAdmin(session?.user?.email === "admin@sponsorby.com" || 
                  Boolean(session?.user?.email?.includes("admin")));
      }
    );
    
    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === "admin@sponsorby.com" || 
                Boolean(session?.user?.email?.includes("admin")));
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Successfully signed out");
    } catch (error: any) {
      toast.error(error.message || "Sign out failed");
    }
  };

  const value = {
    session,
    user,
    signOut,
    isLoading,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export the OTP settings functionality with default to not requiring OTP
export const useOtpSettings = () => {
  const [requireOtp, setRequireOtp] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSettings = async () => {
      setIsLoading(true);
      const requireOtp = await fetchOtpSettings();
      if (requireOtp !== undefined) {
        setRequireOtp(requireOtp);
      }
      setIsLoading(false);
    };
    
    getSettings();
  }, []);

  return { requireOtp, isLoading };
};
