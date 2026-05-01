
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/auth/RegisterForm";
import RegisterCTA from "@/components/auth/RegisterCTA";
import type { RegisterErrors } from "@/utils/registerValidation";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (
    firstName: string, 
    lastName: string, 
    email: string, 
    password: string, 
    company: string, 
    title: string
  ) => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const name = `${firstName} ${lastName}`;
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
        <Card className="w-full max-w-md p-8 bg-card shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Create an Account</h1>
            <p className="text-muted-foreground mt-2">Sign up to start converting your audio to text</p>
          </div>
          
          <RegisterForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
            errors={errors}
          />
          
          <RegisterCTA />
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
