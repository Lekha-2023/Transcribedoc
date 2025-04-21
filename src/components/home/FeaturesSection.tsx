
import { Card } from "@/components/ui/card";
import { Upload, Mic, FileText } from "lucide-react";

// Healthcare/pastel background images for each card
const featureBgImages = [
  {
    src: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=400&q=80", // Coding/doctor
    alt: "Medical staff working at computers",
  },
  {
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80", // Doctor with laptop
    alt: "Doctor dictating notes into laptop",
  },
  {
    src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&q=80", // Telehealth consult
    alt: "Healthcare worker preparing report",
  },
];

const features = [
  {
    icon: Upload,
    title: "Upload Audio",
    description: "Upload your medical dictations, patient notes, or any healthcare audio in MP3, WAV, or OGG format.",
    imgIdx: 0,
  },
  {
    icon: Mic,
    title: "Automated Transcription",
    description: "Our advanced AI converts your audio to text with medical terminology accuracy and proper formatting.",
    imgIdx: 1,
  },
  {
    icon: FileText,
    title: "Download & Share",
    description: "Access your transcriptions instantly in multiple formats (TXT, DOC, PDF) or email them directly.",
    imgIdx: 2,
  },
];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="relative flex flex-col items-center justify-center card-hover shadow-md"
              style={{
                width: '305px',
                height: '305px',
                minWidth: '200px',
                minHeight: '200px',
                borderRadius: '50%',
                backgroundImage: `url(${featureBgImages[f.imgIdx].src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 6px 24px 0 rgba(30, 174, 219, 0.08)',
                overflow: 'hidden',
              }}
            >
              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-medical-dark/70 via-medical-dark/25 to-transparent rounded-full pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
                <span className="mb-5 flex items-center justify-center bg-medical-blue/80 rounded-full p-4 border-4 border-white shadow-lg">
                  <f.icon className="h-10 w-10 text-white" />
                </span>
                <h3 className="text-xl md:text-2xl font-semibold text-white drop-shadow mb-2">{f.title}</h3>
                <p className="text-md md:text-lg text-blue-50 drop-shadow-lg font-medium">{f.description}</p>
              </div>
              {/* For accessibility, visually hidden alt text */}
              <span className="sr-only">{featureBgImages[f.imgIdx].alt}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
