
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface HistoryTabProps {
  event: any;
  onClose: () => void;
}

const historySchema = z.object({
  previous_editions: z.string().optional(),
  attendance_figures: z.string().optional(),
  participating_artists: z.string().optional(),
  media_coverage: z.string().optional(),
  past_sponsors: z.string().optional(),
  achievements: z.string().optional(),
  testimonials: z.string().optional(),
});

const HistoryTab = ({ event, onClose }: HistoryTabProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof historySchema>>({
    resolver: zodResolver(historySchema),
    defaultValues: {
      previous_editions: "",
      attendance_figures: "",
      participating_artists: "",
      media_coverage: "",
      past_sponsors: "",
      achievements: "",
      testimonials: "",
    }
  });

  useEffect(() => {
    if (event && event.history) {
      form.reset({
        previous_editions: event.history.previous_editions || "",
        attendance_figures: event.history.attendance_figures || "",
        participating_artists: event.history.participating_artists || "",
        media_coverage: event.history.media_coverage || "",
        past_sponsors: event.history.past_sponsors || "",
        achievements: event.history.achievements || "",
        testimonials: event.history.testimonials || "",
      });
    }
  }, [event, form]);

  const onSubmit = async (values: z.infer<typeof historySchema>) => {
    if (!event || !event.id) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('events')
        .update({
          history: values
        })
        .eq('id', event.id);
      
      if (error) throw error;
      
      toast.success("Event history information saved successfully");
      onClose();
    } catch (error: any) {
      console.error('Error updating event history:', error);
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
          name="previous_editions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Previous Editions</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Details about previous editions of this event" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Include years, locations, and significant details
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="attendance_figures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attendance Figures</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Attendance numbers from previous events" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Include growth trends if applicable
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="participating_artists"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Participating Artists/Exhibitors</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Notable participants from previous events" 
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
          name="media_coverage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Media Coverage</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Details about past media coverage and publicity" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Mention publications, TV channels, social media reach, etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="past_sponsors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Past Sponsors</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List previous sponsors and partners" 
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
          name="achievements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Achievements</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Notable achievements, records, or milestones" 
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
          name="testimonials"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Testimonials</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Testimonials from attendees, participants, or previous sponsors" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save History"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HistoryTab;
