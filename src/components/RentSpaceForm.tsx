import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Building, Phone, Mail, CalendarCheck, Users, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define the form schema
const formSchema = z.object({
  requesterName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  companyName: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(8, {
    message: "Please enter a valid phone number.",
  }),
  spaceType: z.string({
    required_error: "Please select a space type.",
  }),
  capacity: z.coerce.number().min(1, {
    message: "Capacity must be at least 1 person.",
  }),
  eventType: z.string({
    required_error: "Please select an event type.",
  }),
  preferredDate: z.date({
    required_error: "Please select a preferred date.",
  }),
  endDate: z.date({
    required_error: "Please select an end date.",
  }),
  additionalRequirements: z.string().optional(),
});

const spaceTypes = [
  "Conference Hall",
  "Exhibition Space",
  "Auditorium",
  "Workshop Room",
  "Outdoor Event Space",
  "Banquet Hall",
  "Meeting Room",
  "Studio Space",
];

const eventTypes = [
  "Conference",
  "Exhibition",
  "Workshop",
  "Corporate Event",
  "Award Ceremony",
  "Product Launch",
  "Networking Event",
  "Social Gathering",
  "Educational Seminar",
  "Other",
];

const RentSpaceForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requesterName: "",
      companyName: "",
      email: "",
      phone: "",
      spaceType: "",
      capacity: 50,
      eventType: "",
      additionalRequirements: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("space_rental_requests").insert([
        {
          requester_name: values.requesterName,
          company_name: values.companyName || null,
          email: values.email,
          phone: values.phone,
          space_type: values.spaceType,
          capacity: values.capacity,
          event_type: values.eventType,
          preferred_date: format(values.preferredDate, "yyyy-MM-dd"),
          end_date: format(values.endDate, "yyyy-MM-dd"),
          additional_requirements: values.additionalRequirements || null,
        },
      ]);

      if (error) {
        throw error;
      }

      // Success
      setFormSuccess(true);
      toast({
        title: "Request Submitted Successfully",
        description: "We have received your space rental request. Our team will contact you shortly.",
      });
      
      // Reset form
      form.reset();
      
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "There was a problem submitting your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {formSuccess ? (
        <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
            <CalendarCheck className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-medium text-green-400">Request Submitted Successfully!</h3>
          <p className="text-slate-300">
            Thank you for your space rental request. Our team will review your requirements and get back to you shortly.
          </p>
          <Button 
            onClick={() => setFormSuccess(false)} 
            className="mt-4"
          >
            Submit Another Request
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="requesterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      Contact Name
                    </FormLabel>
                    <FormControl>
                      <Input className="dark-input" placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-blue-400" />
                      Company/Organization
                    </FormLabel>
                    <FormControl>
                      <Input className="dark-input" placeholder="Optional" {...field} />
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
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-400" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input className="dark-input" type="email" placeholder="you@example.com" {...field} />
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
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-400" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input className="dark-input" placeholder="+971 XX XXX XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="spaceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      Space Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="dark-input">
                          <SelectValue placeholder="Select the type of space you need" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark-card">
                        {spaceTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      Expected Capacity
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="dark-input"
                        type="number"
                        min={1}
                        max={10000}
                        placeholder="Number of attendees"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-400" />
                      Event Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="dark-input">
                          <SelectValue placeholder="Select the type of your event" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark-card">
                        {eventTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-blue-400" />
                      Preferred Start Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`dark-input w-full pl-3 text-left font-normal ${
                              !field.value && "text-slate-500"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select start date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 dark-card" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="bg-slate-800 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2">
                      <CalendarCheck className="h-4 w-4 text-blue-400" />
                      End Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`dark-input w-full pl-3 text-left font-normal ${
                              !field.value && "text-slate-500"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select end date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 dark-card" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const preferredDate = form.getValues("preferredDate");
                            return preferredDate ? date < preferredDate : date < new Date();
                          }}
                          initialFocus
                          className="bg-slate-800 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="additionalRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-400" />
                    Additional Requirements
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="dark-input min-h-[120px]"
                      placeholder="Please provide any additional information or specific requirements for your event..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full md:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CalendarIcon className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default RentSpaceForm;
