import { Mic } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-medical-dark text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center space-x-2">
            <Mic className="h-6 w-6 text-medical-teal" />
            <span className="text-xl font-semibold">TranscribeDoc</span>
          </Link>
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} TranscribeDoc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
