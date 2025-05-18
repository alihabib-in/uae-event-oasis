
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import EventInfoCard from "@/components/bid/EventInfoCard";
import BrandInfoForm from "@/components/bid/BrandInfoForm";
import ContactInfoForm from "@/components/bid/ContactInfoForm";
import BidSuccessAlert from "./BidSuccessAlert";
import { BidFormValues } from "@/hooks/useBidSubmission";

interface BidSubmissionContentProps {
  eventDetails: any;
  submissionSuccess: boolean;
  formSchema: any;
  isSubmitting: boolean;
  onSubmit: (values: BidFormValues) => Promise<void>;
  onCancel: () => void;
}

const BidSubmissionContent = ({
  eventDetails,
  submissionSuccess,
  formSchema,
  isSubmitting,
  onSubmit,
  onCancel,
}: BidSubmissionContentProps) => {
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
    <div className="space-y-4 py-4">
      {submissionSuccess ? (
        <BidSuccessAlert eventTitle={eventDetails.title} />
      ) : (
        <>
          <EventInfoCard event={transformedEventData} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <BrandInfoForm control={form.control} />
              <ContactInfoForm control={form.control} />

              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Bid"}
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default BidSubmissionContent;
