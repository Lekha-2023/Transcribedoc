
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Lock } from "lucide-react";
import { updatePassword } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import ErrorMessage from "@/components/auth/ErrorMessage";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Extract the access token from the URL hash
  useEffect(() => {
    // Example URL: http://localhost:3000/reset-password#access_token=eyJhbGciOiJ...&type=recovery
    const hash = window.location.hash;
    console.log("URL hash:", hash);
    
    if (hash && hash.includes("access_token=")) {
      const accessToken = hash
        .substring(1) // Remove the leading #
        .split("&")
        .find(param => param.startsWith("access_token="))
        ?.split("=")[1];
      
      if (accessToken) {
        console.log("Access token found:", accessToken.substring(0, 10) + "...");
        setAccessToken(accessToken);
      } else {
        setErrors({
          general: "Invalid reset link. Please request a new password reset."
        });
      }
    } else {
      setErrors({
        general: "No reset token found. Please request a new password reset link."
      });
    }
  }, []);

  const validateForm = (password: string, confirmPassword: string) => {
    const newErrors: {
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(prevErrors => ({ ...prevErrors, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (password: string, confirmPassword: string) => {
    if (!accessToken) {
      setErrors({
        general: "Missing reset token. Please request a new password reset link."
      });
      return;
    }
    
    if (!validateForm(password, confirmPassword)) return;
    
    setIsLoading(true);
    
    try {
      // Call the updatePassword function with the password
      const result = await updatePassword(password);
      
      if (result.success) {
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated. You can now log in with your new password.",
        });
        navigate("/login");
      } else {
        setErrors({
          general: result.message || "Failed to update password"
        });
      }
    } catch (error) {
      console.error("Update password error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      setErrors({
        general: error instanceof Error ? error.message : "Failed to update password"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-24 wave-bg">
        <Card className="w-full max-w-md p-8 bg-white shadow-xl">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-medical-teal/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="text-medical-teal h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-medical-dark">Reset Password</h1>
            <p className="text-gray-500 mt-2">Enter your new password below</p>
          </div>
          
          <ErrorMessage message={errors.general || ""} />
          
          <PasswordResetForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isFormDisabled={!accessToken}
            errors={{
              password: errors.password,
              confirmPassword: errors.confirmPassword
            }}
          />
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default ResetPassword;
