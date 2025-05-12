import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DialogFooter } from "@/components/ui/dialog";

interface DetailsTabProps {
  event?: any;
  onClose: () => void;
  onEventUpdated?: () => void;
}

const eventSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description is required"),
  date: z.date({ required_error: "Date is required" }),
  end_date: z.date().optional(),
  location: z.string().min(2, "Location is required"),
  venue: z.string().min(2, "Venue is required"),
  category: z.string().min(1, "Category is required"),
  min_bid: z.coerce.number().positive("Minimum bid must be a positive number"),
  max_bid: z.coerce.number().positive("Maximum bid must be a positive number"),
  attendees: z.coerce.number().positive("Attendees must be a positive number"),
  is_public: z.boolean().default(true)
});

const DetailsTab = ({ event, onClose, onEventUpdated }: DetailsTabProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      venue: "",
      category: "",
      min_bid: 0,
      max_bid: 0,
      attendees: 0,
      is_public: true
    }
  });

  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title || "",
        description: event.description || "",
        date: event.date ? new Date(event.date) : new Date(),
        end_date: event.end_date ? new Date(event.end_date) : undefined,
        location: event.location || "",
        venue: event.venue || "",
        category: event.category || "",
        min_bid: event.min_bid || 0,
        max_bid: event.max_bid || 0,
        attendees: event.attendees || 0,
        is_public: event.is_public !== undefined ? event.is_public : true
      });

      // Load image preview if available
      if (event.image) {
        setImagePreview(event.image);
      } else {
        setImagePreview(null);
      }
    } else {
      form.reset({
        title: "",
        description: "",
        date: new Date(),
        location: "",
        venue: "",
        category: "",
        min_bid: 0,
        max_bid: 0,
        attendees: 0,
        is_public: true
      });
      setImagePreview(null);
    }
  }, [event, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const onSubmit = async (values: z.infer<typeof eventSchema>) => {
    if (!event) return;
    
    setIsSubmitting(true);
    try {
      let imageUrl = event.image;

      // Upload the new image if selected
      if (imageFile) {
        const fileName = `event-${event.id}-${Date.now()}`;
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('event-images')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase
          .storage
          .from('event-images')
          .getPublicUrl(fileName);
          
        imageUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from('events')
        .update({
          title: values.title,
          description: values.description,
          date: values.date.toISOString(),
          end_date: values.end_date ? values.end_date.toISOString() : null,
          location: values.location,
          venue: values.venue,
          category: values.category,
          min_bid: values.min_bid,
          max_bid: values.max_bid,
          attendees: values.attendees,
          is_public: values.is_public,
          image: imageUrl
        })
        .eq('id', event.id);
      
      if (error) throw error;
      
      toast.success("Event updated successfully");
      if (onEventUpdated) onEventUpdated();
      onClose();
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast.error(`Error updating event: ${error.message}`);
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="exhibition">Exhibition</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="networking">Networking Event</SelectItem>
                    <SelectItem value="cultural">Cultural Event</SelectItem>
                    <SelectItem value="sports">Sports Event</SelectItem>
                    <SelectItem value="music">Concert/Music Event</SelectItem>
                    <SelectItem value="charity">Charity Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Banner/Cover Photo Upload */}
          <div className="col-span-full">
            <FormLabel className="block mb-2">Event Banner/Cover Photo</FormLabel>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('eventImage')?.click()}
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Choose Image
                </Button>
                <Input 
                  type="file" 
                  id="eventImage" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <span className="text-sm text-muted-foreground">
                    Image selected
                  </span>
                )}
              </div>
              {imagePreview && (
                <div className="relative rounded-md overflow-hidden border aspect-video max-w-full">
                  <img 
                    src={imagePreview} 
                    alt="Event banner preview" 
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Dubai, UAE" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Dubai World Trade Centre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="min_bid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Bid (AED)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="max_bid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Bid (AED)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="attendees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Attendees</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="is_public"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                <div className="space-y-1">
                  <FormLabel className="text-base">Event Visibility</FormLabel>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Make this event visible to the public
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the event details" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Event"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default DetailsTab;
