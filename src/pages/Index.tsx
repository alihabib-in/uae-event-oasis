// Only update the part related to the commission percentage - keeping the rest of the file the same
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight, Filter, Tag, Search, Calendar, MapPin, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import EventCard from "@/components/EventCard";
import TestimonialSection from "@/components/TestimonialSection";
import { Button } from "@/components/ui/button";
import { getFeaturedEvents } from "@/data/eventData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Event categories for filter
const categories = [
  "Technology",
  "Sports",
  "Arts & Culture",
  "Business",
  "Education",
  "Entertainment",
  "Food & Drink"
];

const Index = () => {
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        // Get approved events from Supabase
        const { data: supabaseEvents, error } = await supabase
          .from("events")
          .select("*")
          .eq("status", "approved")
          .eq("is_public", true)
          .order("created_at", { ascending: false })
          .limit(9);
          
        if (error) {
          console.error("Error fetching events:", error);
          // Fallback to static data
          const staticEvents = getFeaturedEvents();
          setFeaturedEvents(staticEvents);
          setFilteredEvents(staticEvents);
          setLoading(false);
          return;
        }
        
        if (supabaseEvents && supabaseEvents.length > 0) {
          setFeaturedEvents(supabaseEvents);
          setFilteredEvents(supabaseEvents);
        } else {
          // Fallback to static data if no approved events
          const staticEvents = getFeaturedEvents();
          setFeaturedEvents(staticEvents);
          setFilteredEvents(staticEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        // Fallback to static data
        const staticEvents = getFeaturedEvents();
        setFeaturedEvents(staticEvents);
        setFilteredEvents(staticEvents);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApprovedEvents();
  }, []);

  // Filter events when selectedCategories changes
  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredEvents(featuredEvents);
    } else {
      const filtered = featuredEvents.filter((event) => 
        selectedCategories.includes(event.category || '')
      );
      setFilteredEvents(filtered);
    }
  }, [selectedCategories, featuredEvents]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(current => 
      current.includes(category)
        ? current.filter(c => c !== category)
        : [...current, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Featured Events with Category Filter */}
        <section id="featured-events" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-8">
              <div>
                <h2 className="section-title flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  Featured Event Opportunities
                </h2>
                <p className="mt-3 text-lg text-slate-500 max-w-2xl">
                  Popular events looking for brand sponsors - with 0% commission
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mt-6 lg:mt-0">
                {/* Category filter dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filter by Category
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {categories.map((category) => (
                      <DropdownMenuCheckboxItem
                        key={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      >
                        {category}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {selectedCategories.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-slate-500 hover:text-slate-700 flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    Clear filters
                  </Button>
                )}
                
                <Button variant="outline" size="sm" asChild className="ml-auto text-primary border-primary hover:bg-primary/10">
                  <Link to="/events" className="flex items-center">
                    View All Events <ChevronRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Selected filters display */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map(category => (
                  <Badge 
                    key={category} 
                    variant="outline"
                    className="bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer flex items-center gap-1"
                    onClick={() => toggleCategory(category)}
                  >
                    <Tag className="h-3 w-3" />
                    {category} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-100">
                <Search className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">No events found matching your selected categories.</p>
                <Button variant="link" onClick={clearFilters} className="flex items-center gap-1 mx-auto mt-2">
                  <X className="h-4 w-4" />
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredEvents.map((event) => {
                  // Make sure the event exists before rendering it
                  if (!event) {
                    console.error("Invalid featured event:", event);
                    return null;
                  }
                  
                  return (
                    <EventCard
                      key={event.id}
                      event={{
                        id: event.id,
                        title: event.title,
                        date: event.date,
                        location: event.location,
                        category: event.category,
                        min_bid: event.minBid || event.min_bid,
                        max_bid: event.maxBid || event.max_bid,
                        image: event.image,
                        is_public: true
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <HowItWorks />
        <TestimonialSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
