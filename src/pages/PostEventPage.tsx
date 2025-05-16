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
import { CalendarIcon, Upload, Trash2, LogIn, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Step, Steps } from "@/components/ui/steps";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  eventLocation: z.string({
    required_error: "Please select a location.",
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submittedEventId, setSubmittedEventId] = useState<string | null>(null);

  // Redirect to login page if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <h2 className="text-3xl font-extrabold">Authentication Required</h2>
              <p className="mt-2 text-muted-foreground">
                You need to be signed in to post an event
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <Button 
                onClick={() => navigate("/login")} 
                size="lg"
                className="w-full"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto" 
                  onClick={() => navigate("/login")}
                >
                  Sign up
                </Button>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
            phone_verified: true, // Auto-verify the phone
            status: 'pending', // Add status as pending for admin approval
          },
        ])
        .select()
        .single();
      
      if (error) throw error;
      
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
      
      try {
        // Send admin notification
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "event_submission",
            data: {
              eventId: data.id,
              eventName: values.eventName,
              organizerName: values.organizerName,
              organizerEmail: values.organizerEmail,
              organizerPhone: values.organizerPhone,
            }
          },
        });
      } catch (notificationError) {
        console.error("Error sending notification:", notificationError);
        // Continue even if notification fails
      }
      
      // Show the success state on the same page
      setSubmissionSuccess(true);
      setSubmittedEventId(data.id);
      
      // Reset form
      form.reset();
      setFiles([]);
      setCurrentStep(0);
      
    } catch (error: any) {
      toast.error(error.message || "Failed to submit event");
    } finally {
      setIsSubmitting(false);
    }
  }

  const contactViaWhatsApp = () => {
    window.open(`https://wa.me/971589664353?text=Hello, I just submitted an event/bid on sponsorby.io and wanted to follow up.`, "_blank");
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
  
  // Handle reset of submission success
  const resetSubmission = () => {
    setSubmissionSuccess(false);
    setSubmittedEventId(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4">
          {submissionSuccess ? (
            <div className="space-y-8">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <AlertTitle className="text-green-800">Event Submitted Successfully!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your event has been submitted for review. We'll review it and get back to you soon.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col space-y-4">
                <Button 
                  onClick={contactViaWhatsApp}
                  className="flex items-center justify-center gap-2"
                  variant="default"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.99 10.723C3.99 12.698 4.59 14.608 5.74 16.214L4 20L7.906 18.315C9.454 19.31 11.251 19.835 13.087 19.835H13.091C17.776 19.835 21.529 16.11 21.529 11.401C21.529 9.124 20.624 7.006 19.003 5.38C17.383 3.754 15.275 2.846 13.09 2.845C8.405 2.845 4.652 6.574 4.653 11.287" fill="currentColor"/>
                    <path d="M3.25 11.286C3.25 6.26 7.726 2.101 13.09 2.101C15.545 2.102 17.844 3.1 19.597 4.86C21.349 6.619 22.343 8.928 22.342 11.399C22.342 16.429 17.868 20.599 13.091 20.599H13.087C11.143 20.598 9.247 20.05 7.622 19.028L3 20.999L4.918 16.559C3.782 14.849 3.251 13.001 3.251 11.095M8.897 16.608L9.247 16.825C10.663 17.7 12.316 18.185 14.004 18.186H14.008C16.913 18.186 19.586 16.344 20.815 13.729C22.045 11.114 21.629 8.077 19.734 5.888C17.839 3.698 14.959 2.744 12.143 3.392C9.327 4.041 7.175 6.181 6.492 8.962C5.809 11.743 6.693 14.672 8.821 16.608H8.895M17.035 13.641C16.967 13.733 16.858 13.787 16.743 13.79C16.627 13.792 16.522 13.732 16.47 13.588C16.172 13.079 15.082 12.307 15.082 12.307C14.979 12.24 14.91 12.136 14.892 12.018C14.873 11.9 14.906 11.778 14.982 11.682C15.059 11.586 15.172 11.529 15.292 11.526C15.412 11.524 15.527 11.577 15.607 11.67C15.607 11.67 16.475 12.644 16.67 12.812C16.964 13.062 17.126 13.519 17.035 13.64V13.641ZM18.573 12.392C18.49 12.253 18.304 12.197 18.154 12.257C18.004 12.317 17.928 12.479 17.962 12.635C18.22 13.633 17.751 14.699 16.829 15.268C16.695 15.352 16.634 15.51 16.675 15.657C16.716 15.804 16.85 15.904 17.005 15.9C17.17 15.883 17.323 15.809 17.436 15.692C18.666 14.94 19.246 13.432 18.922 11.966C18.878 11.768 18.745 11.608 18.573 11.534V12.392Z" fill="white"/>
                  </svg>
                  Contact us on WhatsApp
                </Button>
                
                <Button 
                  onClick={() => navigate("/")}
                  variant="outline"
                >
                  Return to Home Page
                </Button>
                
                <Button
                  onClick={resetSubmission}
                  variant="ghost"
                  className="text-muted-foreground"
                >
                  Submit Another Event
                </Button>
              </div>
            </div>
          ) : (
            <>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a location" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Dubai">Dubai</SelectItem>
                                  <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                                  <SelectItem value="Sharjah">Sharjah</SelectItem>
                                </SelectContent>
                              </Select>
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostEventPage;
