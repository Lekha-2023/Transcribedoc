
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface PasswordResetFormProps {
  onSubmit: (password: string, confirmPassword: string) => void;
  isLoading: boolean;
  isFormDisabled: boolean;
  errors: {
    password?: string;
    confirmPassword?: string;
  };
}

const PasswordResetForm = ({ onSubmit, isLoading, isFormDisabled, errors }: PasswordResetFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password, confirmPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          className={errors.password ? "border-red-500" : ""}
          disabled={isFormDisabled}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className={errors.confirmPassword ? "border-red-500" : ""}
          disabled={isFormDisabled}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-medical-teal hover:bg-medical-teal/90 text-white"
        disabled={isLoading || isFormDisabled}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating Password...
          </>
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  );
};

export default PasswordResetForm;
