
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EventsTable from "./events/EventsTable";
import PackagesDialog from "./events/PackagesDialog";
import DeleteEventDialog from "./events/DeleteEventDialog";

interface EventsTabProps {
  onEditEvent: (event: any) => void;
}

const EventsTab = ({ onEditEvent }: EventsTabProps) => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingPackages, setViewingPackages] = useState<{
    eventId: string;
    packages: any[];
    eventTitle: string;
  } | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      toast.error(`Failed to load events: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPackages = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from("sponsorship_packages")
        .select("*")
        .eq("event_id", eventId)
        .order("price", { ascending: true });

      if (error) throw error;

      setViewingPackages({
        eventId,
        packages: data || [],
        eventTitle: events.find((e) => e.id === eventId)?.title || "Event"
      });
    } catch (error: any) {
      console.error("Error fetching packages:", error);
      toast.error(`Failed to load packages: ${error.message}`);
    }
  };

  const handleEditEvent = (event: any) => {
    console.log("Edit event clicked in EventsTab:", event);
    // Ensure we're passing the full event object to the parent component
    if (onEditEvent && typeof onEditEvent === 'function') {
      onEditEvent(event);
    } else {
      console.error("onEditEvent is not a function or not provided");
    }
  };
  
  const handleDeleteEvent = (eventId: string) => {
    setEventToDelete(eventId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    try {
      // First delete related sponsorship packages
      const { error: packagesError } = await supabase
        .from("sponsorship_packages")
        .delete()
        .eq("event_id", eventToDelete);
        
      if (packagesError) throw packagesError;
      
      // Then delete the event
      const { error: eventError } = await supabase
        .from("events")
        .delete()
        .eq("id", eventToDelete);
        
      if (eventError) throw eventError;
      
      toast.success("Event deleted successfully");
      setIsDeleteDialogOpen(false);
      fetchEvents();
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast.error(`Failed to delete event: ${error.message}`);
    }
  };
  
  const addSampleEvents = async () => {
    setIsLoading(true);
    try {
      const sampleEvents = [
        {
          title: "Tech Conference 2025",
          date: new Date("2025-09-15").toISOString(),
          end_date: new Date("2025-09-17").toISOString(),
          location: "Dubai",
          venue: "Dubai World Trade Centre",
          description: "Annual conference featuring the latest in technology and innovation",
          category: "Technology",
          organizer_name: "TechEvents UAE",
          attendees: 2000,
          min_bid: 5000,
          max_bid: 50000,
          phone: "+971501234567",
          is_public: true,
          tags: ["technology", "innovation", "networking"]
        },
        {
          title: "Fashion Week Dubai",
          date: new Date("2025-11-10").toISOString(),
          end_date: new Date("2025-11-15").toISOString(),
          location: "Dubai",
          venue: "Dubai Design District",
          description: "Showcasing the latest trends in fashion from local and international designers",
          category: "Fashion",
          organizer_name: "Dubai Fashion Council",
          attendees: 1500,
          min_bid: 10000,
          max_bid: 100000,
          phone: "+971502345678",
          is_public: true,
          tags: ["fashion", "design", "runway"]
        },
        {
          title: "UAE Food Festival",
          date: new Date("2025-03-05").toISOString(),
          end_date: new Date("2025-03-15").toISOString(),
          location: "Abu Dhabi",
          venue: "Yas Island",
          description: "Celebrating the diverse culinary scene across the UAE",
          category: "Food & Beverage",
          organizer_name: "UAE Culinary Guild",
          attendees: 5000,
          min_bid: 3000,
          max_bid: 30000,
          phone: "+971503456789",
          is_public: true,
          tags: ["food", "culinary", "festival"]
        }
      ];
      
      // Insert sample events
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .insert(sampleEvents)
        .select();
        
      if (eventsError) throw eventsError;
      
      // If events were created successfully, add sample packages for each event
      if (eventsData && eventsData.length > 0) {
        const samplePackages = [];
        
        for (const event of eventsData) {
          // Create basic packages for each event
          samplePackages.push(
            {
              name: "Silver Sponsor",
              description: "Logo placement, small booth space",
              price: Math.round(event.min_bid * 1.2),
              event_id: event.id
            },
            {
              name: "Gold Sponsor",
              description: "Premium logo placement, medium booth, speaking opportunity",
              price: Math.round(event.min_bid * 2),
              event_id: event.id
            },
            {
              name: "Platinum Sponsor",
              description: "VIP benefits, large booth, multiple speaking slots, exclusive branding",
              price: Math.round(event.min_bid * 3),
              event_id: event.id
            }
          );
        }
        
        // Insert sample packages
        const { error: packagesError } = await supabase
          .from("sponsorship_packages")
          .insert(samplePackages);
          
        if (packagesError) throw packagesError;
      }
      
      toast.success("Sample events added successfully");
      fetchEvents();
    } catch (error: any) {
      console.error("Error adding sample events:", error);
      toast.error(`Failed to add sample events: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Events Management</CardTitle>
              <CardDescription>
                Manage events posted on the platform
              </CardDescription>
            </div>
            <Button onClick={addSampleEvents} className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Sample Events
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <EventsTable 
            events={events}
            isLoading={isLoading}
            onViewPackages={handleViewPackages}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        </CardContent>
      </Card>

      {/* Packages Dialog */}
      {viewingPackages && (
        <PackagesDialog 
          isOpen={!!viewingPackages}
          onClose={() => setViewingPackages(null)}
          packages={viewingPackages.packages}
          eventTitle={viewingPackages.eventTitle}
        />
      )}
      
      {/* Delete Event Dialog */}
      <DeleteEventDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteEvent}
      />
    </>
  );
};

export default EventsTab;
