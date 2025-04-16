
interface RegisterErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  company?: string;
  title?: string;
  general?: string;
}

export const validateRegisterForm = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
  company: string,
  title: string
): RegisterErrors => {
  const errors: RegisterErrors = {};
  
  if (!firstName.trim()) {
    errors.firstName = "First name is required";
  }
  
  if (!lastName.trim()) {
    errors.lastName = "Last name is required";
  }
  
  if (!email.trim()) {
    errors.email = "Email ID is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email ID is invalid";
  }
  
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  
  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  
  if (!company.trim()) {
    errors.company = "Company name is required";
  }
  
  if (!title.trim()) {
    errors.title = "Title is required";
  }
  
  return errors;
};

export type { RegisterErrors };
