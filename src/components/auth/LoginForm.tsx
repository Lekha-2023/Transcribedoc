
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import ErrorMessage from "./ErrorMessage";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  errors: {
    email?: string;
    password?: string;
    general?: string;
  };
  onForgotPassword: (e: React.MouseEvent) => Promise<void>;
  isResettingPassword: boolean;
}

const LoginForm = ({ 
  onSubmit, 
  isLoading, 
  errors, 
  onForgotPassword, 
  isResettingPassword 
}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <>
      <ErrorMessage message={errors.general || ""} />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <button 
              onClick={onForgotPassword}
              disabled={isResettingPassword}
              className="text-xs text-medical-blue hover:underline"
            >
              {isResettingPassword ? "Sending..." : "Forgot password?"}
            </button>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-medical-teal hover:bg-medical-teal/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-medical-blue hover:underline font-medium">
            Create Account
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
