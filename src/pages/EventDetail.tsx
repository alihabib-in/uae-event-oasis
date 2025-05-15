import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getEventById, events } from "../data/eventData";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, DollarSign, Package, Check, Edit } from "lucide-react";
import BidSubmissionDialog from "@/components/bid/BidSubmissionDialog";
import { supabase } from "@/integrations/supabase/client";
import EventEditor from "@/components/EventEditor/EventEditor";

// Define the event interface
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  end_date?: string; // For Supabase events
  location: string;
  venue: string;
  category: string;
  minBid: number;
  min_bid?: number; // For Supabase events
  maxBid: number;
  max_bid?: number; // For Supabase events
  attendees: number;
  organizerId?: string;
  organizer_id?: string; // For Supabase events - needs to be optional
  organizerName: string;
  organizer_name?: string; // For Supabase events
  organizerLogo?: string;
  organizer_logo?: string; // For Supabase events
  image: string;
  sponsorshipDetails: string[];
  sponsorship_details?: string[]; // For Supabase events
  status: string;
  featured?: boolean;
  is_public?: boolean; // For Supabase events
  tags?: string[];
}

// Define sponsorship package interface
interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  event_id: string;
}

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      // Try to get the event from Supabase first
      if (eventId) {
        try {
          const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("id", eventId)
            .single();

          if (!error && data) {
            // If found in Supabase, normalize data format
            const supabaseEvent: Event = {
              id: data.id,
              title: data.title,
              description: data.description || "",
              date: data.date,
              endDate: data.end_date,
              location: data.location,
              venue: data.venue || "To be announced",
              category: data.category,
              minBid: data.min_bid,
              maxBid: data.max_bid,
              attendees: data.attendees || 1000,
              // Fix: Make sure to check if organizer_id exists before accessing
              organizerId: data.user_id || undefined, // Using user_id instead of non-existent organizer_id
              organizerName: data.organizer_name || "Event Organizer",
              organizerLogo: data.organizer_logo,
              image: data.image || "/placeholder.svg",
              sponsorshipDetails: data.sponsorship_details || [
                "Logo placement on event materials",
                "Brand visibility during the event",
                "Social media promotion",
                "Speaking opportunity"
              ],
              status: data.status,
              // Fix: featured property doesn't exist in Supabase events, so default to false
              featured: false,
              tags: data.tags || []
            };
            
            setEvent(supabaseEvent);
            fetchPackages(data.id);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Error fetching from Supabase:", error);
        }
      }

      // If not found in Supabase or there was an error, try to get from static data
      const staticEvent = getEventById(eventId || "");
      if (staticEvent) {
        setEvent(staticEvent);
      }
      
      setLoading(false);
    };

    fetchEvent();
    checkIfAdmin();
  }, [eventId]);

  // Check if current user is an admin
  const checkIfAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // In a real app, you would check if the user has admin role
      // For demo purposes, we'll consider any logged-in user as admin
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  // Fetch sponsorship packages
  const fetchPackages = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('sponsorship_packages')
        .select('*')
        .eq('event_id', id)
        .order('price', { ascending: true });
      
      if (error) throw error;
      
      setPackages(data || []);
    } catch (error) {
      console.error('Error loading sponsorship packages:', error);
    }
  };

  const handleEditEvent = () => {
    setIsEditEventOpen(true);
  };

  const handleEventUpdated = () => {
    // Refresh event data
    if (eventId) {
      setLoading(true);
      const fetchEvent = async () => {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();
        
        if (!error && data) {
          const updatedEvent: Event = {
            id: data.id,
            title: data.title,
            description: data.description || "",
            date: data.date,
            endDate: data.end_date,
            location: data.location,
            venue: data.venue || "To be announced",
            category: data.category,
            minBid: data.min_bid,
            maxBid: data.max_bid,
            attendees: data.attendees || 1000,
            organizerId: data.user_id || undefined,
            organizerName: data.organizer_name || "Event Organizer",
            organizerLogo: data.organizer_logo,
            image: data.image || "/placeholder.svg",
            sponsorshipDetails: data.sponsorship_details || [],
            status: data.status,
            featured: false,
            tags: data.tags || []
          };
          
          setEvent(updatedEvent);
          fetchPackages(data.id);
        }
        setLoading(false);
      };
      fetchEvent();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
            <p className="text-gray-300">Loading event details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow py-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4 font-grotesk">Event Not Found</h1>
            <p className="text-gray-300 mb-8">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/events">Browse All Events</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Use the correct property names based on data source
  const endDate = event?.endDate || event?.end_date;
  const minBid = event?.minBid || event?.min_bid || 0;
  const maxBid = event?.maxBid || event?.max_bid || 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-12 bg-background">
        {/* Hero Section */}
        <div
          className="h-72 md:h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${event?.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
              <div className="flex justify-between items-start w-full">
                <div>
                  <Badge className="mb-4">{event?.category}</Badge>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-heading">
                    {event?.title}
                  </h1>
                  <div className="flex items-center text-white/90 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{event?.date && formatDate(event.date)}</span>
                      {endDate && <span> - {formatDate(endDate)}</span>}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{event?.venue}, {event?.location}</span>
                    </div>
                  </div>
                </div>
                
                {/* Admin Edit Button */}
                {isAdmin && (
                  <Button 
                    onClick={handleEditEvent} 
                    variant="secondary" 
                    size="sm" 
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Event
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="details">Event Details</TabsTrigger>
                  <TabsTrigger value="sponsorship">Sponsorship Info</TabsTrigger>
                  <TabsTrigger value="organizer">Organizer</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <Card className="bg-card border border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle>About This Event</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 whitespace-pre-line">
                        {event?.description}
                      </p>

                      <div className="mt-8">
                        <h3 className="font-semibold text-lg mb-3">Event Highlights</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center p-4 bg-muted/30 rounded-lg">
                            <Users className="h-5 w-5 text-primary mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Expected Attendance</p>
                              <p className="font-medium">{event?.attendees.toLocaleString()} attendees</p>
                            </div>
                          </div>
                          <div className="flex items-center p-4 bg-muted/30 rounded-lg">
                            <Calendar className="h-5 w-5 text-primary mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Duration</p>
                              <p className="font-medium">
                                {endDate 
                                  ? `${Math.ceil((new Date(endDate).getTime() - new Date(event?.date).getTime()) / (1000 * 60 * 60 * 24))} days` 
                                  : "1 day"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h3 className="font-semibold text-lg mb-2">Event Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {event?.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sponsorship">
                  <Card className="bg-card border border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle>Sponsorship Opportunities</CardTitle>
                      <CardDescription>
                        What you'll receive as a sponsor for this event
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-gray-600">
                        {(event?.sponsorshipDetails || event?.sponsorship_details || []).map((detail, index) => (
                          <li key={index} className="flex items-start">
                            <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                              {index + 1}
                            </span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Sponsorship Packages Section */}
                      {packages.length > 0 && (
                        <div className="mt-8">
                          <h3 className="font-semibold text-lg mb-4">Available Packages</h3>
                          <div className="space-y-4">
                            {packages.map((pkg) => (
                              <div 
                                key={pkg.id} 
                                className="p-4 border border-primary/20 rounded-lg bg-primary/5"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-primary" />
                                    <h4 className="font-medium">{pkg.name}</h4>
                                  </div>
                                  <span className="text-primary font-bold">AED {pkg.price.toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-600">{pkg.description}</p>
                                <ul className="mt-3 space-y-1">
                                  <li className="flex items-center text-xs text-gray-500">
                                    <Check className="h-3 w-3 mr-2 text-primary" /> All core sponsorship benefits
                                  </li>
                                  <li className="flex items-center text-xs text-gray-500">
                                    <Check className="h-3 w-3 mr-2 text-primary" /> Package-specific perks
                                  </li>
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-8">
                        <h3 className="font-semibold text-lg mb-3">Audience Demographics</h3>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <p className="mb-4 text-gray-600">
                            This is a high-profile event attracting key decision-makers, industry professionals, and enthusiasts in the {event?.category.toLowerCase()} sector.
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Age Range</p>
                              <p className="font-medium">25-45 years</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Gender Split</p>
                              <p className="font-medium">55% Male, 45% Female</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Income Level</p>
                              <p className="font-medium">High</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Interest Areas</p>
                              <p className="font-medium">{event?.category}, Innovation, UAE</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="organizer">
                  <Card className="bg-card border border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle>About the Organizer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center mb-6">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={event?.organizerLogo || event?.organizer_logo} />
                          <AvatarFallback>
                            {(event?.organizerName || event?.organizer_name || "O").charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <p className="font-semibold">{event?.organizerName || event?.organizer_name || "Event Organizer"}</p>
                          <p className="text-sm text-gray-500">Event Organizer</p>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6">
                        {event?.organizerName || event?.organizer_name || "This organization"} is a leading event management company in the UAE, 
                        specializing in {event?.category.toLowerCase()} events. With years of experience 
                        in the industry, they consistently deliver exceptional events that 
                        create memorable experiences and valuable connections.
                      </p>

                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Previous Events</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          <li>UAE Innovation Forum 2023</li>
                          <li>Dubai {event?.category} Exhibition</li>
                          <li>Middle East {event?.category} Awards</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-24 bg-card border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Sponsorship Details</CardTitle>
                  <CardDescription>
                    Submit your bid to sponsor this event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Sponsorship Range</p>
                        <p className="font-semibold">
                          AED {minBid.toLocaleString()} - {maxBid.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Event Date</p>
                        <p className="font-semibold">
                          {formatDate(event?.date)}
                          {endDate && <span> - {formatDate(endDate)}</span>}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Expected Attendance</p>
                        <p className="font-semibold">{event?.attendees.toLocaleString()} people</p>
                      </div>
                    </div>

                    <Separator className="bg-gray-200" />

                    <div className="bg-muted/30 p-4 rounded-md">
                      <p className="text-sm text-gray-600">
                        <strong>sponsorby Fee:</strong> 5% commission on successful sponsorship
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => setIsBidDialogOpen(true)}>
                    Submit Sponsorship Bid
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Similar Events Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 font-heading">Similar Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {events
                .filter((e) => e.category === event?.category && e.id !== event.id)
                .slice(0, 4)
                .map((similarEvent) => (
                  <Link key={similarEvent.id} to={`/events/${similarEvent.id}`} className="block">
                    <Card className="overflow-hidden h-full material-card">
                      <div className="aspect-[16/9] relative">
                        <img
                          src={similarEvent.image}
                          alt={similarEvent.title}
                          className="object-cover w-full h-full opacity-90"
                        />
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold text-base mb-1 line-clamp-2">
                          {similarEvent.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(similarEvent.date)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>

      {/* Bid Dialog */}
      {eventId && (
        <BidSubmissionDialog 
          eventId={eventId}
          isOpen={isBidDialogOpen}
          onOpenChange={setIsBidDialogOpen}
        />
      )}
      
      {/* Event Editor Dialog */}
      {eventId && (
        <EventEditor
          isOpen={isEditEventOpen}
          onClose={() => setIsEditEventOpen(false)}
          event={event}
          onEventUpdated={handleEventUpdated}
        />
      )}

      <Footer />
    </div>
  );
};

export default EventDetail;
