
import { Link } from "react-router-dom";

const RegisterCTA = () => {
  return (
    <div className="mt-6 text-center text-sm">
      <p className="text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-medical-blue hover:underline font-medium">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default RegisterCTA;
