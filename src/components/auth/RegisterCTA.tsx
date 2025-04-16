
import { Link } from "react-router-dom";
import GoogleSignIn from "./GoogleSignIn";

const RegisterCTA = () => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>
      
      <GoogleSignIn />
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-medical-blue hover:underline font-medium">
            Log In
          </Link>
        </p>
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>
          Note: For Google Sign-in to work, it must be enabled in your Supabase project settings.
          Please check the Authentication > Providers section in your Supabase dashboard.
        </p>
      </div>
    </div>
  );
};

export default RegisterCTA;
