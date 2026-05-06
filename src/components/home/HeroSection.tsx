import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

interface HeroSectionProps {
  isLoggedIn: boolean;
}

const HeroSection = ({ isLoggedIn }: HeroSectionProps) => {
  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[60vh] py-12 flex items-center justify-center select-none">
      {/* Background image with lighter overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage:
            'url("/lovable-uploads/3d7ea3fa-8161-4bda-9b4e-f6aafcb1946c.png")',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-medical-dark/60 via-medical-dark/45 to-medical-blue/20 pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-20 flex items-center justify-center">
        <div className="text-center max-w-3xl px-4 mt-[30px]">
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-md">
            Transform Clinical Audio Into Accurate Medical Documentation
          </h1>
          <h2 className="text-lg md:text-xl text-medical-teal mt-3 font-semibold">
            Empowering Healthcare with AI-Driven Transcription
          </h2>
          <p className="mt-4 text-sm md:text-base text-gray-100 drop-shadow">
            TranscribeDoc uses advanced AI to convert medical dictations and patient encounter
            recordings into precise, HIPAA-compliant text — reducing documentation burden so
            you can focus on patient care.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-white justify-center">
            <div className="bg-white/15 p-3 rounded-lg backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-center">Streamlined Clinical Workflows</h3>
            </div>
            <div className="bg-white/15 p-3 rounded-lg backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-center">Medical-Grade Transcriptions</h3>
            </div>
            <div className="bg-white/15 p-3 rounded-lg backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-center">Secure, Compliant & Efficient</h3>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Button
              onClick={scrollToDemo}
              className="bg-medical-teal hover:bg-medical-teal/90 text-white px-6 py-4 text-base drop-shadow"
            >
              Try Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
