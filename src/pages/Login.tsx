
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { loginUser, clearAllAuthData, resetPassword } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";
import ClearDataButton from "@/components/auth/ClearDataButton";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = (email: string, password: string) => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    }
    
    if (!password && !isResettingPassword) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (email: string, password: string) => {
    if (!validateForm(email, password)) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await loginUser(email, password);
      
      if (result.success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate("/dashboard");
      } else {
        setErrors({
          general: result.message || "Invalid login credentials"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      setErrors({
        general: error instanceof Error ? error.message : "Authentication failed"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Get email from the form
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const email = emailInput?.value || "";
    
    if (!email.trim()) {
      setErrors({
        email: "Please enter your email address"
      });
      return;
    }
    
    setIsResettingPassword(true);
    setErrors({});
    
    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        toast({
          title: "Reset link sent",
          description: "Check your email for password reset instructions",
        });
      } else {
        setErrors({
          general: result.message || "Failed to send reset instructions"
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        title: "Error",
        description: "Failed to send reset instructions",
        variant: "destructive"
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleClearData = () => {
    clearAllAuthData();
    toast({
      title: "Data cleared",
      description: "All saved login data has been removed.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={false} />
      
      <div className="flex-1 flex items-center justify-center px-4 py-24 wave-bg">
        <Card className="w-full max-w-md p-8 bg-white shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-medical-dark">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to your MediScribe account</p>
          </div>
          
          <LoginForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
            errors={errors}
            onForgotPassword={handleForgotPassword}
            isResettingPassword={isResettingPassword}
          />

          <div className="mt-6 pt-6 border-t">
            <ClearDataButton onClick={handleClearData} />
          </div>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
