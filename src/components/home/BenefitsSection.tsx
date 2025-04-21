
import { Clock, Lock, BarChart4, FileText, BadgeDollarSign } from "lucide-react";

// Define healthcare images for each benefit card
const benefitImages = [
  {
    // Time Savings
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    alt: "Healthcare professionals at laptops",
  },
  {
    // HIPAA Compliant
    src: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&q=80",
    alt: "Medical security and technology",
  },
  {
    // 99.5% Accuracy
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    alt: "Doctor using laptop",
  },
  {
    // Multiple Formats
    src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&q=80",
    alt: "Telehealth consultation",
  },
  {
    // Cost Affordability
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
    <section className="py-20 px-4 bg-medical-gray min-h-[70vh]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-medical-dark">Why Choose MediScribe</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Designed specifically for healthcare professionals to improve documentation workflow.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefitData.map((benefit, idx) => (
            <div
              key={benefit.title}
              className="rounded-2xl shadow-md relative flex flex-col justify-between items-center bg-white overflow-hidden card-hover min-h-80"
              style={{ minHeight: "320px" }}
            >
              {/* Circular background image */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-0">
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white bg-gray-200">
                  <img
                    src={benefitImages[benefit.imgIdx].src}
                    alt={benefitImages[benefit.imgIdx].alt}
                    className="w-full h-full object-cover brightness-90"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-gray-400/10 pointer-events-none" />
                </div>
              </div>
              {/* Card content overlaid */}
              <div className="relative z-10 flex flex-col items-center pt-40 px-6 pb-6 text-center">
                <span className="mb-3 bg-medical-blue/10 rounded-full p-3 flex items-center justify-center border border-medical-blue/10 shadow">
                  <benefit.icon className="h-7 w-7 text-medical-blue" />
                </span>
                <h3 className="text-lg font-semibold text-medical-dark mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-base">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
