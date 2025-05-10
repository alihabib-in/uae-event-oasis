
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import EventInfoCard from "@/components/bid/EventInfoCard";
import BrandInfoForm from "@/components/bid/BrandInfoForm";
import ContactInfoForm from "@/components/bid/ContactInfoForm";
import VerificationDialog from "@/components/bid/VerificationDialog";
import { useBidSubmission, BidFormValues } from "@/hooks/useBidSubmission";

const SubmitBidPage = () => {
  const { eventId } = useParams();
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
        navigate("/events");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId, navigate]);

  const onSubmit = async (values: BidFormValues) => {
    await submitBid(values);
  };

  const handleVerified = () => {
    handlePhoneVerified(form.getValues("phone"), form.getValues());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading event details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!eventDetails) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Event not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-light tracking-tight mb-2">Submit Your Bid</h1>
            <p className="text-muted-foreground">
              Submit your sponsorship bid for <span className="font-medium">{eventDetails.title}</span>
            </p>
          </div>

          <div className="space-y-8">
            <EventInfoCard eventDetails={eventDetails} />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <BrandInfoForm control={form.control} />
                <ContactInfoForm control={form.control} />

                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/events/${eventId}`)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Bid"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>

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
