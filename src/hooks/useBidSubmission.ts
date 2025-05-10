
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

// Create a schema for bid submission
const bidFormSchema = z.object({
  brandName: z.string().min(2, { message: "Brand name is required" }),
  companyAddress: z.string().min(2, { message: "Company address is required" }),
  emirate: z.string().min(1, { message: "Emirate is required" }),
  businessNature: z.string().min(2, { message: "Business nature is required" }),
  contactName: z.string().min(2, { message: "Contact name is required" }),
  contactPosition: z.string().optional(),
  phone: z.string().min(9, { message: "Valid phone number is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  bidAmount: z.coerce.number().positive({ message: "Bid amount must be positive" }),
  message: z.string().optional(),
  website: z.string().optional(),
  user_id: z.string().optional(), // Make user_id optional since it's set in the hook
});

export type BidFormValues = z.infer<typeof bidFormSchema>;

export const useBidSubmission = (eventId?: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidId, setBidId] = useState<string | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const { user } = useAuth();

  const submitBid = async (values: BidFormValues) => {
    if (!eventId) {
      toast.error("No event ID provided");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting bid with values:", {...values, event_id: eventId, user_id: user?.id});

      // Format the bid data to match the database schema
      const bidData = {
        brand_name: values.brandName,
        company_address: values.companyAddress,
        emirate: values.emirate,
        business_nature: values.businessNature,
        contact_name: values.contactName,
        phone: values.phone,
        email: values.email,
        bid_amount: values.bidAmount,
        message: values.message,
        event_id: eventId,
        user_id: user?.id,  // Ensure user_id is set from auth context
      };

      // Insert into bids table
      const { data, error } = await supabase
        .from("bids")
        .insert([bidData])
        .select();

      if (error) {
        console.error("Error submitting bid:", error);
        throw error;
      }

      console.log("Bid submitted successfully:", data);

      if (data && data.length > 0) {
        setBidId(data[0].id);
        setIsVerificationModalOpen(true);
        toast.success("Bid submitted! Please verify your phone number.");
      }
    } catch (error: any) {
      console.error("Bid submission error:", error);
      toast.error(error.message || "Failed to submit bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneVerified = async (phone: string, formValues: BidFormValues) => {
    try {
      // Send admin notification (optional)
      try {
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "bid",
            data: {
              eventId,
              bidId,
              brandName: formValues.brandName,
              contactName: formValues.contactName,
              bidAmount: formValues.bidAmount,
            }
          },
        });
      } catch (error) {
        console.error("Failed to send notification:", error);
        // Continue even if notification fails
      }
      
      toast.success("Your bid has been submitted successfully!");
      setIsVerificationModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to complete submission");
    }
  };

  return {
    formSchema: bidFormSchema,
    submitBid,
    isSubmitting,
    bidId,
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    handlePhoneVerified,
  };
};
