
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(2, { message: "Subject is required." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    
    try {
      await supabase.functions.invoke('send-contact-form', {
        body: { 
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message
        }
      });
      
      toast.success("Your message has been sent successfully.");
      form.reset();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium tracking-tight mb-2">Contact Us</h1>
            <p className="text-muted-foreground">
              Get in touch with our team and we'll get back to you shortly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contact sidebar (vertical layout) */}
            <div className="space-y-4">
              <Card className="overflow-hidden border-primary/10">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-base mb-1">Email Us</h3>
                    <p className="text-sm text-muted-foreground mb-2">Our team is here to help</p>
                    <a href="mailto:info@sponsorby.com" className="text-primary text-sm hover:underline">
                      info@sponsorby.com
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-primary/10">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-base mb-1">Call Us</h3>
                    <p className="text-sm text-muted-foreground mb-2">Mon-Fri from 9am to 5pm</p>
                    <a href="tel:+97144001122" className="text-primary text-sm hover:underline">
                      +971 4 400 1122
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-primary/10">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-base mb-1">Visit Us</h3>
                    <p className="text-sm text-muted-foreground mb-2">Our office location</p>
                    <p className="text-primary text-sm">Dubai Media City, Dubai, UAE</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          
            {/* Main content area (form and map) spanning 2 columns */}
            <div className="md:col-span-2 space-y-6">
              <Card className="overflow-hidden border-primary/10">
                <CardContent className="p-6">
                  <h2 className="text-xl font-medium mb-4">Send Us a Message</h2>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
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
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="your.email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="What is this regarding?" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Your message" 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <div className="h-[300px] rounded-lg overflow-hidden border">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.1678419858843!2d55.15009881500934!3d25.090717983944615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6b5402c126e3%3A0xb9511e6655c46d94!2sDubai%20Media%20City!5e0!3m2!1sen!2sae!4v1622555234684!5m2!1sen!2sae" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  title="sponsorby office location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
