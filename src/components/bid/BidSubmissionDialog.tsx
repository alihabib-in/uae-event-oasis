
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import EventInfoCard from "@/components/bid/EventInfoCard";
import BrandInfoForm from "@/components/bid/BrandInfoForm";
import ContactInfoForm from "@/components/bid/ContactInfoForm";
import VerificationDialog from "@/components/bid/VerificationDialog";
import { useBidSubmission, BidFormValues } from "@/hooks/useBidSubmission";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BidSubmissionDialogProps {
  eventId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const BidSubmissionDialog = ({ eventId, isOpen, onOpenChange }: BidSubmissionDialogProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    formSchema,
    submitBid,
    isSubmitting,
    bidId,
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    handlePhoneVerified
  } = useBidSubmission(eventId);

  const form = useForm<BidFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: "",
      companyAddress: "",
      emirate: "",
      businessNature: "",
      contactName: "",
      contactPosition: "",
      phone: "",
      email: "",
      bidAmount: 0,
      message: "",
      website: "",
    },
  });

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (!isOpen) return;
        
        console.log("Fetching event details for ID:", eventId);
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (error) {
          console.error("Error fetching event:", error);
          throw error;
        }
        
        console.log("Event data fetched:", data);
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
    const result = await submitBid(values);
    if (result && result.bidId) { // Check if result exists and has bidId
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
    onOpenChange(false); // Close the dialog after submission
  };

  const handleVerified = () => {
    if (bidId) { // Check if bidId exists before using it
      handlePhoneVerified(form.getValues("phone"), form.getValues());
    }
  };

  // Redirect to login if not authenticated
  const handleSubmitClick = () => {
    if (!user) {
      onOpenChange(false);
      navigate('/login');
      toast.info("Please login to submit a bid");
      return;
    }
    
    form.handleSubmit(onSubmit)();
  };

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
  
  // Transform eventDetails to match EventInfoCard's expected format
  const transformedEventData = {
    date: eventDetails.date,
    venue: eventDetails.venue || "TBA",
    location: eventDetails.location,
    attendees: eventDetails.attendees || 0,
    min_bid: eventDetails.min_bid || 0,
    max_bid: eventDetails.max_bid || 0
  };

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

          <div className="space-y-4 py-4">
            <EventInfoCard event={transformedEventData} />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <BrandInfoForm control={form.control} />
                <ContactInfoForm control={form.control} />

                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="button" disabled={isSubmitting} onClick={handleSubmitClick}>
                    {isSubmitting ? "Submitting..." : "Submit Bid"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <VerificationDialog 
        isOpen={isVerificationModalOpen}
        onOpenChange={setIsVerificationModalOpen}
        phone={form.getValues("phone")}
        bidId={bidId || ""} // Provide empty string as fallback
        onVerified={handleVerified}
      />
    </>
  );
};

export default BidSubmissionDialog;
