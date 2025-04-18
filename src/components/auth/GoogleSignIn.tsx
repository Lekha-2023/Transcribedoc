
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const GoogleSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Get the current URL to use as a base for the redirect
      const redirectURL = `${window.location.origin}/dashboard`;
      console.log("Redirect URL:", redirectURL);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectURL,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error("Google sign in error:", error);
        
        // Handle specific error cases
        if (error.message.includes("provider is not enabled")) {
          setErrorMessage("Google sign-in is not properly configured. Please ensure Google Auth is enabled in your Supabase project.");
          throw new Error("Google sign-in is not enabled. Please contact the administrator to enable Google authentication.");
        }
        
        throw error;
      }
      
      // The actual redirect is handled by Supabase
      console.log("OAuth sign-in initiated:", data);
    } catch (error) {
      console.error("Google sign in error:", error);
      const errorMsg = error instanceof Error ? error.message : "Failed to sign in with Google";
      setErrorMessage(errorMsg);
      toast({
        title: "Google Sign In Failed",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {errorMessage && (
        <div className="mb-4 p-3 border border-red-200 bg-red-50 rounded-md text-sm text-red-600 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Google Sign In Error</p>
            <p>{errorMessage}</p>
            <p className="mt-1 text-xs">
              To resolve this: Make sure Google Auth is enabled in your Supabase project and 
              the correct redirect URL is configured ({window.location.origin}).
            </p>
          </div>
        </div>
      )}
      
      <Button 
        type="button" 
        variant="outline"
        className="w-full border-gray-300 mt-2"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <svg 
              className="w-4 h-4 mr-2" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" 
                fill="#4285F4" 
              />
            </svg>
            Sign up with Google
          </>
        )}
      </Button>
      
      <div className="mt-2 text-center text-xs text-gray-500">
        <p>
          For Google Sign-in to work, it must be enabled in your Supabase project settings.
          <br />
          Ensure the URL {window.location.origin} is in your authorized redirect URLs.
        </p>
      </div>
    </div>
  );
};

export default GoogleSignIn;
