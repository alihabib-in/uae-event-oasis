
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import StatsSection from "@/components/StatsSection";
import OrganizerStorytellingSection from "@/components/OrganizerStorytellingSection";
import BrandStorytellingSection from "@/components/BrandStorytellingSection";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import CategorySection from "@/components/CategorySection";
import TestimonialSection from "@/components/TestimonialSection";
import EventsAIChatbot from "@/components/EventsAIChatbot";

const IndexPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Stats section moved above the hero */}
      <StatsSection />
      
      <Hero />
      
      <HowItWorks />
      <CategorySection />
      <TestimonialSection />
      <OrganizerStorytellingSection />
      <BrandStorytellingSection />
      <CallToAction />

      <EventsAIChatbot />
      <Footer />
    </div>
  );
};

export default IndexPage;
