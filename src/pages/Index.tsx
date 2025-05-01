
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Featured Events Section */}
        <section id="featured-events" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-16">
              <div>
                <h2 className="section-title text-balance">Featured Event Opportunities</h2>
                <p className="mt-4 text-xl text-muted-foreground max-w-2xl">
                  Popular events looking for brand sponsors
                </p>
              </div>
              <Button variant="outline" size="lg" asChild className="mt-6 lg:mt-0 text-primary border-primary">
                <Link to="/events" className="flex items-center">
                  View All Events <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={new Date(event.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  location={event.location}
                  category={event.category}
                  minBid={event.minBid}
                  maxBid={event.maxBid}
                  image={event.image}
                />
              ))}
            </div>
          </div>
        </section>

        <StatsSection />
        <HowItWorks />
        <CategorySection />
        <TestimonialSection />
        
        {/* Call to Action with more prominent styling */}
        <section className="py-24 bg-primary/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white rounded-2xl overflow-hidden elevation-4">
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
