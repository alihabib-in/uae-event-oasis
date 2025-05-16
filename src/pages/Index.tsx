
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TestimonialSection from "@/components/TestimonialSection";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import { useState } from "react";
import EventsAIChatbot from "@/components/EventsAIChatbot";

const IndexPage = () => {
  // Add state to control chatbot visibility
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Toggle function for chatbot
  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <Hero />
      
      <TestimonialSection />
      
      <CallToAction type="organizer" />

      {/* Fixed EventsAIChatbot by adding required props */}
      <EventsAIChatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
      
      {/* Add button to open chatbot */}
      <button 
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg flex items-center justify-center p-0 bg-primary text-primary-foreground z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </button>
      
      <Footer />
    </div>
  );
};

export default IndexPage;
