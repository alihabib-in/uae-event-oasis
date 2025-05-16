
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ChevronLeft, Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BidSubmissionDialog from "@/components/bid/BidSubmissionDialog";
import EventInfoCard from "@/components/bid/EventInfoCard";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<any[]>([]);
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

  const handleBidDialogClose = () => {
    setShowBidDialog(false);
  };

  if (loading) {
    return <div>Loading event details...</div>;
  }

  if (!event) {
    return <div>Event not found in database or static data.</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          <div className="md:flex md:items-center md:justify-between mb-4">
            <Button asChild variant="ghost" className="mb-2 md:mb-0">
              <Link to="/">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Events
              </Link>
            </Button>
            <Badge variant={event.is_public ? "default" : "secondary"}>
              {event.is_public ? "Public" : "Hidden"}
            </Badge>
          </div>

          <EventInfoCard event={event} />

          <Card className="mb-4">
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold mb-4">Sponsorship Packages</h2>
              {packages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="border rounded-md p-4">
                      <h3 className="font-medium">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground">{pkg.description}</p>
                      <div className="mt-2">
                        <Badge variant="secondary">AED {pkg.price.toLocaleString()}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No sponsorship packages available for this event.</p>
              )}
            </CardContent>
          </Card>

          <Button onClick={handleBidSubmission} className="w-full">
            Submit a Bid
          </Button>
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
