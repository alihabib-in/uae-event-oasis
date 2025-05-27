import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Banknote, Award, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
const Hero = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    // Fetch events for the carousel
    const fetchEvents = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('events').select('*').eq('status', 'approved').eq('is_public', true).limit(5);
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

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => prevIndex === (events.length > 0 ? events.length - 1 : 2) ? 0 : prevIndex + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [events.length]);

  // Placeholder images for events without images
  const placeholderImages = ["https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=400&h=300&fit=crop"];
  const displayEvents = events.length > 0 ? events : [{
    id: 1,
    title: "Dubai International Conference",
    description: "Premier business conference",
    min_bid: 5000,
    attendees: 2000,
    location: "Dubai World Trade Centre"
  }, {
    id: 2,
    title: "Abu Dhabi Tech Summit",
    description: "Technology and innovation",
    min_bid: 8000,
    attendees: 1500,
    location: "ADNEC Abu Dhabi"
  }, {
    id: 3,
    title: "Sharjah Art Festival",
    description: "Arts and culture celebration",
    min_bid: 3000,
    attendees: 3000,
    location: "Sharjah Art Museum"
  }];
  const nextSlide = () => {
    setCurrentIndex(prevIndex => prevIndex === displayEvents.length - 1 ? 0 : prevIndex + 1);
  };
  const prevSlide = () => {
    setCurrentIndex(prevIndex => prevIndex === 0 ? displayEvents.length - 1 : prevIndex - 1);
  };
  const handleCardClick = (eventId: string | number) => {
    window.location.href = `/events/${eventId}`;
  };
  return <div className="hero-gradient min-h-[92vh] flex items-center relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 text-balance leading-[1.1] text-black">
              <span className="text-gradient font-bold">Advertise your brand at exclusive events across </span> 
              <span className="inline-flex items-center">
                <img src="https://flagcdn.com/ae.svg" alt="UAE Flag" className="w-20 h-12 md:w-18 md:h-14 mx-2 rounded shadow-md object-cover" />
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl font-medium">
              sponsorby is the premier marketplace providing brands high visibility across the largest UAE events.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Button size="lg" className="text-lg px-8 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all" asChild>
                <Link to="/events" className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Find Events
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
            <div className="relative h-[400px] w-full max-w-[380px] mx-auto">
              {/* Carousel container */}
              <div className="relative h-full w-full">
                {displayEvents.map((event, index) => {
                const isActive = index === currentIndex;
                const isNext = index === (currentIndex + 1) % displayEvents.length;
                const isPrev = index === (currentIndex - 1 + displayEvents.length) % displayEvents.length;
                let zIndex = 1;
                let scale = 0.8;
                let translateX = 0;
                let translateY = 20;
                let opacity = 0.3;
                if (isActive) {
                  zIndex = 3;
                  scale = 1;
                  translateX = 0;
                  translateY = 0;
                  opacity = 1;
                } else if (isNext) {
                  zIndex = 2;
                  scale = 0.9;
                  translateX = 15;
                  translateY = 10;
                  opacity = 0.7;
                } else if (isPrev) {
                  zIndex = 2;
                  scale = 0.9;
                  translateX = -15;
                  translateY = 10;
                  opacity = 0.7;
                }
                return <div key={event.id} className="absolute inset-0 w-full h-[350px] transition-all duration-700 ease-in-out cursor-pointer" style={{
                  zIndex,
                  transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
                  opacity
                }} onClick={() => handleCardClick(event.id)}>
                      <div className="w-full h-full bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-200">
                        <div className="relative h-48 rounded-t-2xl overflow-hidden">
                          <img src={event.image || placeholderImages[index % placeholderImages.length]} alt={event.title} className="w-full h-full object-cover" />
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                            <div className="flex items-center text-xs font-medium text-gray-700">
                              <Award className="h-3 w-3 mr-1 text-black" />
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
                          
                          {/* Location */}
                          <div className="flex items-center text-gray-600 text-sm mb-3">
                            <MapPin className="h-4 w-4 mr-1.5" />
                            <span className="truncate">{event.location || 'Dubai, UAE'}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-black font-semibold">
                              <Banknote className="h-4 w-4 mr-1" />
                              <span className="text-sm">Starts from AED {event.min_bid?.toLocaleString() || '5,000'}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {event.attendees?.toLocaleString() || '1,000'} attendees
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>;
              })}
              </div>
              
              {/* Dots indicator only - arrows removed */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {displayEvents.map((_, index) => <button key={index} onClick={() => setCurrentIndex(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-black' : 'bg-gray-400'}`} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Hero;