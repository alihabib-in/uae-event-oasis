
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

const Index = () => {
  const featuredEvents = getFeaturedEvents();

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
                      min_bid: event.minBid,
                      max_bid: event.maxBid,
                      image: event.image
                    }}
                  />
                );
              })}
            </div>
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
