
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
import { ChevronDown } from "lucide-react";

const Index = () => {
  const featuredEvents = getFeaturedEvents();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        <div className="flex justify-center -mt-16 mb-8">
          <a 
            href="#featured-events" 
            className="animate-bounce bg-white p-3 rounded-full shadow-lg"
          >
            <ChevronDown className="h-6 w-6 text-primary" />
          </a>
        </div>
        
        {/* Featured Events Section */}
        <section id="featured-events" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900">Featured Event Opportunities</h2>
                <p className="text-xl text-gray-500 mt-4">
                  Popular events looking for brand sponsors
                </p>
              </div>
              <Button variant="outline" size="lg" asChild>
                <Link to="/events">View All Events</Link>
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
        <CallToAction type="brand" />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
