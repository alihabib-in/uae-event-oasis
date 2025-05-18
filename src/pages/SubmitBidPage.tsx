
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, LogIn } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventInfoCard from "@/components/bid/EventInfoCard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useBidSubmission } from "@/hooks/useBidSubmission";
import VerificationDialog from "@/components/bid/VerificationDialog";
import { useAuth } from "@/components/AuthProvider";
import BidSuccessAlert from "@/components/bid/BidSuccessAlert";
import BidForm from "@/components/bid/BidForm";

const SubmitBidPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    formSchema,
    submitBid,
    isSubmitting,
    bidId,
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    handlePhoneVerified,
    submissionSuccess
  } = useBidSubmission(eventId);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (error) throw error;
        if (!data) {
          toast.error("Event not found");
          navigate("/events");
          return;
        }

        setEvent(data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load event");
        navigate("/events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, navigate]);

  const onSubmit = async (values: any) => {
    const result = await submitBid(values);
    
    // If submission was successful and verification wasn't needed or if verification is complete
    if (result?.isSuccess && !isVerificationModalOpen) {
      setTimeout(() => navigate(`/events/${eventId}`), 2000);
    }
  };
  
  const handleVerified = (phone: string, formValues: any) => {
    handlePhoneVerified(phone, formValues);
    setTimeout(() => navigate(`/events/${eventId}`), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to login page if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <h2 className="text-3xl font-extrabold">Authentication Required</h2>
              <p className="mt-2 text-muted-foreground">
                You need to be signed in to submit a bid
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <Button 
                onClick={() => navigate("/login")} 
                size="lg"
                className="w-full"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto" 
                  onClick={() => navigate("/login")}
                >
                  Sign up
                </Button>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container py-6 flex-1">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(`/events/${eventId}`)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Event
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Submit Sponsorship Bid</h1>
              <p className="text-muted-foreground mt-2">
                Complete this form to submit your bid for sponsoring this event
              </p>
            </div>
            
            {submissionSuccess ? (
              <BidSuccessAlert eventTitle={event?.title} />
            ) : (
              <BidForm 
                formSchema={formSchema}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
          
          <div className="lg:col-span-1">
            {event && <EventInfoCard event={event} />}
          </div>
        </div>
      </div>
      
      <VerificationDialog 
        isOpen={isVerificationModalOpen}
        onOpenChange={setIsVerificationModalOpen}
        phone={""}
        bidId={bidId || ""}
        onVerified={() => handleVerified("", {})}
      />
      
      <Footer />
    </div>
  );
};

export default SubmitBidPage;
