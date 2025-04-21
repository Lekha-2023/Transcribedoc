
import { Card } from "@/components/ui/card";
import { Upload, Mic, FileText } from "lucide-react";

// Section-wide light background image for "How MediScribe Works"
const sectionBgImage =
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80";

const features = [
  {
    icon: Upload,
    title: "Upload Audio",
    description:
      "Upload your medical dictations, patient notes, or any healthcare audio in MP3, WAV, or OGG format.",
  },
  {
    icon: Mic,
    title: "Automated Transcription",
    description:
      "Our advanced AI converts your audio to text with medical terminology accuracy and proper formatting.",
  },
  {
    icon: FileText,
    title: "Download & Share",
    description:
      "Access your transcriptions instantly in multiple formats (TXT, DOC, PDF) or email them directly.",
  },
];

const FeaturesSection = () => {
  return (
    <section
      className="py-20 px-4 bg-white relative"
      style={{
        backgroundImage: `url(${sectionBgImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#F3F3F3", // light background fallback color
      }}
    >
      {/* Overlay for section readability */}
      <div className="absolute inset-0 bg-white/70 pointer-events-none z-0" />
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-medical-dark">
            How MediScribe Works
          </h2>
          <p className="mt-4 text-lg text-medical-dark max-w-2xl mx-auto">
            Our streamlined process converts your medical audio files into accurate transcriptions with just a few clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {features.map((f) => (
            <Card
              key={f.title}
              className="flex flex-col items-center justify-center w-full max-w-[320px] h-[320px] bg-white rounded-2xl shadow-lg border border-border text-center"
              style={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)" }}
            >
              <span className="mb-6 flex items-center justify-center bg-medical-blue/80 rounded-full p-5 shadow-sm">
                <f.icon className="h-12 w-12 text-white" />
              </span>
              <h3 className="text-xl md:text-2xl font-semibold text-medical-dark mb-2">
                {f.title}
              </h3>
              <p className="text-md md:text-lg text-gray-700 font-medium">
                {f.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

