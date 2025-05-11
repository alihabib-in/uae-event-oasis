// Modifying the EventsPage to only fetch and show approved and public events
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar, Filter, Search, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
        
        setEvents(data || []);
        
        // Extract all unique tags and categories
        const tags = new Set<string>();
        const categories = new Set<string>();
        
        data?.forEach(event => {
          if (event.tags && Array.isArray(event.tags)) {
            event.tags.forEach((tag: string) => tags.add(tag));
          }
          if (event.category) {
            categories.add(event.category);
          }
        });
        
        setAllTags(Array.from(tags));
        setAllCategories(Array.from(categories));
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filterEvents = () => {
    return events.filter(event => {
      // Filter by search query
      const matchesSearch = 
        !searchQuery || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by category
      const matchesCategory = 
        !selectedCategory || 
        event.category === selectedCategory;
      
      // Filter by tags
      const matchesTags = 
        selectedTags.length === 0 || 
        (event.tags && selectedTags.some(tag => event.tags!.includes(tag)));
      
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
            <div className="mt-4 md:mt-0">
              <Button onClick={() => navigate("/post-event")} className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Post Your Event
              </Button>
            </div>
          </div>
          
          <div className="bg-card/30 p-4 rounded-xl mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={clearFilters}
                >
                  <Filter className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Categories</p>
                <ToggleGroup type="single" className="justify-start flex-wrap" value={selectedCategory} onValueChange={setSelectedCategory}>
                  {allCategories.map(category => (
                    <ToggleGroupItem key={category} value={category} className="text-xs">
                      {category}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
              
              {allTags.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
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
                      .filter(event => new Date(event.date) >= new Date())
                      .map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
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
                    {filteredEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
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
    </div>
  );
};

export default EventsPage;
