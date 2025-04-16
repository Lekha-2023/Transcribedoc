
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ClearDataButtonProps {
  onClick: () => void;
}

const ClearDataButton = ({ onClick }: ClearDataButtonProps) => {
  return (
    <Button 
      variant="outline" 
      className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
      onClick={onClick}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Clear All Saved Login Data
    </Button>
  );
};

export default ClearDataButton;
