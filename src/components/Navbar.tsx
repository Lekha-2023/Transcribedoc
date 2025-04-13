
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Mic, FileText, LogOut, Menu, X } from "lucide-react";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout?: () => void;
}

const Navbar = ({ isLoggedIn, onLogout }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Mic className="h-6 w-6 text-medical-teal" />
          <span className="text-xl font-semibold text-medical-dark">MediScribe</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-medical-dark hover:text-medical-teal transition-colors"
          >
            Home
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="text-medical-dark hover:text-medical-teal transition-colors"
              >
                Dashboard
              </Link>
              <Button onClick={onLogout} variant="ghost" className="flex items-center space-x-1">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-medical-dark hover:text-medical-teal transition-colors"
              >
                Login
              </Link>
              <Link to="/register">
                <Button className="bg-medical-teal hover:bg-medical-teal/90 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-medical-dark"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full">
          <div className="flex flex-col px-4 py-4 space-y-4">
            <Link
              to="/"
              className="text-medical-dark hover:text-medical-teal transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-medical-dark hover:text-medical-teal transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Button 
                  onClick={() => {
                    if (onLogout) onLogout();
                    setIsMobileMenuOpen(false);
                  }} 
                  variant="ghost" 
                  className="flex items-center justify-start space-x-1 py-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-medical-dark hover:text-medical-teal transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="bg-medical-teal hover:bg-medical-teal/90 text-white w-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
