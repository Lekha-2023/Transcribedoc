import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[85vh] flex items-center justify-center select-none">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("/lovable-uploads/3d7ea3fa-8161-4bda-9b4e-f6aafcb1946c.png")',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-medical-dark/90 via-medical-dark/80 to-medical-blue/40 pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-20 h-full flex items-center justify-center">
        <div className="text-center max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
            Transform Clinical Audio Into Accurate Medical Documentation
          </h1>
          <h2 className="text-2xl md:text-3xl text-medical-teal mt-4 font-semibold">
            Empowering Healthcare with AI-Driven Transcription
          </h2>
          <p className="mt-6 text-lg text-gray-200 drop-shadow-md">
            Trascribe Doc harnesses the power of advanced AI to convert medical dictations 
            and patient encounter recordings into precise, HIPAA-compliant text. Designed 
            for healthcare providers, our solution reduces documentation burden, enhances 
            EHR accuracy, and lets you focus more on patient care.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-white justify-center">
            <div className="bg-medical-teal/20 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2 text-center">Streamlined Clinical Workflows</h3>
            </div>
            <div className="bg-medical-teal/20 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2 text-center">Trusted Medical-Grade Transcriptions</h3>
            </div>
            <div className="bg-medical-teal/20 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2 text-center">Secure, Compliant, and Efficient</h3>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={scrollToDemo}
              className="bg-medical-teal hover:bg-medical-teal/90 text-white px-8 py-6 text-lg drop-shadow-lg"
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