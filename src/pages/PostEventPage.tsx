import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CalendarIcon, Upload, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Step, Steps } from "@/components/ui/steps";
import PhoneVerification from "@/components/PhoneVerification";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define the form schema with proper number conversion for numeric fields
const formSchema = z.object({
  eventName: z.string().min(2, {
    message: "Event name must be at least 2 characters.",
  }),
  eventCategory: z.string({
    required_error: "Please select an event category.",
  }),
  eventDate: z.date({
    required_error: "Event date is required.",
  }),
  eventLocation: z.string().min(2, {
    message: "Event location must be at least 2 characters.",
  }),
  eventDescription: z.string().min(10, {
    message: "Event description must be at least 10 characters.",
  }),
  organizerName: z.string().min(2, {
    message: "Organizer name must be at least 2 characters.",
  }),
  organizerEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  organizerPhone: z.string().min(9, {
    message: "Please enter a valid phone number.",
  }),
  organizerCompany: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  sponsorshipNeeds: z.string().min(10, {
    message: "Please describe your sponsorship needs.",
  }),
  attendees: z.coerce.number().positive({
    message: "Attendees must be a positive number",
  }),
  minBid: z.coerce.number().positive({
    message: "Minimum bid must be a positive number",
  }),
  maxBid: z.coerce.number().positive({
    message: "Maximum bid must be a positive number",
  }),
  venue: z.string().min(2, {
    message: "Venue must be at least 2 characters.",
  }),
});

const PostEventPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [eventId, setEventId] = useState<string | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      eventCategory: "",
      eventLocation: "",
      eventDescription: "",
      organizerName: "",
      organizerEmail: "",
      organizerPhone: "",
      organizerCompany: "",
      sponsorshipNeeds: "",
      venue: "",
      attendees: 0,
      minBid: 0,
      maxBid: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      if (!user) {
        toast.error("You must be logged in to submit an event");
        navigate("/auth");
        return;
      }
      
      // Insert the event into the database
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title: values.eventName,
            description: values.eventDescription,
            date: values.eventDate.toISOString(),
            venue: values.venue,
            location: values.eventLocation,
            category: values.eventCategory,
            attendees: values.attendees,
            min_bid: values.minBid,
            max_bid: values.maxBid,
            organizer_name: values.organizerName,
            phone: values.organizerPhone,
            user_id: user.id,
          },
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      // Store the event ID for verification
      setEventId(data.id);
      
      // Upload images if any
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${data.id}/${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('events')
            .upload(fileName, file);
          
          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            toast.error(`Failed to upload ${file.name}`);
          }
        }
      }
      
      // Show verification modal
      setIsVerificationModalOpen(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit event");
      setIsSubmitting(false);
    }
  }
  
  const handlePhoneVerified = async () => {
    try {
      // Close the verification modal
      setIsVerificationModalOpen(false);
      
      // Send admin notification
      await supabase.functions.invoke("send-notification", {
        body: {
          type: "event",
          data: {
            eventId,
            eventName: form.getValues("eventName"),
            organizerName: form.getValues("organizerName"),
            organizerEmail: form.getValues("organizerEmail"),
            organizerPhone: form.getValues("organizerPhone"),
          }
        },
      });
      
      toast.success("Event submitted successfully! We'll review it and get back to you soon.");
      
      // Navigate home
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Failed to complete submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (newFiles) {
      setFiles(prev => [...prev, ...Array.from(newFiles)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-light tracking-tight mb-2">Post Your Event</h1>
            <p className="text-muted-foreground">
              Share details about your event to connect with potential sponsors
            </p>
          </div>

          <Steps currentStep={currentStep} className="mb-8">
            <Step title="Event Details" />
            <Step title="Organizer Information" />
            <Step title="Sponsorship Information" />
          </Steps>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {currentStep === 0 && (
                <div className="space-y-8 bg-card/30 rounded-xl p-6">
                  <h2 className="text-xl font-medium">Event Details</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="eventName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Dubai Tech Summit 2025" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eventCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
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

                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Event Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() || date > new Date(2030, 0, 1)
                                }
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
                      name="eventLocation"
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
                      name="attendees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Attendees</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 500" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="eventDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your event, including details about the audience, expected attendance, and program."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Event Images</FormLabel>
                    <div className="mt-2">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-background"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-500" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              SVG, PNG, JPG or GIF (MAX. 5MB)
                            </p>
                          </div>
                          <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={onFileChange}
                          />
                        </label>
                      </div>
                      {files.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {files.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Uploaded ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 bg-background/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setCurrentStep(1)}>
                      Next Step
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-8 bg-card/30 rounded-xl p-6">
                  <h2 className="text-xl font-medium">Organizer Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="organizerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="organizerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="organizerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+971 XX XXX XXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="organizerCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company/Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="Your company or organization name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(0)}>
                      Back
                    </Button>
                    <Button type="button" onClick={() => setCurrentStep(2)}>
                      Next Step
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8 bg-card/30 rounded-xl p-6">
                  <h2 className="text-xl font-medium">Sponsorship Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="minBid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Sponsorship Amount (AED)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 5000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxBid"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Sponsorship Amount (AED)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 50000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="sponsorshipNeeds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sponsorship Needs</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what kind of sponsors you're looking for and what opportunities you can offer them."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include details about available sponsorship tiers, benefits for sponsors, and any minimum requirements.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Event"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>
      </main>

      <Dialog open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Your Phone Number</DialogTitle>
            <DialogDescription>
              We need to verify your phone number before submitting your event.
            </DialogDescription>
          </DialogHeader>
          {eventId && (
            <PhoneVerification
              phone={form.getValues("organizerPhone")}
              recordId={eventId}
              tableType="events"
              onVerified={handlePhoneVerified}
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default PostEventPage;
