
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  isLoggedIn: boolean;
}

const CTASection = ({ isLoggedIn }: CTASectionProps) => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-medical-teal to-medical-blue text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Documentation Process?</h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of healthcare professionals who save hours each week with MediScribe's audio-to-text solution.
        </p>
        <Link to={isLoggedIn ? "/dashboard" : "/register"}>
          <Button className="bg-white text-medical-teal hover:bg-white/90 hover:text-medical-teal/90 px-8 py-6 text-lg shadow-lg">
            {isLoggedIn ? "Go to Dashboard" : "Start Your Free Trial"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
