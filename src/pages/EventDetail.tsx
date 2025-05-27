import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ChevronLeft, Calendar, MapPin, Users, History, Target, TrendingUp, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BidSubmissionDialog from "@/components/bid/BidSubmissionDialog";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<any[]>([]);
  const [targetAudience, setTargetAudience] = useState<any | null>(null);
  const [history, setHistory] = useState<any | null>(null);
  const [marketing, setMarketing] = useState<any | null>(null);
  const [showBidDialog, setShowBidDialog] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        // Fetch the event from Supabase
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", id)
          .single();

        if (eventError) {
          throw eventError;
        }

        if (eventData) {
          setEvent(eventData);
          
          // Fetch sponsorship packages
          const { data: packagesData, error: packagesError } = await supabase
            .from("sponsorship_packages")
            .select("*")
            .eq("event_id", eventData.id)
            .order("price", { ascending: true });
            
          if (packagesError) {
            throw packagesError;
          }
          
          setPackages(packagesData || []);

          // Fetch target audience data
          const { data: audienceData, error: audienceError } = await supabase
            .from("event_target_audience")
            .select("*")
            .eq("event_id", eventData.id)
            .maybeSingle();
            
          if (!audienceError && audienceData) {
            setTargetAudience(audienceData);
          }

          // Fetch history data
          const { data: historyData, error: historyError } = await supabase
            .from("event_history")
            .select("*")
            .eq("event_id", eventData.id)
            .maybeSingle();
            
          if (!historyError && historyData) {
            setHistory(historyData);
          }

          // Fetch marketing data
          const { data: marketingData, error: marketingError } = await supabase
            .from("event_marketing")
            .select("*")
            .eq("event_id", eventData.id)
            .maybeSingle();
            
          if (!marketingError && marketingData) {
            setMarketing(marketingData);
          }
        }
      } catch (error: any) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleBidSubmission = () => {
    setShowBidDialog(true);
  };

  if (loading) {
    return <div>Loading event details...</div>;
  }

  if (!event) {
    return <div>Event not found in database or static data.</div>;
  }

  const hasAdditionalData = targetAudience || history || marketing;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-80 w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: event.image 
              ? `url(${event.image})` 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">{event.title}</h1>
            <div className="flex items-center justify-center space-x-6 text-lg">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                {format(new Date(event.date), "PPP")}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                {event.location}
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                {event.attendees?.toLocaleString()} attendees
              </div>
            </div>
          </div>
        </div>
        <Button asChild variant="ghost" className="absolute top-4 left-4 text-white hover:bg-white/20">
          <Link to="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        <Badge variant={event.is_public ? "default" : "secondary"} className="absolute top-4 right-4">
          {event.is_public ? "Public" : "Hidden"}
        </Badge>
      </div>

      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Description */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Venue:</span>
                      <p>{event.venue}</p>
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>
                      <p className="capitalize">{event.category}</p>
                    </div>
                    <div>
                      <span className="font-medium">Organizer:</span>
                      <p>{event.organizer_name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Bid Range:</span>
                      <p>AED {event.min_bid?.toLocaleString()} - {event.max_bid?.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* External Links */}
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Event Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                      href="#"
                      className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group"
                    >
                      <div className="text-center">
                        <div className="text-blue-600 font-semibold group-hover:text-blue-700">Official Website</div>
                        <div className="text-sm text-gray-500">Visit event page</div>
                      </div>
                      <ExternalLink className="ml-2 h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-green-400 hover:shadow-md transition-all group"
                    >
                      <div className="text-center">
                        <div className="text-green-600 font-semibold group-hover:text-green-700">Tickets</div>
                        <div className="text-sm text-gray-500">Buy tickets</div>
                      </div>
                      <ExternalLink className="ml-2 h-4 w-4 text-gray-400 group-hover:text-green-600" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all group"
                    >
                      <div className="text-center">
                        <div className="text-purple-600 font-semibold group-hover:text-purple-700">Social Media</div>
                        <div className="text-sm text-gray-500">Follow updates</div>
                      </div>
                      <ExternalLink className="ml-2 h-4 w-4 text-gray-400 group-hover:text-purple-600" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Event Insights */}
              {hasAdditionalData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Event Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="audience" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        {targetAudience && (
                          <TabsTrigger value="audience">
                            <Target className="mr-2 h-4 w-4" />
                            Target Audience
                          </TabsTrigger>
                        )}
                        {history && (
                          <TabsTrigger value="history">
                            <History className="mr-2 h-4 w-4" />
                            History
                          </TabsTrigger>
                        )}
                        {marketing && (
                          <TabsTrigger value="marketing">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Marketing
                          </TabsTrigger>
                        )}
                      </TabsList>

                      {targetAudience && (
                        <TabsContent value="audience" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {targetAudience.age_groups && targetAudience.age_groups.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Age Groups</h4>
                                <div className="flex flex-wrap gap-2">
                                  {targetAudience.age_groups.map((age: string) => (
                                    <Badge key={age} variant="outline">{age}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {targetAudience.gender_distribution && (
                              <div>
                                <h4 className="font-medium mb-2">Gender Distribution</h4>
                                <div className="space-y-1 text-sm">
                                  <div>Male: {targetAudience.gender_distribution.male}%</div>
                                  <div>Female: {targetAudience.gender_distribution.female}%</div>
                                  <div>Other: {targetAudience.gender_distribution.other}%</div>
                                </div>
                              </div>
                            )}

                            {targetAudience.income_levels && targetAudience.income_levels.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Income Levels</h4>
                                <div className="flex flex-wrap gap-2">
                                  {targetAudience.income_levels.map((income: string) => (
                                    <Badge key={income} variant="outline">{income}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {targetAudience.interests && targetAudience.interests.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Interests</h4>
                                <div className="flex flex-wrap gap-2">
                                  {targetAudience.interests.map((interest: string) => (
                                    <Badge key={interest} variant="secondary">{interest}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {targetAudience.geographic_location && targetAudience.geographic_location.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Geographic Location</h4>
                                <div className="flex flex-wrap gap-2">
                                  {targetAudience.geographic_location.map((location: string) => (
                                    <Badge key={location} variant="outline">{location}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {targetAudience.profession_types && targetAudience.profession_types.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Profession Types</h4>
                                <div className="flex flex-wrap gap-2">
                                  {targetAudience.profession_types.map((profession: string) => (
                                    <Badge key={profession} variant="outline">{profession}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      )}

                      {history && (
                        <TabsContent value="history" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {history.previous_editions && (
                              <div>
                                <h4 className="font-medium mb-2">Previous Editions</h4>
                                <div className="space-y-1 text-sm">
                                  <div>Total Editions: {history.previous_editions.total_editions}</div>
                                  <div>Years Running: {history.previous_editions.years_running}</div>
                                </div>
                              </div>
                            )}

                            {history.attendance_growth && (
                              <div>
                                <h4 className="font-medium mb-2">Attendance Growth</h4>
                                <div className="space-y-1 text-sm">
                                  <div>Year over Year: {history.attendance_growth.year_over_year}%</div>
                                  <div>Total Growth: {history.attendance_growth.total_growth}%</div>
                                </div>
                              </div>
                            )}

                            {history.notable_sponsors && history.notable_sponsors.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Notable Sponsors</h4>
                                <div className="flex flex-wrap gap-2">
                                  {history.notable_sponsors.map((sponsor: string) => (
                                    <Badge key={sponsor} variant="secondary">{sponsor}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {history.awards_recognition && history.awards_recognition.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Awards & Recognition</h4>
                                <div className="flex flex-wrap gap-2">
                                  {history.awards_recognition.map((award: string) => (
                                    <Badge key={award} variant="outline">{award}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {history.media_coverage && (
                              <div>
                                <h4 className="font-medium mb-2">Media Coverage</h4>
                                <div className="space-y-1 text-sm">
                                  <div>TV: {history.media_coverage.tv}</div>
                                  <div>Print: {history.media_coverage.print}</div>
                                  <div>Online: {history.media_coverage.online}</div>
                                  <div>Social Media: {history.media_coverage.social_media}</div>
                                </div>
                              </div>
                            )}

                            {history.success_stories && history.success_stories.length > 0 && (
                              <div className="md:col-span-2">
                                <h4 className="font-medium mb-2">Success Stories</h4>
                                <div className="space-y-2">
                                  {history.success_stories.map((story: string, index: number) => (
                                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">{story}</div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      )}

                      {marketing && (
                        <TabsContent value="marketing" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {marketing.marketing_channels && marketing.marketing_channels.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Marketing Channels</h4>
                                <div className="flex flex-wrap gap-2">
                                  {marketing.marketing_channels.map((channel: string) => (
                                    <Badge key={channel} variant="outline">{channel}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {marketing.social_media_reach && (
                              <div>
                                <h4 className="font-medium mb-2">Social Media Reach</h4>
                                <div className="space-y-1 text-sm">
                                  <div>Facebook: {marketing.social_media_reach.facebook?.toLocaleString()}</div>
                                  <div>Instagram: {marketing.social_media_reach.instagram?.toLocaleString()}</div>
                                  <div>Twitter: {marketing.social_media_reach.twitter?.toLocaleString()}</div>
                                  <div>LinkedIn: {marketing.social_media_reach.linkedin?.toLocaleString()}</div>
                                  <div>YouTube: {marketing.social_media_reach.youtube?.toLocaleString()}</div>
                                </div>
                              </div>
                            )}

                            {marketing.advertising_budget && (
                              <div>
                                <h4 className="font-medium mb-2">Advertising Budget</h4>
                                <div className="text-lg font-semibold">AED {marketing.advertising_budget.toLocaleString()}</div>
                              </div>
                            )}

                            {marketing.expected_reach && (
                              <div>
                                <h4 className="font-medium mb-2">Expected Reach</h4>
                                <div className="space-y-1 text-sm">
                                  <div>Online: {marketing.expected_reach.online?.toLocaleString()}</div>
                                  <div>Offline: {marketing.expected_reach.offline?.toLocaleString()}</div>
                                  <div>Total: {marketing.expected_reach.total?.toLocaleString()}</div>
                                </div>
                              </div>
                            )}

                            {marketing.promotional_materials && marketing.promotional_materials.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Promotional Materials</h4>
                                <div className="flex flex-wrap gap-2">
                                  {marketing.promotional_materials.map((material: string) => (
                                    <Badge key={material} variant="secondary">{material}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {marketing.media_partnerships && marketing.media_partnerships.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Media Partnerships</h4>
                                <div className="flex flex-wrap gap-2">
                                  {marketing.media_partnerships.map((partnership: string) => (
                                    <Badge key={partnership} variant="outline">{partnership}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {marketing.influencer_collaborations && marketing.influencer_collaborations.length > 0 && (
                              <div className="md:col-span-2">
                                <h4 className="font-medium mb-2">Influencer Collaborations</h4>
                                <div className="flex flex-wrap gap-2">
                                  {marketing.influencer_collaborations.map((influencer: string) => (
                                    <Badge key={influencer} variant="secondary">{influencer}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      )}
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sponsorship Packages - Highlighted */}
              <Card className="border-2 border-gold bg-gradient-to-br from-gold/5 to-gold/10 shadow-lg">
                <CardHeader className="bg-gold text-white rounded-t-lg">
                  <CardTitle className="text-xl">Sponsorship Packages</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {packages.length > 0 ? (
                    <div className="space-y-4">
                      {packages.map((pkg) => (
                        <div key={pkg.id} className="bg-white border border-gold/20 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                          <h3 className="font-semibold text-lg mb-2">{pkg.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-gold/10 text-gold-dark border-gold/30">
                              AED {pkg.price.toLocaleString()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No sponsorship packages available for this event.</p>
                  )}
                </CardContent>
              </Card>

              {/* CTA Button */}
              <Button onClick={handleBidSubmission} className="w-full bg-gold hover:bg-gold-dark text-black font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all">
                Submit a Sponsorship Bid
              </Button>

              {/* Event Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected Attendees</span>
                    <span className="font-semibold">{event.attendees?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-semibold capitalize">{event.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bid Range</span>
                    <span className="font-semibold">AED {event.min_bid?.toLocaleString()} - {event.max_bid?.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <BidSubmissionDialog
        isOpen={showBidDialog}
        onOpenChange={setShowBidDialog}
        eventId={id || ""}
        eventTitle={event.title}
      />
    </div>
  );
};

export default EventDetail;
