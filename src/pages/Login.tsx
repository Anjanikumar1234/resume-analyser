
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Lock, Mail, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import AnimatedBackground from "@/components/AnimatedBackground";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form data
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form data
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Simulate API login request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, we're just simulating a successful login
      toast.success("Login successful!");
      
      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify({ email: loginEmail, role: "user" }));
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Simulate API register request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, we're just simulating a successful registration
      toast.success("Registration successful! Please log in.");
      
      // Switch to login tab
      document.getElementById("login-tab")?.click();
      
      // Pre-fill email
      setLoginEmail(registerEmail);
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAdminLogin = () => {
    if (loginEmail === "admin@example.com" && loginPassword === "admin123") {
      toast.success("Admin login successful!");
      localStorage.setItem("user", JSON.stringify({ email: loginEmail, role: "admin" }));
      navigate("/admin");
    } else {
      toast.error("Invalid admin credentials");
    }
  };
  
  const handleGoogleLogin = () => {
    // In a real application, you would verify the Google token
    // and authenticate the user based on the Google response
    toast.success("Google login successful!");
    localStorage.setItem("user", JSON.stringify({ 
      email: "user@gmail.com", 
      role: "user",
      provider: "google" 
    }));
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold gradient-text">AI Resume Analyzer</h1>
          <p className="text-muted-foreground mt-2">Unlock your career potential with AI-powered resume analysis</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card cyber-border rounded-xl shadow-lg overflow-hidden"
        >
          <Tabs defaultValue="login" className="p-6">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger id="login-tab" value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="google-login-button w-full flex justify-center">
                    <GoogleLogin
                      onSuccess={() => handleGoogleLogin()}
                      onError={() => toast.error("Google login failed")}
                      useOneTap
                    />
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4 text-sm">
                    <div className="flex items-center gap-2 mb-1 text-blue-700 dark:text-blue-400">
                      <Info className="w-4 h-4" />
                      <span className="font-medium">Admin Login Credentials</span>
                    </div>
                    <p className="text-blue-600 dark:text-blue-300 text-xs">
                      Email: admin@example.com<br />
                      Password: admin123
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Are you an admin?{" "}
                    <button
                      type="button"
                      onClick={handleAdminLogin}
                      className="text-primary hover:underline"
                    >
                      Login as admin
                    </button>
                  </p>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or register with</span>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="google-login-button w-full flex justify-center">
                    <GoogleLogin
                      onSuccess={() => handleGoogleLogin()}
                      onError={() => toast.error("Google login failed")}
                      useOneTap
                    />
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowRight className="w-4 h-4 mr-2" />
            Continue as Guest
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
