
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  isLoggedIn: boolean;
}

const HeroSection = ({ isLoggedIn }: HeroSectionProps) => {
  return (
    <section className="pt-32 pb-20 px-4 md:pt-40 md:pb-32 bg-medical-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-medical-dark via-medical-dark/95 to-transparent z-10"></div>
      
      <div className="container mx-auto max-w-6xl relative z-20">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mt-10 md:mt-0 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Convert Medical Audio to Text with{" "}
              <span className="text-medical-teal">AI Power</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              MediScribe transforms your healthcare audio recordings into accurate 
              text documents using advanced AI technology, saving time and improving documentation efficiency.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to={isLoggedIn ? "/dashboard" : "/register"}>
                <Button className="w-full sm:w-auto bg-medical-teal hover:bg-medical-teal/90 text-white px-8 py-6 text-lg">
                  {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                </Button>
              </Link>
              <Link to={isLoggedIn ? "/dashboard" : "/login"}>
                <Button variant="outline" className="w-full sm:w-auto border-medical-teal text-medical-teal hover:bg-medical-teal/10 px-8 py-6 text-lg">
                  {isLoggedIn ? "View Transcriptions" : "Log In"}
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
            <div className="relative w-full h-[400px] md:h-[500px]">
              <img 
                src="/lovable-uploads/f5c86f40-14f5-467e-9d84-04707e481c9c.png"
                alt="AI Medical Transcription"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-medical-dark via-transparent to-transparent md:hidden"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
