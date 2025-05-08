
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import { events } from "../data/eventData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from "lucide-react";

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  const categories = Array.from(new Set(events.map((event) => event.category)));

  const filteredEvents = events.filter((event) => {
    // Filter by search query
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by category
    const matchesCategory = selectedCategory === "" || event.category === selectedCategory;

    // Filter by price range
    const matchesPriceRange = 
      event.minBid >= priceRange[0] && event.maxBid <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPriceRange;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 mb-8 border border-white/5">
            <h1 className="text-3xl font-bold mb-4 font-grotesk tracking-tight text-white">Discover Sponsorship Opportunities</h1>
            <p className="text-lg text-gray-300 max-w-3xl">
              Browse through a curated selection of events across the UAE looking for brand sponsors.
              Find the perfect match for your marketing objectives and audience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters */}
            <div className="lg:col-span-1">
              <div className="bg-card/40 backdrop-blur-sm p-6 rounded-lg border border-white/10 sticky top-20">
                <h2 className="text-xl font-semibold mb-4 text-white font-grotesk">Filters</h2>
                
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search events..."
                      className="pl-10 bg-background/50 border-white/10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <Accordion type="single" collapsible defaultValue="category" className="text-white">
                  <AccordionItem value="category">
                    <AccordionTrigger className="text-sm font-medium">
                      Event Category
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center">
                          <input
                            id="all"
                            type="radio"
                            name="category"
                            className="h-4 w-4 text-primary"
                            checked={selectedCategory === ""}
                            onChange={() => setSelectedCategory("")}
                          />
                          <label htmlFor="all" className="ml-2 text-sm text-gray-300">
                            All Categories
                          </label>
                        </div>
                        {categories.map((category) => (
                          <div key={category} className="flex items-center">
                            <input
                              id={category}
                              type="radio"
                              name="category"
                              className="h-4 w-4 text-primary"
                              checked={selectedCategory === category}
                              onChange={() => setSelectedCategory(category)}
                            />
                            <label htmlFor={category} className="ml-2 text-sm text-gray-300">
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="budget">
                    <AccordionTrigger className="text-sm font-medium">
                      Budget Range
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="text-sm mb-1 block text-gray-300">Min Budget (AED)</label>
                          <Select onValueChange={(value) => setPriceRange([parseInt(value), priceRange[1]])}>
                            <SelectTrigger className="bg-background/50 border-white/10">
                              <SelectValue placeholder="Min Budget" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="0">Any</SelectItem>
                                <SelectItem value="10000">10,000</SelectItem>
                                <SelectItem value="25000">25,000</SelectItem>
                                <SelectItem value="50000">50,000</SelectItem>
                                <SelectItem value="100000">100,000</SelectItem>
                                <SelectItem value="250000">250,000</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm mb-1 block text-gray-300">Max Budget (AED)</label>
                          <Select onValueChange={(value) => setPriceRange([priceRange[0], parseInt(value)])}>
                            <SelectTrigger className="bg-background/50 border-white/10">
                              <SelectValue placeholder="Max Budget" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="1000000">Any</SelectItem>
                                <SelectItem value="50000">50,000</SelectItem>
                                <SelectItem value="100000">100,000</SelectItem>
                                <SelectItem value="200000">200,000</SelectItem>
                                <SelectItem value="500000">500,000</SelectItem>
                                <SelectItem value="1000000">1,000,000+</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="location">
                    <AccordionTrigger className="text-sm font-medium">
                      Location
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {["Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah"].map((location) => (
                          <div key={location} className="flex items-center">
                            <input
                              id={location}
                              type="checkbox"
                              className="h-4 w-4 text-primary rounded"
                            />
                            <label htmlFor={location} className="ml-2 text-sm text-gray-300">
                              {location}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Button className="w-full mt-6">Apply Filters</Button>
                <Button variant="outline" className="w-full mt-2 border-white/10" onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                  setPriceRange([0, 1000000]);
                }}>
                  Clear All
                </Button>
              </div>
            </div>

            {/* Event Listings */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-300">
                  Showing <span className="font-medium text-white">{filteredEvents.length}</span> events
                </p>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px] bg-background/50 border-white/10">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="budget-high">Highest Budget</SelectItem>
                    <SelectItem value="budget-low">Lowest Budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="bg-card/40 backdrop-blur-sm rounded-lg p-8 text-center border border-white/10">
                  <h3 className="text-xl font-medium mb-2 text-white">No events found</h3>
                  <p className="text-gray-300 mb-4">
                    Try adjusting your filters to find more results.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                      setPriceRange([0, 1000000]);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredEvents.map((event) => (
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
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventsPage;
