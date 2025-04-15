
import { Phone, Mail, HelpCircle } from "lucide-react";

export const ContactInfo = () => {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <div className="mx-auto h-12 w-12 bg-medical-teal/10 rounded-full flex items-center justify-center mb-4">
          <Phone className="text-medical-teal h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-medical-dark">Phone Support</h3>
        <p className="mt-2 text-gray-600">+1 (555) 123-4567</p>
        <p className="mt-1 text-gray-500">Mon-Fri: 9am - 5pm EST</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <div className="mx-auto h-12 w-12 bg-medical-teal/10 rounded-full flex items-center justify-center mb-4">
          <Mail className="text-medical-teal h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-medical-dark">Email</h3>
        <p className="mt-2 text-gray-600">support@mediscribe.com</p>
        <p className="mt-1 text-gray-500">24/7 Response</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <div className="mx-auto h-12 w-12 bg-medical-teal/10 rounded-full flex items-center justify-center mb-4">
          <HelpCircle className="text-medical-teal h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-medical-dark">Help Center</h3>
        <p className="mt-2 text-gray-600">Visit our knowledge base</p>
        <a href="#" className="mt-1 text-medical-teal hover:underline">support.mediscribe.com</a>
      </div>
    </div>
  );
};
