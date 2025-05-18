
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Check, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BidSuccessAlertProps {
  eventTitle?: string;
}

const BidSuccessAlert = ({ eventTitle }: BidSuccessAlertProps) => {
  return (
    <Alert className="bg-green-50 border-green-200 mb-6">
      <Check className="h-4 w-4 text-green-500" />
      <AlertTitle className="text-green-700">Bid Submitted Successfully!</AlertTitle>
      <AlertDescription className="text-green-600">
        <p className="mb-2">
          Your bid for {eventTitle || "this event"} has been submitted. We'll notify you once it's reviewed.
        </p>
        <Button variant="outline" size="sm" asChild className="mt-2">
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default BidSuccessAlert;
