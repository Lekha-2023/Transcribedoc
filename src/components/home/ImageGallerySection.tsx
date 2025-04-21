
import { GalleryHorizontal } from "lucide-react";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&q=80",
    alt: "Woman doctor using laptop for telehealth",
    caption: "Telehealth: Seamless patient documentation from anywhere"
  },
  {
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    alt: "Doctor entering notes on laptop",
    caption: "Instant transcription for fast clinical note entry"
  },
  {
    src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80",
    alt: "Medical professional reviewing radiology reports on a laptop",
    caption: "Effortless reporting for healthcare teams"
  },
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    alt: "AI medical technology on screen",
    caption: "AI-powered accuracy for complex medical language"
  }
];

const ImageGallerySection = () => {
  return (
    <section className="py-20 px-4 bg-medical-gray">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14 flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-medical-teal/10 mb-4">
            <GalleryHorizontal className="h-6 w-6 text-medical-teal" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-medical-dark">See MediScribe in Action</h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl">
            Secure, modern, and versatile – explore how healthcare professionals use MediScribe to streamline documentation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="flex flex-col group shadow-md bg-white rounded-lg overflow-hidden card-hover h-full">
              <img
                src={img.src}
                alt={img.alt}
                className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                width={350}
                height={192}
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-sm text-gray-700 text-center">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGallerySection;

