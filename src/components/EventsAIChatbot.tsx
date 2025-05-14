
import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, X, MessageSquare, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatbotProps = {
  isOpen: boolean;
  onClose: () => void;
};

const presetResponses = {
  attendance: "Based on our records, the previous three years had an average attendance of:\n\n- 2024: 1,850 attendees\n- 2023: 1,620 attendees\n- 2022: 1,400 attendees\n\nThe numbers show a steady growth in participation year over year.",
  categories: "The most popular event categories in the UAE are:\n\n1. Technology (28%)\n2. Business & Finance (22%)\n3. Arts & Culture (18%)\n4. Sports (15%)\n5. Education (10%)\n6. Food & Drink (7%)",
  pricing: "Sponsorship packages typically range from 5,000 AED to 50,000 AED depending on the event size, audience, and visibility offered. Premium events may have packages exceeding 100,000 AED.",
  organization: "To organize an event, you'll need to:\n\n1. Submit your event through the 'Post Event' page\n2. Wait for admin approval\n3. Once approved, your event will be visible to potential sponsors\n4. You'll be notified when sponsors show interest",
  sponsorship: "To sponsor an event:\n\n1. Browse events on the Events page\n2. Click on an event you're interested in\n3. Review the sponsorship packages\n4. Click 'Submit Bid' to express your interest\n5. Complete the bidding form with your offer",
  spaces: "We offer venue rentals across major Emirates including Dubai, Abu Dhabi, and Sharjah. Use our 'Rent Space' feature to explore available venues and submit a request.",
  fallback: "I'm an AI assistant focused on providing information about events and sponsorships on this platform. I can help with questions about event statistics, organizing events, sponsorship opportunities, and other related topics. How can I assist you today?"
};

const EventsAIChatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your Events AI assistant. Ask me about event attendance, sponsorships, or how to use our platform." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: "user" as const, content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Process the message and generate a response
    setTimeout(() => {
      const response = generateResponse(userMessage.content);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 800); // Simulate thinking time
  };

  const generateResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Pattern matching to determine response
    if (lowerMessage.includes("attend") || lowerMessage.includes("many people") || 
        lowerMessage.includes("participation") || lowerMessage.includes("previous years")) {
      return presetResponses.attendance;
    } else if (lowerMessage.includes("categor") || lowerMessage.includes("popular events") || 
               lowerMessage.includes("types of events")) {
      return presetResponses.categories;
    } else if (lowerMessage.includes("cost") || lowerMessage.includes("price") || 
               lowerMessage.includes("package") || lowerMessage.includes("sponsor")) {
      return presetResponses.pricing;
    } else if (lowerMessage.includes("organize") || lowerMessage.includes("host") || 
               lowerMessage.includes("create event") || lowerMessage.includes("submit event")) {
      return presetResponses.organization;
    } else if (lowerMessage.includes("become sponsor") || lowerMessage.includes("bid") || 
               lowerMessage.includes("support event")) {
      return presetResponses.sponsorship;
    } else if (lowerMessage.includes("venue") || lowerMessage.includes("location") || 
               lowerMessage.includes("space") || lowerMessage.includes("rent")) {
      return presetResponses.spaces;
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || 
               lowerMessage.includes("hey") || lowerMessage.includes("greetings")) {
      return "Hello! How can I help you with events today?";
    } else if (lowerMessage.includes("thank")) {
      return "You're welcome! Feel free to ask if you have any other questions about events or sponsorships.";
    } else if (lowerMessage.includes("bye") || lowerMessage.includes("goodbye")) {
      return "Goodbye! Feel free to return if you have more questions about events.";
    } else {
      return presetResponses.fallback;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm md:max-w-md shadow-xl rounded-lg overflow-hidden bg-slate-900 border border-slate-700 flex flex-col">
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-400" />
          <h3 className="font-medium text-slate-100">Events AI Assistant</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 border border-slate-700 text-slate-200"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 text-slate-200 max-w-[80%] rounded-lg px-4 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700 bg-slate-800">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about events, attendance, sponsorships..."
            className="min-h-10 resize-none bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventsAIChatbot;
