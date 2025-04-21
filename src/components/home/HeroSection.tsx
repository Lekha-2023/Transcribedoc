
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  isLoggedIn: boolean;
}

// Use an Unsplash healthcare image as a background, with styling overlay for clarity.
const HeroSection = ({ isLoggedIn }: HeroSectionProps) => {
  return (
    <section className="relative h-[85vh] flex items-center select-none">
      {/* Stronger visual with healthcare-specific placeholder image and gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=1200&q=80")',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-medical-dark/90 via-medical-dark/80 to-medical-blue/40 pointer-events-none" />
      <div className="container mx-auto max-w-6xl relative z-20 h-full flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          <div className="md:w-7/12 lg:w-2/3 mt-10 md:mt-0 md:pr-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
              Convert Medical Audio to Text with{" "}
              <span className="text-medical-teal bg-white/10 px-2 rounded">AI Power</span>
            </h1>
            <p className="mt-6 text-lg text-gray-200 drop-shadow-md">
              MediScribe transforms your healthcare audio recordings into accurate
              text documents using advanced AI technology, saving time and improving documentation efficiency.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <Link to={isLoggedIn ? "/dashboard" : "/register"}>
                <Button className="w-full sm:w-auto bg-medical-teal hover:bg-medical-teal/90 text-white px-8 py-6 text-lg drop-shadow-lg">
                  {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                </Button>
              </Link>
              <Link to={isLoggedIn ? "/dashboard" : "/login"}>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-medical-teal text-medical-teal hover:bg-medical-teal/10 px-8 py-6 text-lg"
                >
                  {isLoggedIn ? "View Transcriptions" : "Log In"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
