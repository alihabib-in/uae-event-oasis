
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MarketingTabProps {
  event: any;
  onClose: () => void;
}

const marketingSchema = z.object({
  advertising_channels: z.string().optional(),
  public_relations: z.string().optional(),
  influencers: z.string().optional(),
  email_marketing: z.string().optional(),
  cross_promotions: z.string().optional(),
  innovative_approaches: z.string().optional(),
  social_media_strategy: z.string().optional(),
  budget_allocation: z.string().optional(),
  timeline: z.string().optional(),
  sponsor_visibility: z.string().optional(),
});

const MarketingTab = ({ event, onClose }: MarketingTabProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof marketingSchema>>({
    resolver: zodResolver(marketingSchema),
    defaultValues: {
      advertising_channels: "",
      public_relations: "",
      influencers: "",
      email_marketing: "",
      cross_promotions: "",
      innovative_approaches: "",
      social_media_strategy: "",
      budget_allocation: "",
      timeline: "",
      sponsor_visibility: "",
    }
  });

  useEffect(() => {
    if (event && event.marketing) {
      form.reset({
        advertising_channels: event.marketing.advertising_channels || "",
        public_relations: event.marketing.public_relations || "",
        influencers: event.marketing.influencers || "",
        email_marketing: event.marketing.email_marketing || "",
        cross_promotions: event.marketing.cross_promotions || "",
        innovative_approaches: event.marketing.innovative_approaches || "",
        social_media_strategy: event.marketing.social_media_strategy || "",
        budget_allocation: event.marketing.budget_allocation || "",
        timeline: event.marketing.timeline || "",
        sponsor_visibility: event.marketing.sponsor_visibility || "",
      });
    }
  }, [event, form]);

  const onSubmit = async (values: z.infer<typeof marketingSchema>) => {
    if (!event || !event.id) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('events')
        .update({
          marketing: values
        })
        .eq('id', event.id);
      
      if (error) throw error;
      
      toast.success("Marketing information saved successfully");
      onClose();
    } catch (error: any) {
      console.error('Error updating marketing information:', error);
      toast.error(`Error saving information: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="advertising_channels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Advertising Channels</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Social media, print, radio, online advertising plans" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Describe all the channels you plan to use for promotion
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="social_media_strategy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Social Media Strategy</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Details of your social media marketing plan" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Include platforms, content strategy, paid promotions
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="public_relations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Public Relations Efforts</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="PR strategy and plans" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="influencers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Influencer & Media Partners</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Plans for influencer marketing and media partnerships" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email_marketing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Marketing</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Email marketing strategy details" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cross_promotions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cross-Promotional Opportunities</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Details about cross-promotion partnerships" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="innovative_approaches"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Innovative Marketing Approaches</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any unique or innovative marketing approaches" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marketing Timeline</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Timeline for marketing activities" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Include key marketing milestones and dates
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="budget_allocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Allocation</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="How marketing budget will be allocated across channels" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="sponsor_visibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sponsor Visibility in Marketing</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="How sponsors will be featured in marketing materials" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Explain how sponsors will be recognized and promoted
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Marketing Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MarketingTab;
