
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { validateRegisterForm, RegisterErrors } from "@/utils/registerValidation";
import ErrorMessage from "./ErrorMessage";

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
  errors: RegisterErrors;
}

const RegisterForm = ({ onSubmit, isLoading, errors }: RegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<RegisterErrors>({});

  // Merge external and internal validation errors
  useEffect(() => {
    setValidationErrors({ ...validationErrors, ...errors });
  }, [errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newValidationErrors = validateRegisterForm(name, email, password, confirmPassword);
    setValidationErrors(newValidationErrors);
    
    if (Object.keys(newValidationErrors).length === 0) {
      await onSubmit(name, email, password);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorMessage message={validationErrors.general || ""} />
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <div className="relative">
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className={`pl-10 ${validationErrors.name ? "border-red-500" : ""}`}
          />
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        {validationErrors.name && (
          <p className="mt-1 text-xs text-red-500">{validationErrors.name}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={`pl-10 ${validationErrors.email ? "border-red-500" : ""}`}
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        {validationErrors.email && (
          <p className="mt-1 text-xs text-red-500">{validationErrors.email}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className={`pl-10 ${validationErrors.password ? "border-red-500" : ""}`}
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <button 
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? 
              <EyeOff className="h-4 w-4" /> : 
              <Eye className="h-4 w-4" />
            }
          </button>
        </div>
        {validationErrors.password && (
          <p className="mt-1 text-xs text-red-500">{validationErrors.password}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className={`pl-10 ${validationErrors.confirmPassword ? "border-red-500" : ""}`}
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <button 
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? 
              <EyeOff className="h-4 w-4" /> : 
              <Eye className="h-4 w-4" />
            }
          </button>
        </div>
        {validationErrors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">{validationErrors.confirmPassword}</p>
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
            Creating Account...
          </>
        ) : (
          "Sign Up"
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;
