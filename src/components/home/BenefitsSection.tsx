
import { Clock, Lock, BarChart4, FileText, BadgeDollarSign } from "lucide-react";

const BenefitsSection = () => {
  return (
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
                Download your transcriptions from your gmail.
              </p>
            </div>
          </div>

          {/* Cost Affordability Card */}
          <div className="flex bg-white rounded-lg p-6 shadow-md">
            <div className="mr-5">
              <div className="h-10 w-10 bg-medical-blue/10 flex items-center justify-center rounded-lg">
                <BadgeDollarSign className="h-5 w-5 text-medical-blue" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-medical-dark mb-2">Cost Affordability</h3>
              <p className="text-gray-600">
                Enjoy competitive and transparent pricing designed to make powerful transcription accessible to all healthcare professionals.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
