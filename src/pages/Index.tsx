
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, FileText, Lock, Upload, BarChart4, ArrowRight } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  const isLoggedIn = isAuthenticated();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} />
      
      {/* Hero Section */}
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
                  <source src="https://cdn.pixabay.com/vimeo/498889260/medical-70494.mp4?width=640&hash=7b7ffeb73d0f6dcaf61fcc4ffd9734fed4af7e39" type="video/mp4" />
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
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-medical-dark">How MediScribe Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our streamlined process converts your medical audio files into accurate transcriptions with just a few clicks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 bg-white shadow-md hover:shadow-xl transition-shadow card-hover">
              <div className="h-12 w-12 bg-medical-teal/10 flex items-center justify-center rounded-lg mb-5">
                <Upload className="h-6 w-6 text-medical-teal" />
              </div>
              <h3 className="text-xl font-semibold text-medical-dark mb-3">Upload Audio</h3>
              <p className="text-gray-600">
                Upload your medical dictations, patient notes, or any healthcare audio in MP3, WAV, or OGG format.
              </p>
            </Card>
            
            <Card className="p-6 bg-white shadow-md hover:shadow-xl transition-shadow card-hover">
              <div className="h-12 w-12 bg-medical-teal/10 flex items-center justify-center rounded-lg mb-5">
                <Mic className="h-6 w-6 text-medical-teal" />
              </div>
              <h3 className="text-xl font-semibold text-medical-dark mb-3">Automated Transcription</h3>
              <p className="text-gray-600">
                Our advanced AI converts your audio to text with medical terminology accuracy and proper formatting.
              </p>
            </Card>
            
            <Card className="p-6 bg-white shadow-md hover:shadow-xl transition-shadow card-hover">
              <div className="h-12 w-12 bg-medical-teal/10 flex items-center justify-center rounded-lg mb-5">
                <FileText className="h-6 w-6 text-medical-teal" />
              </div>
              <h3 className="text-xl font-semibold text-medical-dark mb-3">Download & Share</h3>
              <p className="text-gray-600">
                Access your transcriptions instantly in multiple formats (TXT, DOC, PDF) or email them directly.
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 px-4 bg-medical-gray">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-medical-dark">Why Choose MediScribe</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Designed specifically for healthcare professionals to improve documentation workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex bg-white rounded-lg p-6 shadow-md">
              <div className="mr-5">
                <div className="h-10 w-10 bg-medical-blue/10 flex items-center justify-center rounded-lg">
                  <Clock className="h-5 w-5 text-medical-blue" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-medical-dark mb-2">Time Savings</h3>
                <p className="text-gray-600">
                  Reduce documentation time by up to 75% compared to manual transcription.
                </p>
              </div>
            </div>
            
            <div className="flex bg-white rounded-lg p-6 shadow-md">
              <div className="mr-5">
                <div className="h-10 w-10 bg-medical-blue/10 flex items-center justify-center rounded-lg">
                  <Lock className="h-5 w-5 text-medical-blue" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-medical-dark mb-2">HIPAA Compliant</h3>
                <p className="text-gray-600">
                  Secure platform designed with healthcare privacy regulations in mind.
                </p>
              </div>
            </div>
            
            <div className="flex bg-white rounded-lg p-6 shadow-md">
              <div className="mr-5">
                <div className="h-10 w-10 bg-medical-blue/10 flex items-center justify-center rounded-lg">
                  <BarChart4 className="h-5 w-5 text-medical-blue" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-medical-dark mb-2">99.5% Accuracy</h3>
                <p className="text-gray-600">
                  Advanced algorithms trained on medical terminology for precise results.
                </p>
              </div>
            </div>
            
            <div className="flex bg-white rounded-lg p-6 shadow-md">
              <div className="mr-5">
                <div className="h-10 w-10 bg-medical-blue/10 flex items-center justify-center rounded-lg">
                  <FileText className="h-5 w-5 text-medical-blue" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-medical-dark mb-2">Multiple Formats</h3>
                <p className="text-gray-600">
                  Download your transcriptions in TXT, DOC, or PDF formats for easy integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-medical-teal to-medical-blue text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Documentation Process?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who save hours each week with MediScribe's audio-to-text solution.
          </p>
          <Link to={isLoggedIn ? "/dashboard" : "/register"}>
            <Button className="bg-white text-medical-teal hover:bg-white/90 hover:text-medical-teal/90 px-8 py-6 text-lg shadow-lg">
              {isLoggedIn ? "Go to Dashboard" : "Start Your Free Trial"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Placeholder component for the Clock icon, replace with actual import if available
const Clock = ({ className }: { className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
};

export default Index;
