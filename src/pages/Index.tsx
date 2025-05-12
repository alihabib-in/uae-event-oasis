
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import CategorySection from "../components/CategorySection";
import EventCard from "../components/EventCard";
import TestimonialSection from "../components/TestimonialSection";
import CallToAction from "../components/CallToAction";
import StatsSection from "../components/StatsSection";
import { Button } from "@/components/ui/button";
import { getFeaturedEvents } from "../data/eventData";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        // Get approved events from Supabase
        const { data: supabaseEvents, error } = await supabase
          .from("events")
          .select("*")
          .eq("status", "approved")
          .eq("is_public", true)
          .order("created_at", { ascending: false })
          .limit(6);
          
        if (error) {
          console.error("Error fetching events:", error);
          // Fallback to static data
          const staticEvents = getFeaturedEvents();
          setFeaturedEvents(staticEvents);
          setLoading(false);
          return;
        }
        
        if (supabaseEvents && supabaseEvents.length > 0) {
          setFeaturedEvents(supabaseEvents);
        } else {
          // Fallback to static data if no approved events
          const staticEvents = getFeaturedEvents();
          setFeaturedEvents(staticEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        // Fallback to static data
        const staticEvents = getFeaturedEvents();
        setFeaturedEvents(staticEvents);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApprovedEvents();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Featured Events Section */}
        <section id="featured-events" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-16">
              <div>
                <h2 className="section-title">Featured Event Opportunities</h2>
                <p className="mt-4 text-xl text-muted-foreground max-w-2xl">
                  Popular events looking for brand sponsors
                </p>
              </div>
              <Button variant="outline" size="lg" asChild className="mt-6 lg:mt-0 text-primary border-primary hover:bg-primary/10">
                <Link to="/events" className="flex items-center">
                  View All Events <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : featuredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No featured events available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredEvents.map((event) => {
                  // Make sure the event exists before rendering it
                  if (!event) {
                    console.error("Invalid featured event:", event);
                    return null;
                  }
                  
                  return (
                    <EventCard
                      key={event.id}
                      event={{
                        id: event.id,
                        title: event.title,
                        date: event.date,
                        location: event.location,
                        category: event.category,
                        min_bid: event.minBid || event.min_bid,
                        max_bid: event.maxBid || event.max_bid,
                        image: event.image,
                        is_public: true
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <StatsSection />
        <HowItWorks />
        <CategorySection />
        <TestimonialSection />
        
        {/* Call to Action with more prominent styling */}
        <section className="py-24 bg-muted/10 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="glass-card rounded-2xl overflow-hidden">
              <CallToAction type="brand" />
            </div>
          </div>
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-primary/10 rounded-full"></div>
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-secondary/10 rounded-full"></div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
