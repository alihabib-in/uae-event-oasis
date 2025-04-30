
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import CategorySection from "../components/CategorySection";
import EventCard, { EventCardProps } from "../components/EventCard";
import TestimonialSection from "../components/TestimonialSection";
import CallToAction from "../components/CallToAction";
import StatsSection from "../components/StatsSection";
import { Button } from "@/components/ui/button";
import { getFeaturedEvents } from "../data/eventData";
import { Link } from "react-router-dom";

const Index = () => {
  const featuredEvents = getFeaturedEvents();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Featured Events Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold">Featured Event Opportunities</h2>
                <p className="text-gray-500 mt-2">
                  Popular events looking for brand sponsors
                </p>
              </div>
              <Button variant="outline" asChild>
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

        <CategorySection />
        <StatsSection />
        <HowItWorks />
        <TestimonialSection />
        <CallToAction type="brand" />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
