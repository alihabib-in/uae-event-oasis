
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Banknote, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const [events, setEvents] = useState<any[]>([]);
  
  useEffect(() => {
    // Fetch events for the carousel
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'approved')
          .eq('is_public', true)
          .limit(5);
          
        if (error) {
          console.error("Error fetching events:", error);
          return;
        }
        
        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    
    fetchEvents();
  }, []);

  // Placeholder images for events without images
  const placeholderImages = [
    "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=400&h=300&fit=crop"
  ];

  return (
    <div className="hero-gradient min-h-[92vh] flex items-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 text-balance leading-[1.1] text-foreground">
              <span className="text-gradient font-bold">Advertise your brand at exclusive events across UAE</span>
            </h1>
            <p className="text-xl text-gray-700 mb-12 leading-relaxed max-w-2xl font-medium">
              sponsorby is the premier marketplace providing brands high visibility across the largest UAE events.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Button size="lg" className="text-lg px-8 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all" asChild>
                <Link to="/events" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Find Events <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-7 rounded-xl border-2 shadow-sm hover:shadow-md transition-all" asChild>
                <Link to="/post-event" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Post Your Event
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-2 relative animate-scale-in">
            <div className="relative h-[400px] w-full">
              {/* Scrollable card carousel */}
              <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4 h-full">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className="min-w-[280px] h-[350px] bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex-shrink-0"
                    style={{
                      transform: `translateY(${index * 8}px) translateX(${index * -4}px)`,
                      zIndex: events.length - index
                    }}
                  >
                    <div className="relative h-48 rounded-t-2xl overflow-hidden">
                      <img
                        src={event.image || placeholderImages[index % placeholderImages.length]}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                        <div className="flex items-center text-xs font-medium text-gray-700">
                          <Award className="h-3 w-3 mr-1 text-primary" />
                          Live
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-primary font-semibold">
                          <Banknote className="h-4 w-4 mr-1" />
                          <span className="text-sm">AED {event.min_bid?.toLocaleString() || '5,000'}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {event.attendees?.toLocaleString() || '1,000'} attendees
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Fallback cards if no events */}
                {events.length === 0 && [1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="min-w-[280px] h-[350px] bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex-shrink-0"
                    style={{
                      transform: `translateY(${index * 8}px) translateX(${index * -4}px)`,
                      zIndex: 4 - index
                    }}
                  >
                    <div className="relative h-48 rounded-t-2xl overflow-hidden">
                      <img
                        src={placeholderImages[index - 1]}
                        alt={`Event ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                        <div className="flex items-center text-xs font-medium text-gray-700">
                          <Award className="h-3 w-3 mr-1 text-primary" />
                          Live
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {index === 1 ? "Dubai International Conference" : index === 2 ? "Abu Dhabi Tech Summit" : "Sharjah Art Festival"}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {index === 1 ? "Premier business conference" : index === 2 ? "Technology and innovation" : "Arts and culture celebration"}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-primary font-semibold">
                          <Banknote className="h-4 w-4 mr-1" />
                          <span className="text-sm">AED {index === 1 ? '5,000' : index === 2 ? '8,000' : '3,000'}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {index === 1 ? '2,000' : index === 2 ? '1,500' : '3,000'} attendees
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
