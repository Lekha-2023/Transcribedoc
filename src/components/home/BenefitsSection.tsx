
import { Clock, Lock, BarChart4, FileText, BadgeDollarSign } from "lucide-react";

// Circular healthcare images for each benefit
const benefitImages = [
  {
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    alt: "Healthcare professionals at laptops",
  },
  {
    src: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&q=80",
    alt: "Medical security and technology",
  },
  {
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    alt: "Doctor using laptop",
  },
  {
    src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&q=80",
    alt: "Telehealth consultation",
  },
  {
    src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80",
    alt: "Healthcare cost savings concept",
  },
];

const benefitData = [
  {
    icon: Clock,
    title: "Time Savings",
    description: "Reduce documentation time by up to 75% compared to manual transcription.",
    imgIdx: 0,
  },
  {
    icon: Lock,
    title: "HIPAA Compliant",
    description: "Secure platform designed with healthcare privacy regulations in mind.",
    imgIdx: 1,
  },
  {
    icon: BarChart4,
    title: "99.5% Accuracy",
    description: "Advanced algorithms trained on medical terminology for precise results.",
    imgIdx: 2,
  },
  {
    icon: FileText,
    title: "Multiple Formats",
    description: "Download your transcriptions from your gmail.",
    imgIdx: 3,
  },
  {
    icon: BadgeDollarSign,
    title: "Cost Affordability",
    description: "Enjoy competitive and transparent pricing designed to make powerful transcription accessible to all healthcare professionals.",
    imgIdx: 4,
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-12 px-4 bg-medical-gray">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-medical-dark">Why Choose TranscribeDoc</h2>
          <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">
            Designed specifically for healthcare professionals to improve documentation workflow.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {benefitData.map((benefit) => (
            <div
              key={benefit.title}
              className="relative flex flex-col items-center justify-center card-hover"
              style={{
                width: '230px',
                height: '230px',
                borderRadius: '50%',
                backgroundImage: `url(${benefitImages[benefit.imgIdx].src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 4px 16px 0 rgba(30, 174, 219, 0.10)',
                overflow: 'hidden',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-medical-dark/45 via-medical-dark/30 to-medical-blue/10 rounded-full pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <span className="mb-3 flex items-center justify-center bg-medical-blue/80 rounded-full p-2.5 border-2 border-white shadow">
                  <benefit.icon className="h-6 w-6 text-white" />
                </span>
                <h3 className="text-base font-semibold text-white drop-shadow mb-1">{benefit.title}</h3>
                <p className="text-xs text-blue-50 drop-shadow font-medium leading-snug">{benefit.description}</p>
              </div>
              <span className="sr-only">{benefitImages[benefit.imgIdx].alt}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
