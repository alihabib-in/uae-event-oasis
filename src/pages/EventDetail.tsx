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
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-gray-600">Loading event details...</div>
    </div>;
  }

  if (!event) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-gray-600">Event not found in database or static data.</div>
    </div>;
  }

  const hasAdditionalData = targetAudience || history || marketing;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-80 w-full overflow-hidden bg-gradient-to-b from-gray-900 to-gray-700">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: event.image 
              ? `url(${event.image})` 
              : 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">{event.title}</h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-lg">
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
        <Button asChild variant="ghost" className="absolute top-4 left-4 text-white hover:bg-white/20 border border-white/30">
          <Link to="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        <Badge 
          variant={event.is_public ? "default" : "secondary"} 
          className={`absolute top-4 right-4 ${event.is_public ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-800'}`}
        >
          {event.is_public ? "Public" : "Hidden"}
        </Badge>
      </div>

      <main className="flex-1 py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Basic Info */}
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                    <div className="space-y-1">
                      <span className="font-semibold text-gray-900">Venue</span>
                      <p className="text-gray-600">{event.venue}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-semibold text-gray-900">Category</span>
                      <p className="text-gray-600 capitalize">{event.category}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-semibold text-gray-900">Organizer</span>
                      <p className="text-gray-600">{event.organizer_name}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-semibold text-gray-900">Bid Range</span>
                      <p className="text-gray-600">AED {event.min_bid?.toLocaleString()} - {event.max_bid?.toLocaleString()}</p>
                    </div>
                  </div>
                  {event.description && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{event.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* External Links */}
              <Card className="border-gray-300 bg-gray-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Event Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                      href="#"
                      className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all group"
                    >
                      <div className="text-center">
                        <div className="text-gray-900 font-semibold group-hover:text-black">Official Website</div>
                        <div className="text-sm text-gray-500">Visit event page</div>
                      </div>
                      <ExternalLink className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all group"
                    >
                      <div className="text-center">
                        <div className="text-gray-900 font-semibold group-hover:text-black">Tickets</div>
                        <div className="text-sm text-gray-500">Buy tickets</div>
                      </div>
                      <ExternalLink className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all group"
                    >
                      <div className="text-center">
                        <div className="text-gray-900 font-semibold group-hover:text-black">Social Media</div>
                        <div className="text-sm text-gray-500">Follow updates</div>
                      </div>
                      <ExternalLink className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Event Insights - Redesigned */}
              {hasAdditionalData && (
                <Card className="border-gray-200 bg-white shadow-sm">
                  <CardHeader className="bg-gray-900 text-white rounded-t-lg">
                    <CardTitle className="text-xl">Event Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Tabs defaultValue="audience" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-none border-b border-gray-200">
                        {targetAudience && (
                          <TabsTrigger value="audience" className="data-[state=active]:bg-white data-[state=active]:text-black">
                            <Target className="mr-2 h-4 w-4" />
                            Target Audience
                          </TabsTrigger>
                        )}
                        {history && (
                          <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-black">
                            <History className="mr-2 h-4 w-4" />
                            History
                          </TabsTrigger>
                        )}
                        {marketing && (
                          <TabsTrigger value="marketing" className="data-[state=active]:bg-white data-[state=active]:text-black">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Marketing
                          </TabsTrigger>
                        )}
                      </TabsList>

                      {targetAudience && (
                        <TabsContent value="audience" className="space-y-6 p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {targetAudience.age_groups && targetAudience.age_groups.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Age Groups</h4>
                                <div className="flex flex-wrap gap-2">
                                  {targetAudience.age_groups.map((age: string) => (
                                    <Badge key={age} variant="outline" className="border-gray-300 text-gray-700">{age}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {targetAudience.gender_distribution && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Gender Distribution</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Male:</span>
                                    <span className="font-medium text-gray-900">{targetAudience.gender_distribution.male}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Female:</span>
                                    <span className="font-medium text-gray-900">{targetAudience.gender_distribution.female}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Other:</span>
                                    <span className="font-medium text-gray-900">{targetAudience.gender_distribution.other}%</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {targetAudience.income_levels && targetAudience.income_levels.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Income Levels</h4>
                                <div className="flex flex-wrap gap-2">
                                  {targetAudience.income_levels.map((income: string) => (
                                    <Badge key={income} variant="outline" className="border-gray-300 text-gray-700">{income}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {targetAudience.interests && targetAudience.interests.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Interests</h4>
                                <div className="flex flex-wrap gap-2">
                                  {targetAudience.interests.map((interest: string) => (
                                    <Badge key={interest} className="bg-gray-800 text-white hover:bg-gray-700">{interest}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {targetAudience.geographic_location && targetAudience.geographic_location.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Geographic Location</h4>
                                <div className="flex flex-wrap gap-2">
                                  {targetAudience.geographic_location.map((location: string) => (
                                    <Badge key={location} variant="outline" className="border-gray-300 text-gray-700">{location}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {targetAudience.profession_types && targetAudience.profession_types.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Profession Types</h4>
                                <div className="flex flex-wrap gap-2">
                                  {targetAudience.profession_types.map((profession: string) => (
                                    <Badge key={profession} variant="outline" className="border-gray-300 text-gray-700">{profession}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      )}

                      {history && (
                        <TabsContent value="history" className="space-y-6 p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {history.previous_editions && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Previous Editions</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Total Editions:</span>
                                    <span className="font-medium text-gray-900">{history.previous_editions.total_editions}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Years Running:</span>
                                    <span className="font-medium text-gray-900">{history.previous_editions.years_running}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {history.attendance_growth && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Attendance Growth</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Year over Year:</span>
                                    <span className="font-medium text-gray-900">{history.attendance_growth.year_over_year}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Total Growth:</span>
                                    <span className="font-medium text-gray-900">{history.attendance_growth.total_growth}%</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {history.notable_sponsors && history.notable_sponsors.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Notable Sponsors</h4>
                                <div className="flex flex-wrap gap-2">
                                  {history.notable_sponsors.map((sponsor: string) => (
                                    <Badge key={sponsor} className="bg-gray-800 text-white hover:bg-gray-700">{sponsor}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {history.awards_recognition && history.awards_recognition.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Awards & Recognition</h4>
                                <div className="flex flex-wrap gap-2">
                                  {history.awards_recognition.map((award: string) => (
                                    <Badge key={award} variant="outline" className="border-gray-300 text-gray-700">{award}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {history.media_coverage && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Media Coverage</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">TV:</span>
                                    <span className="font-medium text-gray-900">{history.media_coverage.tv}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Print:</span>
                                    <span className="font-medium text-gray-900">{history.media_coverage.print}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Online:</span>
                                    <span className="font-medium text-gray-900">{history.media_coverage.online}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Social Media:</span>
                                    <span className="font-medium text-gray-900">{history.media_coverage.social_media}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {history.success_stories && history.success_stories.length > 0 && (
                              <div className="md:col-span-2 space-y-3">
                                <h4 className="font-semibold text-gray-900">Success Stories</h4>
                                <div className="space-y-3">
                                  {history.success_stories.map((story: string, index: number) => (
                                    <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-200">{story}</div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      )}

                      {marketing && (
                        <TabsContent value="marketing" className="space-y-6 p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {marketing.marketing_channels && marketing.marketing_channels.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Marketing Channels</h4>
                                <div className="flex flex-wrap gap-2">
                                  {marketing.marketing_channels.map((channel: string) => (
                                    <Badge key={channel} variant="outline" className="border-gray-300 text-gray-700">{channel}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {marketing.social_media_reach && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Social Media Reach</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Facebook:</span>
                                    <span className="font-medium text-gray-900">{marketing.social_media_reach.facebook?.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Instagram:</span>
                                    <span className="font-medium text-gray-900">{marketing.social_media_reach.instagram?.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Twitter:</span>
                                    <span className="font-medium text-gray-900">{marketing.social_media_reach.twitter?.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">LinkedIn:</span>
                                    <span className="font-medium text-gray-900">{marketing.social_media_reach.linkedin?.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">YouTube:</span>
                                    <span className="font-medium text-gray-900">{marketing.social_media_reach.youtube?.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {marketing.advertising_budget && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Advertising Budget</h4>
                                <div className="text-2xl font-bold text-gray-900">AED {marketing.advertising_budget.toLocaleString()}</div>
                              </div>
                            )}

                            {marketing.expected_reach && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Expected Reach</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Online:</span>
                                    <span className="font-medium text-gray-900">{marketing.expected_reach.online?.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Offline:</span>
                                    <span className="font-medium text-gray-900">{marketing.expected_reach.offline?.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Total:</span>
                                    <span className="font-medium text-gray-900">{marketing.expected_reach.total?.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {marketing.promotional_materials && marketing.promotional_materials.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Promotional Materials</h4>
                                <div className="flex flex-wrap gap-2">
                                  {marketing.promotional_materials.map((material: string) => (
                                    <Badge key={material} className="bg-gray-800 text-white hover:bg-gray-700">{material}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {marketing.media_partnerships && marketing.media_partnerships.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">Media Partnerships</h4>
                                <div className="flex flex-wrap gap-2">
                                  {marketing.media_partnerships.map((partnership: string) => (
                                    <Badge key={partnership} variant="outline" className="border-gray-300 text-gray-700">{partnership}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {marketing.influencer_collaborations && marketing.influencer_collaborations.length > 0 && (
                              <div className="md:col-span-2 space-y-3">
                                <h4 className="font-semibold text-gray-900">Influencer Collaborations</h4>
                                <div className="flex flex-wrap gap-2">
                                  {marketing.influencer_collaborations.map((influencer: string) => (
                                    <Badge key={influencer} className="bg-gray-800 text-white hover:bg-gray-700">{influencer}</Badge>
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
              <Card className="border-2 border-gray-900 bg-white shadow-lg">
                <CardHeader className="bg-gray-900 text-white rounded-t-lg">
                  <CardTitle className="text-xl">Sponsorship Packages</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {packages.length > 0 ? (
                    <div className="space-y-4">
                      {packages.map((pkg) => (
                        <div key={pkg.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h3 className="font-semibold text-lg mb-2 text-gray-900">{pkg.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-gray-800 text-white">
                              AED {pkg.price.toLocaleString()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">No sponsorship packages available for this event.</p>
                  )}
                </CardContent>
              </Card>

              {/* CTA Button */}
              <Button onClick={handleBidSubmission} className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all">
                Submit a Sponsorship Bid
              </Button>

              {/* Event Stats */}
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Attendees</span>
                    <span className="font-semibold text-gray-900">{event.attendees?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold text-gray-900 capitalize">{event.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bid Range</span>
                    <span className="font-semibold text-gray-900">AED {event.min_bid?.toLocaleString()} - {event.max_bid?.toLocaleString()}</span>
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
