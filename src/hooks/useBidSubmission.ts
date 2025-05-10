
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

// Update the schema to use z.coerce.number() for numeric fields
const formSchema = z.object({
  brandName: z.string().min(2, {
    message: "Brand name must be at least 2 characters.",
  }),
  companyAddress: z.string().min(5, {
    message: "Company address must be at least 5 characters.",
  }),
  emirate: z.string({
    required_error: "Please select an emirate.",
  }),
  businessNature: z.string().min(2, {
    message: "Nature of business must be at least 2 characters.",
  }),
  contactName: z.string().min(2, {
    message: "Contact person name must be at least 2 characters.",
  }),
  contactPosition: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  phone: z.string().min(9, {
    message: "Please enter a valid phone number.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bidAmount: z.coerce.number().positive({
    message: "Bid amount must be a positive number",
  }),
  message: z.string().optional(),
  website: z.string().url({
    message: "Please enter a valid website URL",
  }).optional().or(z.literal('')),
});

export type BidFormValues = z.infer<typeof formSchema>;

export const useBidSubmission = (eventId: string | undefined) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidId, setBidId] = useState<string | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const submitBid = async (values: BidFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (!user) {
        toast.error("You must be logged in to submit a bid");
        navigate("/login");
        return;
      }
      
      if (!eventId) {
        toast.error("No event ID provided");
        navigate("/events");
        return;
      }
      
      console.log("Submitting bid with values:", values);
      
      // Insert the bid into the database
      const { data, error } = await supabase
        .from('bids')
        .insert([
          {
            event_id: eventId,
            brand_name: values.brandName,
            company_address: values.companyAddress,
            emirate: values.emirate,
            business_nature: values.businessNature,
            contact_name: values.contactName,
            contact_position: values.contactPosition,
            phone: values.phone,
            email: values.email,
            bid_amount: values.bidAmount,
            message: values.message || null,
            website: values.website || null,
            user_id: user.id,
            status: 'pending',
          },
        ])
        .select();
      
      if (error) {
        console.error("Error inserting bid:", error);
        throw error;
      }
      
      console.log("Bid submitted successfully:", data);
      
      // Store the bid ID for verification
      if (data && data.length > 0) {
        setBidId(data[0].id);
        
        // Show verification modal
        setIsVerificationModalOpen(true);
      } else {
        throw new Error("No data returned after inserting bid");
      }
    } catch (error: any) {
      console.error("Bid submission error:", error);
      toast.error(error.message || "Failed to submit bid");
      setIsSubmitting(false);
    }
  };

  const handlePhoneVerified = async (phone: string, formValues: BidFormValues) => {
    try {
      // Close the verification modal
      setIsVerificationModalOpen(false);
      
      if (!bidId) {
        throw new Error("Missing bid ID");
      }
      
      console.log("Phone verified for bid ID:", bidId);

      // Update the bid to mark phone as verified
      await supabase
        .from('bids')
        .update({
          phone_verified: true
        })
        .eq('id', bidId);
      
      // Send admin notification
      const { data: { session } } = await supabase.auth.getSession();
      
      try {
        await fetch('https://uqtyatwvjmsgzywifhvc.supabase.co/functions/v1/send-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || ''}`
          },
          body: JSON.stringify({
            type: "bid",
            data: {
              bidId,
              eventId,
              brandName: formValues.brandName,
              contactName: formValues.contactName,
              email: formValues.email,
              phone,
              bidAmount: formValues.bidAmount,
            }
          }),
        });
      } catch (notificationError) {
        console.error("Error sending notification:", notificationError);
        // Continue execution even if notification fails
      }
      
      toast.success("Bid submitted successfully! The event organizer will be in touch.");
      
      // Navigate back to event details
      setTimeout(() => {
        navigate(`/events/${eventId}`);
      }, 1500);
    } catch (error: any) {
      console.error("Error completing bid submission:", error);
      toast.error(error.message || "Failed to complete submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formSchema,
    submitBid,
    isSubmitting,
    bidId,
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    handlePhoneVerified
  };
};
