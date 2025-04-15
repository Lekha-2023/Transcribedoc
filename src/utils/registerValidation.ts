
interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export const validateRegisterForm = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): RegisterErrors => {
  const errors: RegisterErrors = {};
  
  if (!name.trim()) {
    errors.name = "Name is required";
  }
  
  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email address is invalid";
  }
  
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  
  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  
  return errors;
};

export type { RegisterErrors };
