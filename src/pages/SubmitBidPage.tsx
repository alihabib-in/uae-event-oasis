
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Form } from "@/components/ui/form";
import BrandInfoForm from "@/components/bid/BrandInfoForm";
import ContactInfoForm from "@/components/bid/ContactInfoForm";
import EventInfoCard from "@/components/bid/EventInfoCard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useBidSubmission, BidFormValues } from "@/hooks/useBidSubmission";
import VerificationDialog from "@/components/bid/VerificationDialog";

const SubmitBidPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  
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
      businessNature: "",
      companyAddress: "",
      emirate: "",
      contactName: "",
      contactPosition: "",
      email: "",
      phone: "",
      bidAmount: 0,
      message: "",
      website: "",
    },
  });

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

  const onSubmit = async (values: BidFormValues) => {
    await submitBid(values);
    
    // If verification dialog wasn't opened, the submission was successful (skipped verification)
    if (bidId && !isVerificationModalOpen) {
      setTimeout(() => navigate(`/events/${eventId}`), 2000);
    }
  };
  
  const handleVerified = () => {
    handlePhoneVerified(form.getValues("phone"), form.getValues());
    setTimeout(() => navigate(`/events/${eventId}`), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
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
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <BrandInfoForm control={form.control} />
                <ContactInfoForm control={form.control} />
                
                <div className="flex justify-end">
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Bid
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          <div className="lg:col-span-1">
            {event && <EventInfoCard event={event} />}
          </div>
        </div>
      </div>
      
      <VerificationDialog 
        isOpen={isVerificationModalOpen}
        onOpenChange={setIsVerificationModalOpen}
        phone={form.getValues("phone")}
        bidId={bidId}
        onVerified={handleVerified}
      />
      
      <Footer />
    </div>
  );
};

export default SubmitBidPage;
