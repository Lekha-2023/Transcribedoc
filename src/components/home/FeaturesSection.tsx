
import { Card } from "@/components/ui/card";
import { Upload, Mic, FileText } from "lucide-react";

// Light pastel color as background for the entire section (light color requested)
const sectionBgColor = "#F9FAFB"; // very light gray (compatible with Tailwind's gray-50)

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
      className="py-12 px-4 relative"
      style={{ backgroundColor: sectionBgColor }}
    >
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-medical-dark">
            How TranscribeDoc Works
          </h2>
          <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">
            Our streamlined process converts your medical audio files into accurate transcriptions with just a few clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          {features.map((f) => (
            <Card
              key={f.title}
              className="flex flex-col items-center justify-center w-full max-w-[300px] p-6 bg-white rounded-lg shadow-sm border border-border text-center"
            >
              <span className="mb-4 flex items-center justify-center bg-medical-blue/70 rounded-full p-4 shadow-sm">
                <f.icon className="h-8 w-8 text-white" />
              </span>
              <h3 className="text-lg font-semibold text-medical-dark mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-gray-600">
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

