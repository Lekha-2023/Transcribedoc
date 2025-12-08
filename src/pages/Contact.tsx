import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ContactForm } from "@/components/contact/ContactForm";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-medical-dark">Contact Us</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.
            </p>
          </div>

          <ContactForm />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;