
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const resetPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup" | "reset">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);

  // If user is already logged in, redirect to homepage
  if (user) {
    navigate("/");
    return null;
  }

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const checkEmailExists = async (email: string) => {
    try {
      // Try a password reset to see if email exists
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?tab=login`,
      });
      
      // If no error, email exists
      setEmailExists(true);
      return true;
    } catch (error) {
      setEmailExists(false);
      return false;
    }
  };

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      
      toast.success("Login successful!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (values: z.infer<typeof signupSchema>) => {
    try {
      setIsLoading(true);
      
      // Check if email already exists
      const emailAlreadyExists = await checkEmailExists(values.email);
      
      if (emailAlreadyExists) {
        toast.error("An account with this email already exists");
        setActiveTab("login");
        return;
      }
      
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      
      toast.success("Account created successfully! Please check your email to verify your account.");
      setActiveTab("login");
    } catch (error: any) {
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered. Please use the forgot password link if needed.");
        setActiveTab("login");
      } else {
        toast.error(error.message || "Failed to create account");
        console.error("Signup error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/login?tab=login`,
      });

      if (error) throw error;
      
      toast.success("If an account exists with this email, you will receive password reset instructions.");
      setActiveTab("login");
    } catch (error: any) {
      // We don't want to reveal if email exists or not for security reasons
      toast.success("If an account exists with this email, you will receive password reset instructions.");
      console.error("Reset password error:", error);
      setActiveTab("login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-card/40 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-light">Welcome to <span className="text-gradient font-normal">sponsor</span><span className="text-primary font-medium">by</span></CardTitle>
              <CardDescription className="text-center">Sign in to your account or create a new one</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup" | "reset")}>
                <TabsList className="grid grid-cols-2 w-full mb-6">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="••••••••" 
                                  {...field} 
                                />
                                <Button 
                                  type="button"
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute right-0 top-0"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                      <div className="text-center">
                        <Button
                          type="button"
                          variant="link"
                          className="text-sm text-muted-foreground"
                          onClick={() => setActiveTab("reset")}
                        >
                          Forgot your password?
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {emailExists === true && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertDescription>
                            This email is already registered. Please use the 
                            <Button 
                              variant="link" 
                              className="px-1 py-0 h-auto" 
                              onClick={() => setActiveTab("reset")}
                            >
                              forgot password
                            </Button> 
                            link if needed.
                          </AlertDescription>
                        </Alert>
                      )}
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="••••••••" 
                                  {...field} 
                                />
                                <Button 
                                  type="button"
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute right-0 top-0"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Sign Up"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="reset">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium">Reset Password</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter your email and we'll send you instructions to reset your password
                    </p>
                  </div>
                  <Form {...resetPasswordForm}>
                    <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)} className="space-y-4">
                      <FormField
                        control={resetPasswordForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send Reset Link"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="w-full" 
                        onClick={() => setActiveTab("login")}
                      >
                        Back to login
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-sm text-muted-foreground text-center w-full">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
