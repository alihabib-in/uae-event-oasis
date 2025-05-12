
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOtpSettings } from "@/components/AuthProvider";

export type BidFormValues = {
  brandName: string;
  companyAddress: string;
  emirate: string;
  businessNature: string;
  contactName: string;
  contactPosition: string;
  phone: string;
  email: string;
  bidAmount: number;
  message: string;
  website: string;
};

export type BidSubmissionResult = {
  bidId: string | null;
};

export const useBidSubmission = (eventId: string | undefined) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidId, setBidId] = useState<string | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const { requireOtp } = useOtpSettings();

  const formSchema = z.object({
    brandName: z.string().min(2, "Brand name is required"),
    companyAddress: z.string().min(2, "Company address is required"),
    emirate: z.string().min(2, "Emirate is required"),
    businessNature: z.string().min(2, "Business nature is required"),
    contactName: z.string().min(2, "Contact name is required"),
    contactPosition: z.string().min(2, "Contact position is required"),
    phone: z.string().min(9, "Valid phone number is required"),
    email: z.string().email("Valid email is required"),
    bidAmount: z.coerce.number().positive("Bid amount must be a positive number"),
    message: z.string().optional(),
    website: z.string().optional(),
  });

  const submitBid = async (values: BidFormValues): Promise<BidSubmissionResult> => {
    if (!eventId) {
      toast.error("No event selected");
      return { bidId: null };
    }

    setIsSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      const bidData = {
        event_id: eventId,
        user_id: userId || null,
        brand_name: values.brandName,
        company_address: values.companyAddress,
        emirate: values.emirate,
        business_nature: values.businessNature,
        contact_name: values.contactName,
        phone: values.phone,
        email: values.email,
        bid_amount: values.bidAmount,
        message: values.message || null,
        status: "pending"
      };

      // Check if OTP verification is required
      if (requireOtp) {
        // Insert the bid and get the verification code
        const { data: bidResult, error: bidError } = await supabase
          .from('bids')
          .insert([bidData])
          .select();

        if (bidError) throw bidError;

        if (bidResult && bidResult.length > 0) {
          setBidId(bidResult[0].id);
          setIsVerificationModalOpen(true);
          return { bidId: bidResult[0].id };
        }
      } else {
        // Skip OTP verification and insert the bid with phone_verified=true
        const { data: bidResult, error: bidError } = await supabase
          .from('bids')
          .insert([{
            ...bidData,
            phone_verified: true
          }])
          .select();

        if (bidError) throw bidError;

        if (bidResult && bidResult.length > 0) {
          toast.success("Your bid has been submitted successfully!");
          return { bidId: bidResult[0].id };
        }
      }

      return { bidId: null };
    } catch (error: any) {
      console.error("Error submitting bid:", error);
      toast.error(error.message || "Failed to submit bid");
      setIsSubmitting(false);
      return { bidId: null };
    }
  };

  const handlePhoneVerified = async (phone: string, formValues: BidFormValues) => {
    setIsVerificationModalOpen(false);
    
    try {
      // Update the bid record to mark phone as verified
      if (bidId) {
        const { error } = await supabase
          .from('bids')
          .update({ phone_verified: true })
          .eq('id', bidId);
        
        if (error) throw error;
        
        toast.success("Your bid has been submitted successfully!");
        
        // Send notification to admins
        try {
          await supabase.functions.invoke('send-notification', {
            body: {
              type: 'new_bid',
              data: {
                eventId,
                brandName: formValues.brandName,
                bidAmount: formValues.bidAmount,
                contactName: formValues.contactName,
                email: formValues.email,
                phone: formValues.phone
              }
            }
          });
        } catch (notificationError) {
          console.error("Failed to send notification:", notificationError);
        }
      }
    } catch (error: any) {
      console.error("Error updating bid verification:", error);
      toast.error(error.message || "Verification failed");
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
