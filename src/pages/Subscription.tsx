import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Subscription = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "$9.99",
      period: "per month",
      features: [
        "Up to 50 transcriptions per month",
        "Standard transcription quality",
        "Email support",
        "Download as TXT"
      ],
      recommended: false,
      stripeLink: "https://buy.stripe.com/test_9AQaHv80a6tmd8I9AA",
      priceId: "price_basic" // This would be your actual Stripe price ID
    },
    {
      id: "professional",
      name: "Professional",
      price: "$19.99",
      period: "per month",
      features: [
        "Up to 200 transcriptions per month",
        "High transcription quality",
        "Priority email support",
        "Download as TXT, DOC, PDF",
        "Speaker identification"
      ],
      recommended: true,
      priceId: "price_pro" // This would be your actual Stripe price ID
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$49.99",
      period: "per month",
      features: [
        "Unlimited transcriptions",
        "Highest transcription quality",
        "24/7 priority support",
        "All download formats",
        "Speaker identification",
        "Custom vocabulary",
        "Team collaboration"
      ],
      recommended: false,
      priceId: "price_enterprise" // This would be your actual Stripe price ID
    }
  ];

  const handleSubscribe = (stripeLink: string) => {
    // Redirect directly to the Stripe checkout link
    window.location.href = stripeLink;
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={true} />
      
      <div className="flex-1 pt-20 pb-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold text-medical-dark mb-4">Choose Your Subscription Plan</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Unlock unlimited transcriptions and premium features with one of our subscription plans.
              Choose the plan that best fits your needs and start transcribing today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`p-6 flex flex-col h-full ${
                  plan.recommended 
                    ? "ring-2 ring-medical-teal relative shadow-lg" 
                    : "border-gray-200 shadow-md"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-medical-teal text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-medical-dark mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-medical-dark">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-medical-teal flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button
                  onClick={() => handleSubscribe(plan.stripeLink)}
                  className={`w-full ${
                    plan.recommended
                      ? "bg-medical-teal hover:bg-medical-teal/90 text-white" 
                      : "bg-medical-blue hover:bg-medical-blue/90 text-white"
                  }`}
                >
                  Subscribe
                </Button>
              </Card>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Button 
              variant="ghost" 
              onClick={handleGoBack} 
              className="text-gray-600"
            >
              Back to Dashboard
            </Button>
          </div>
          
          <div className="mt-8 bg-gray-100 rounded-lg p-4 text-center text-sm text-gray-500">
            <p>
              Subscription payments are securely processed by Stripe. You can cancel your subscription at any time.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Subscription;
