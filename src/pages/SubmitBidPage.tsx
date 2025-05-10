
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import PhoneVerification from "@/components/PhoneVerification";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building, Calendar, Mail, MapPin, Phone, User } from "lucide-react";

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

const SubmitBidPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidId, setBidId] = useState<string | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
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

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        console.log("Fetching event details for ID:", eventId);
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (error) {
          console.error("Error fetching event:", error);
          throw error;
        }
        
        console.log("Event data fetched:", data);
        setEventDetails(data);
      } catch (error: any) {
        console.error("Event fetch error:", error.message);
        toast.error("Error fetching event details");
        navigate("/events");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId, navigate]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      if (!user) {
        toast.error("You must be logged in to submit a bid");
        navigate("/auth");
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
  }
  
  const handlePhoneVerified = async () => {
    try {
      // Close the verification modal
      setIsVerificationModalOpen(false);
      
      if (!bidId) {
        throw new Error("Missing bid ID");
      }
      
      console.log("Phone verified for bid ID:", bidId);
      
      // Send admin notification
      await supabase.functions.invoke("send-notification", {
        body: {
          type: "bid",
          data: {
            bidId,
            eventId,
            brandName: form.getValues("brandName"),
            contactName: form.getValues("contactName"),
            email: form.getValues("email"),
            phone: form.getValues("phone"),
            bidAmount: form.getValues("bidAmount"),
          }
        },
      });
      
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading event details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!eventDetails) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Event not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-light tracking-tight mb-2">Submit Your Bid</h1>
            <p className="text-muted-foreground">
              Submit your sponsorship bid for <span className="font-medium">{eventDetails.title}</span>
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-card/30 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-medium">Event Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Event Date</p>
                  <p className="font-medium">{new Date(eventDetails.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{eventDetails.venue}, {eventDetails.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expected Attendees</p>
                  <p className="font-medium">{eventDetails.attendees}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sponsorship Range</p>
                  <p className="font-medium">AED {eventDetails.min_bid.toLocaleString()} - AED {eventDetails.max_bid.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="bg-card/30 rounded-xl p-6 space-y-6">
                  <h2 className="text-xl font-medium">Brand Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="brandName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input placeholder="Your brand name" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessNature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nature of Business</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Retail, Technology, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://yourbrand.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="companyAddress"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Company Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input placeholder="Full company address" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emirate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emirate</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an emirate" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="abu_dhabi">Abu Dhabi</SelectItem>
                              <SelectItem value="dubai">Dubai</SelectItem>
                              <SelectItem value="sharjah">Sharjah</SelectItem>
                              <SelectItem value="ajman">Ajman</SelectItem>
                              <SelectItem value="umm_al_quwain">Umm Al Quwain</SelectItem>
                              <SelectItem value="fujairah">Fujairah</SelectItem>
                              <SelectItem value="ras_al_khaimah">Ras Al Khaimah</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="bg-card/30 rounded-xl p-6 space-y-6">
                  <h2 className="text-xl font-medium">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input placeholder="Full name" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactPosition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Marketing Manager" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input placeholder="email@example.com" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input placeholder="+971 XX XXX XXXX" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bidAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sponsorship Bid Amount (AED)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-muted-foreground font-medium">AED</span>
                              <Input type="number" className="pl-12" placeholder="Enter bid amount" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="bg-card/30 rounded-xl p-6">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message to Organizer</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share details about your brand, sponsorship goals, and why you're interested in this event"
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/events/${eventId}`)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Bid"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>

      <Dialog open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen}>
        <DialogContent className="sm:max-w-[550px] bg-card/95 backdrop-blur-sm border border-white/10">
          <DialogHeader>
            <DialogTitle>Verify Your Phone Number</DialogTitle>
            <DialogDescription>
              We need to verify your phone number before submitting your bid.
            </DialogDescription>
          </DialogHeader>
          {bidId && (
            <PhoneVerification
              phone={form.getValues("phone")}
              recordId={bidId}
              tableType="bids"
              onVerified={handlePhoneVerified}
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default SubmitBidPage;
