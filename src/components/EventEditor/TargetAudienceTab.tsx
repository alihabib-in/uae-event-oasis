
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TargetAudienceTabProps {
  event: any;
  onClose: () => void;
}

const targetAudienceSchema = z.object({
  age_range: z.string().optional(),
  gender_focus: z.string().optional(),
  income_level: z.string().optional(),
  interests: z.string().optional(),
  audience_location: z.string().optional(),
  audience_size: z.coerce.number().optional(),
  audience_engagement_plan: z.string().optional(),
  sponsor_alignment: z.string().optional(),
  additional_demographics: z.string().optional(),
});

const TargetAudienceTab = ({ event, onClose }: TargetAudienceTabProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof targetAudienceSchema>>({
    resolver: zodResolver(targetAudienceSchema),
    defaultValues: {
      age_range: "",
      gender_focus: "",
      income_level: "",
      interests: "",
      audience_location: "",
      audience_size: undefined,
      audience_engagement_plan: "",
      sponsor_alignment: "",
      additional_demographics: "",
    }
  });

  useEffect(() => {
    if (event && event.target_audience) {
      form.reset({
        age_range: event.target_audience.age_range || "",
        gender_focus: event.target_audience.gender_focus || "",
        income_level: event.target_audience.income_level || "",
        interests: event.target_audience.interests || "",
        audience_location: event.target_audience.audience_location || "",
        audience_size: event.target_audience.audience_size || undefined,
        audience_engagement_plan: event.target_audience.audience_engagement_plan || "",
        sponsor_alignment: event.target_audience.sponsor_alignment || "",
        additional_demographics: event.target_audience.additional_demographics || "",
      });
    }
  }, [event, form]);

  const onSubmit = async (values: z.infer<typeof targetAudienceSchema>) => {
    if (!event || !event.id) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('events')
        .update({
          target_audience: values
        })
        .eq('id', event.id);
      
      if (error) throw error;
      
      toast.success("Target audience information saved successfully");
      onClose();
    } catch (error: any) {
      console.error('Error updating target audience:', error);
      toast.error(`Error saving information: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="age_range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age Range</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 25-40" {...field} />
                </FormControl>
                <FormDescription>
                  Target age demographic for this event
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gender_focus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender Focus</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender focus" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All genders</SelectItem>
                    <SelectItem value="male_skew">Male skew</SelectItem>
                    <SelectItem value="female_skew">Female skew</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="income_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Income Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select income level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="middle">Middle</SelectItem>
                    <SelectItem value="upper_middle">Upper Middle</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="all">All income levels</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="audience_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Audience Size</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Expected audience size" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="audience_location"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Audience Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. UAE, Dubai residents, GCC region" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Interests</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g. Technology, Fashion, Sustainability" 
                    {...field} 
                    rows={2}
                  />
                </FormControl>
                <FormDescription>
                  Key interests and preferences of the target audience
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="audience_engagement_plan"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Audience Engagement Plan</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe how you plan to engage with the audience" 
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
            name="sponsor_alignment"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Sponsor Alignment</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe how sponsors can align with this audience" 
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormDescription>
                  Explain why sponsors should target this audience and how their brand can benefit
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="additional_demographics"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Additional Demographics</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any other relevant demographic information" 
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Target Audience"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TargetAudienceTab;
