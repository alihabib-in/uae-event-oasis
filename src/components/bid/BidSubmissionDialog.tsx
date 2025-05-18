
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useBidSubmission, BidFormValues } from "@/hooks/useBidSubmission";
import VerificationDialog from "@/components/bid/VerificationDialog";
import BidSubmissionContent from "./BidSubmissionContent";

interface BidSubmissionDialogProps {
  eventId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle?: string;
}

const BidSubmissionDialog = ({ eventId, isOpen, onOpenChange, eventTitle }: BidSubmissionDialogProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formValues, setFormValues] = useState<BidFormValues | null>(null);
  
  const {
    formSchema,
    submitBid,
    isSubmitting,
    bidId,
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    handlePhoneVerified,
    submissionSuccess,
    setSubmissionSuccess
  } = useBidSubmission(eventId);

  // Reset form and success state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSubmissionSuccess(false);
      setFormValues(null);
    }
  }, [isOpen, setSubmissionSuccess]);

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (!isOpen) return;
        
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (error) {
          console.error("Error fetching event:", error);
          throw error;
        }
        
        setEventDetails(data);
      } catch (error: any) {
        console.error("Event fetch error:", error.message);
        toast.error("Error fetching event details");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && eventId) {
      fetchEventDetails();
    }
  }, [isOpen, eventId]);

  const onSubmit = async (values: BidFormValues) => {
    if (!user) {
      onOpenChange(false);
      navigate('/login');
      toast.info("Please login to submit a bid");
      return;
    }
    
    // Store form values for later use in verification
    setFormValues(values);
    
    const result = await submitBid(values);
    
    if (result?.isDuplicate) {
      // Do not close dialog for duplicates, user should see the error
      return;
    }
    
    if (result && result.bidId && !isVerificationModalOpen) {
      // Send notification to admins about the new bid
      try {
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "bid_submission",
            data: {
              bidId: result.bidId,
              eventName: eventDetails.title,
              brandName: values.brandName,
              contactName: values.contactName,
              contactEmail: values.email,
              bidAmount: values.bidAmount
            }
          },
        });
      } catch (error) {
        console.error("Failed to send admin notification:", error);
      }
    }
  };

  const handleVerified = () => {
    if (bidId && formValues) {
      // Pass the saved form values instead of an empty object
      handlePhoneVerified("", formValues);
    }
  };

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to submit a bid.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <p className="text-muted-foreground text-center">
              Please login to your account or create a new one to continue with bid submission.
            </p>
            <Button onClick={() => {
              onOpenChange(false);
              navigate('/login');
            }} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Login or Sign Up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isLoading || !eventDetails) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4">
            <p>Loading event details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit Your Bid</DialogTitle>
            <DialogDescription>
              Submit your sponsorship bid for <span className="font-medium">{eventDetails.title}</span>
            </DialogDescription>
          </DialogHeader>

          <BidSubmissionContent 
            eventDetails={eventDetails}
            submissionSuccess={submissionSuccess}
            formSchema={formSchema}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>

      <VerificationDialog 
        isOpen={isVerificationModalOpen}
        onOpenChange={setIsVerificationModalOpen}
        phone={""}
        bidId={bidId || ""}
        onVerified={handleVerified}
      />
    </>
  );
};

export default BidSubmissionDialog;
