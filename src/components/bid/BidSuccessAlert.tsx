
import React from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";

interface BidSuccessAlertProps {
  eventTitle?: string;
}

const BidSuccessAlert = ({ eventTitle }: BidSuccessAlertProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-950/30">
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        <AlertTitle className="ml-2 text-green-800 dark:text-green-300">
          Bid Submitted Successfully
        </AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-400 ml-7">
          Your bid for {eventTitle || "this event"} has been submitted successfully. 
          We will review your bid and get back to you soon.
        </AlertDescription>
      </Alert>
      
      <Button 
        className="w-full"
        onClick={() => navigate("/")}
      >
        <Home className="mr-2 h-4 w-4" />
        Return to Home
      </Button>
    </div>
  );
};

export default BidSuccessAlert;
