
import { Card } from "@/components/ui/card";
import { Upload, Mic, FileText } from "lucide-react";

const FeaturesSection = () => {
  return (
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
  );
};

export default FeaturesSection;
