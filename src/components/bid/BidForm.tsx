
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import BrandInfoForm from "@/components/bid/BrandInfoForm";
import ContactInfoForm from "@/components/bid/ContactInfoForm";
import { BidFormValues } from "@/hooks/useBidSubmission";

interface BidFormProps {
  formSchema: any;
  onSubmit: (values: BidFormValues) => Promise<void>;
  isSubmitting: boolean;
  defaultValues?: Partial<BidFormValues>;
}

const BidForm = ({ formSchema, onSubmit, isSubmitting, defaultValues }: BidFormProps) => {
  const form = useForm<BidFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
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

  return (
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
  );
};

export default BidForm;
