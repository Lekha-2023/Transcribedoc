
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  isLoggedIn: boolean;
}

const HeroSection = ({ isLoggedIn }: HeroSectionProps) => {
  return (
    <section className="pt-32 pb-20 px-4 md:pt-40 md:pb-32 bg-gradient-to-b from-medical-gray to-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mt-10 md:mt-0 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold text-medical-dark leading-tight">
              Convert Medical Audio to Text <span className="text-medical-teal">Effortlessly</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              MediScribe transforms your healthcare audio recordings into accurate 
              text documents, saving time and improving documentation efficiency.
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
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-medical-teal/20 rounded-lg"></div>
              <video 
                className="w-full h-full object-cover rounded-lg"
                autoPlay 
                muted 
                loop
                playsInline
              >
                <source src="https://player.vimeo.com/external/498889260.sd.mp4?s=fb54d61893689b0acca6fae91f437de4cc0a5793&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-r from-medical-dark/50 to-transparent flex items-center">
                <div className="p-6 text-white max-w-md">
                  <h3 className="text-2xl font-bold mb-2">See how it works</h3>
                  <p className="text-white/90">Upload your audio and get accurate transcriptions in minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
