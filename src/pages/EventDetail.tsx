
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";

const EventDetail = () => {
  const { eventId } = useParams();
  const event = getEventById(eventId || "");
  const [bidAmount, setBidAmount] = useState<string>("");
  const [bidMessage, setBidMessage] = useState<string>("");
  const { toast } = useToast();

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

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate bid amount
    const amount = Number(bidAmount);
    if (isNaN(amount) || amount < event.minBid || amount > event.maxBid) {
      toast({
        variant: "destructive",
        title: "Invalid bid amount",
        description: `Please enter a bid between AED ${event.minBid.toLocaleString()} and AED ${event.maxBid.toLocaleString()}.`,
      });
      return;
    }

    // Validate bid message
    if (bidMessage.trim().length < 20) {
      toast({
        variant: "destructive",
        title: "Message too short",
        description: "Please provide a more detailed message about your sponsorship interest.",
      });
      return;
    }

    // Success message
    toast({
      title: "Bid submitted successfully!",
      description: "The event organizer will review your bid and contact you soon.",
    });

    // Clear form
    setBidAmount("");
    setBidMessage("");
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-12 bg-background">
        {/* Hero Section */}
        <div
          className="h-72 md:h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${event.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
              <Badge className="mb-4">{event.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-grotesk">
                {event.title}
              </h1>
              <div className="flex items-center text-white/90 space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(event.date)}</span>
                  {event.endDate && <span> - {formatDate(event.endDate)}</span>}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{event.venue}, {event.location}</span>
                </div>
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
                  <Card className="bg-card/40 backdrop-blur-sm border border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">About This Event</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 whitespace-pre-line">
                        {event.description}
                      </p>

                      <div className="mt-8">
                        <h3 className="font-semibold text-lg mb-3 text-white">Event Highlights</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center p-4 bg-muted/30 rounded-lg">
                            <Users className="h-5 w-5 text-primary mr-3" />
                            <div>
                              <p className="text-sm text-gray-300">Expected Attendance</p>
                              <p className="font-medium text-white">{event.attendees.toLocaleString()} attendees</p>
                            </div>
                          </div>
                          <div className="flex items-center p-4 bg-muted/30 rounded-lg">
                            <Calendar className="h-5 w-5 text-primary mr-3" />
                            <div>
                              <p className="text-sm text-gray-300">Duration</p>
                              <p className="font-medium text-white">
                                {event.endDate 
                                  ? `${Math.ceil((new Date(event.endDate).getTime() - new Date(event.date).getTime()) / (1000 * 60 * 60 * 24))} days` 
                                  : "1 day"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h3 className="font-semibold text-lg mb-2 text-white">Event Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {event.tags?.map((tag) => (
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
                  <Card className="bg-card/40 backdrop-blur-sm border border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Sponsorship Opportunities</CardTitle>
                      <CardDescription className="text-gray-300">
                        What you'll receive as a sponsor for this event
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-gray-300">
                        {event.sponsorshipDetails.map((detail, index) => (
                          <li key={index} className="flex items-start">
                            <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                              {index + 1}
                            </span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8">
                        <h3 className="font-semibold text-lg mb-3 text-white">Audience Demographics</h3>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <p className="mb-4 text-gray-300">
                            This is a high-profile event attracting key decision-makers, industry professionals, and enthusiasts in the {event.category.toLowerCase()} sector.
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-400">Age Range</p>
                              <p className="font-medium text-white">25-45 years</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Gender Split</p>
                              <p className="font-medium text-white">55% Male, 45% Female</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Income Level</p>
                              <p className="font-medium text-white">High</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Interest Areas</p>
                              <p className="font-medium text-white">{event.category}, Innovation, UAE</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="organizer">
                  <Card className="bg-card/40 backdrop-blur-sm border border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">About the Organizer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center mb-6">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={event.organizerLogo} />
                          <AvatarFallback>
                            {event.organizerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <p className="font-semibold text-white">{event.organizerName}</p>
                          <p className="text-sm text-gray-300">Event Organizer</p>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-6">
                        {event.organizerName} is a leading event management company in the UAE, 
                        specializing in {event.category.toLowerCase()} events. With years of experience 
                        in the industry, they consistently deliver exceptional events that 
                        create memorable experiences and valuable connections.
                      </p>

                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-medium mb-2 text-white">Previous Events</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-300">
                          <li>UAE Innovation Forum 2023</li>
                          <li>Dubai {event.category} Exhibition</li>
                          <li>Middle East {event.category} Awards</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-24 bg-card/40 backdrop-blur-sm border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Sponsorship Details</CardTitle>
                  <CardDescription className="text-gray-300">
                    Submit your bid to sponsor this event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-sm text-gray-300">Sponsorship Range</p>
                        <p className="font-semibold text-white">
                          AED {event.minBid.toLocaleString()} - {event.maxBid.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-sm text-gray-300">Event Date</p>
                        <p className="font-semibold text-white">
                          {formatDate(event.date)}
                          {event.endDate && <span> - {formatDate(event.endDate)}</span>}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-sm text-gray-300">Expected Attendance</p>
                        <p className="font-semibold text-white">{event.attendees.toLocaleString()} people</p>
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="bg-muted/30 p-4 rounded-md">
                      <p className="text-sm text-gray-300">
                        <strong>sponsorby Fee:</strong> 5% commission on successful sponsorship
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">Submit Sponsorship Bid</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px] bg-card/95 backdrop-blur-sm border border-white/10">
                      <form onSubmit={handleBidSubmit}>
                        <DialogHeader>
                          <DialogTitle className="text-white">Submit Your Bid</DialogTitle>
                          <DialogDescription className="text-gray-300">
                            Enter your bid amount and message to the event organizer.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bidAmount" className="col-span-4 text-white">
                              Bid Amount (AED)
                              <span className="text-sm text-muted-foreground ml-2">
                                Range: {event.minBid.toLocaleString()} - {event.maxBid.toLocaleString()}
                              </span>
                            </Label>
                            <div className="col-span-4">
                              <Input
                                id="bidAmount"
                                type="number"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                placeholder="Enter your bid amount"
                                className="w-full bg-background/50 border-white/10"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bidMessage" className="col-span-4 text-white">
                              Message to Organizer
                            </Label>
                            <Textarea
                              id="bidMessage"
                              value={bidMessage}
                              onChange={(e) => setBidMessage(e.target.value)}
                              placeholder="Tell the organizer why you're interested in sponsoring this event and how your brand would be a good fit"
                              className="col-span-4 bg-background/50 border-white/10"
                              rows={5}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Submit Bid</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Similar Events Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-white font-grotesk">Similar Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {events
                .filter((e) => e.category === event.category && e.id !== event.id)
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
                        <h3 className="font-semibold text-base mb-1 line-clamp-2 text-white">
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
      <Footer />
    </div>
  );
};

export default EventDetail;
