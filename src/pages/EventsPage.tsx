
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import EventsAIChatbot from "../components/EventsAIChatbot";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Building, MessageSquare, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import EventFilters from "@/components/EventFilters";

// Define the event type to fix typing issues
interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  end_date?: string;
  location: string;
  venue: string;
  category: string;
  min_bid: number;
  max_bid: number;
  attendees: number;
  tags?: string[];
  organizer_name: string;
  organizer_logo?: string;
  image?: string;
  status: string;
  is_public: boolean;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Only fetch approved and public events
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("status", "approved")
          .eq("is_public", true)
          .order("date", { ascending: true });

        if (error) throw error;
        
        // Validate the data is an array before setting it
        if (Array.isArray(data)) {
          console.log("Fetched events:", data);
          setEvents(data);
          
          // Extract all unique tags and categories
          const tags = new Set<string>();
          const categories = new Set<string>();
          
          data.forEach(event => {
            if (event.tags && Array.isArray(event.tags)) {
              event.tags.forEach((tag: string) => tags.add(tag));
            }
            if (event.category) {
              categories.add(event.category);
            }
          });
          
          setAllTags(Array.from(tags));
          setAllCategories(Array.from(categories));
        } else {
          console.error("Expected data to be an array but got:", data);
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filterEvents = () => {
    if (!Array.isArray(events)) {
      console.error("Events is not an array:", events);
      return [];
    }
    
    return events.filter(event => {
      if (!event) return false;
      
      // Filter by search query
      const matchesSearch = 
        !searchQuery || 
        (event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by category
      const matchesCategory = 
        !selectedCategory || 
        event.category === selectedCategory;
      
      // Filter by tags
      const matchesTags = 
        selectedTags.length === 0 || 
        (event.tags && Array.isArray(event.tags) && selectedTags.some(tag => event.tags!.includes(tag)));
      
      return matchesSearch && matchesCategory && matchesTags;
    });
  };

  const handleTagToggle = (value: string) => {
    setSelectedTags(prev => {
      return prev.includes(value)
        ? prev.filter(tag => tag !== value)
        : [...prev, value];
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSelectedCategory("");
  };

  const filteredEvents = filterEvents();

  const renderEventCard = (event: Event) => {
    if (!event || !event.id) {
      console.error("Invalid event object:", event);
      return null;
    }
    
    // Make sure we pass the event object with the correct property structure
    return (
      <EventCard 
        key={event.id} 
        event={{
          id: event.id,
          title: event.title,
          date: event.date,
          location: event.location,
          category: event.category,
          min_bid: event.min_bid,
          max_bid: event.max_bid,
          image: event.image || "/placeholder.svg",
          is_public: event.is_public
        }} 
      />
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl font-light tracking-tight mb-2">Explore Events</h1>
              <p className="text-muted-foreground">
                Discover the most exciting events across the UAE
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button onClick={() => navigate("/post-event")} className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Post Your Event
              </Button>
            </div>
          </div>
          
          <EventFilters
            categories={allCategories}
            tags={allTags}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedTags={selectedTags}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onTagToggle={handleTagToggle}
            onClearFilters={clearFilters}
          />
          
          <div>
            <Tabs defaultValue="upcoming" className="w-full mb-8">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="all">All Events</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming" className="pt-4">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((_, idx) => (
                      <div key={idx} className="bg-card/30 rounded-xl h-72 animate-pulse" />
                    ))}
                  </div>
                ) : filteredEvents.filter(e => new Date(e.date) >= new Date()).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents
                      .filter(event => event && event.date && new Date(event.date) >= new Date())
                      .map(event => renderEventCard(event))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground">No upcoming events found matching your criteria.</p>
                    <Button variant="link" onClick={clearFilters}>Clear all filters</Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="all" className="pt-4">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((_, idx) => (
                      <div key={idx} className="bg-card/30 rounded-xl h-72 animate-pulse" />
                    ))}
                  </div>
                ) : filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map(event => renderEventCard(event))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground">No events found matching your criteria.</p>
                    <Button variant="link" onClick={clearFilters}>Clear all filters</Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* AI Chatbot */}
      <Button 
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-40 p-0"
        onClick={() => setIsChatbotOpen(prev => !prev)}
      >
        {isChatbotOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>
      
      <EventsAIChatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default EventsPage;
