
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CreditCard, AlertCircle } from "lucide-react";

interface SubscriptionPromptProps {
  onClose: () => void;
}

const SubscriptionPrompt = ({ onClose }: SubscriptionPromptProps) => {
  const navigate = useNavigate();
  
  const handleSubscribe = () => {
    navigate("/subscription");
  };
  
  return (
    <Card className="p-6 bg-white shadow-md">
      <CardHeader className="pb-4 text-center">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-medical-teal/10 flex items-center justify-center">
          <CreditCard className="h-8 w-8 text-medical-teal" />
        </div>
        <CardTitle className="text-xl text-medical-dark">Subscription Required</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-amber-800">
              You've reached the limit of 5 free uploads. To continue using our transcription service, 
              please subscribe to one of our premium plans.
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleSubscribe} 
            className="w-full bg-medical-teal hover:bg-medical-teal/90 text-white"
          >
            View Subscription Plans
          </Button>
          
          <Button 
            onClick={onClose} 
            variant="outline"
            className="w-full text-gray-600"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionPrompt;
