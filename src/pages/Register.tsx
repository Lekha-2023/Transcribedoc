
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/auth/RegisterForm";
import type { RegisterErrors } from "@/utils/registerValidation";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await registerUser(name, email, password);
      
      if (result.success) {
        toast({
          title: "Registration successful",
          description: "Your account has been created. Please login.",
        });
        navigate("/login");
      } else {
        toast({
          title: "Registration failed",
          description: result.message,
          variant: "destructive"
        });
        setErrors({
          general: result.message
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      setErrors({
        general: error instanceof Error ? error.message : "Registration failed"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={false} />
      
      <div className="flex-1 flex items-center justify-center px-4 py-24 wave-bg">
        <Card className="w-full max-w-md p-8 bg-white shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-medical-dark">Create an Account</h1>
            <p className="text-gray-500 mt-2">Sign up to start converting your audio to text</p>
          </div>
          
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-500 text-sm rounded">
              {errors.general}
            </div>
          )}
          
          <RegisterForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
            errors={errors}
          />
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-medical-blue hover:underline font-medium">
                Log In
              </Link>
            </p>
          </div>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
