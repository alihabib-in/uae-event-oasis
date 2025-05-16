
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Package, Edit, Trash2, ExternalLink, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import EventEditor from "@/components/EventEditor/EventEditor";

interface EventsTabProps {
  onEditEvent: (event: any) => void;
}

// Define the Event interface to match our database schema
interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  status: string;
  is_public: boolean;
  organizer_name?: string;
  organizer_email?: string; // Add this property as optional
  venue?: string;
  category?: string;
  description?: string;
  image?: string;
  created_at: string;
  // Add other properties as needed
}

const EventsTab = ({ onEditEvent }: EventsTabProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingPackages, setViewingPackages] = useState<{
    eventId: string;
    packages: any[];
    eventTitle: string;
  } | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEventEditorOpen, setIsEventEditorOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);

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
    console.log("Opening event editor for:", event);
    setCurrentEvent(event);
    setIsEventEditorOpen(true);
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

  const handleEventUpdated = () => {
    setIsEventEditorOpen(false);
    fetchEvents();
  };

  const handleApproveEvent = async (eventId: string) => {
    try {
      const { data: event, error: fetchError } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const { error } = await supabase
        .from('events')
        .update({
          status: 'approved',
          is_public: true
        })
        .eq('id', eventId);
        
      if (error) throw error;
      
      // Send email notification to the event organizer
      try {
        await supabase.functions.invoke("send-event-approval-email", {
          body: {
            eventId: eventId,
            eventTitle: event.title,
            recipientEmail: event.organizer_email || "",
            recipientName: event.organizer_name || "Event Organizer",
          },
        });
      } catch (emailError) {
        console.error("Error sending approval email:", emailError);
        // Continue even if email sending fails
      }
      
      toast.success("Event approved successfully");
      fetchEvents();
    } catch (error: any) {
      console.error('Error approving event:', error);
      toast.error(`Error approving event: ${error.message}`);
    }
  };
  
  const handleRejectEvent = async (eventId: string) => {
    try {
      const { data: event, error: fetchError } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const { error } = await supabase
        .from('events')
        .update({
          status: 'rejected',
          is_public: false
        })
        .eq('id', eventId);
        
      if (error) throw error;
      
      // Send email notification to the event organizer about rejection
      try {
        await supabase.functions.invoke("send-event-rejection-email", {
          body: {
            eventId: eventId,
            eventTitle: event.title,
            recipientEmail: event.organizer_email || "",
            recipientName: event.organizer_name || "Event Organizer",
          },
        });
      } catch (emailError) {
        console.error("Error sending rejection email:", emailError);
        // Continue even if email sending fails
      }
      
      toast.success("Event rejected");
      fetchEvents();
    } catch (error: any) {
      console.error('Error rejecting event:', error);
      toast.error(`Error rejecting event: ${error.message}`);
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Packages</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Loading events...
                    </TableCell>
                  </TableRow>
                ) : events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No events found
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        <Button
                          variant="link"
                          className="p-0 h-auto font-medium text-left hover:text-primary hover:underline transition-colors"
                          onClick={() => handleEditEvent(event)}
                        >
                          {event.title}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {event.date ? format(new Date(event.date), "PPP") : "N/A"}
                      </TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            event.status === "approved" ? "default" :
                            event.status === "rejected" ? "destructive" :
                            "secondary"
                          }
                        >
                          {event.status === "approved" ? "Approved" :
                           event.status === "rejected" ? "Rejected" :
                           "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleViewPackages(event.id)}
                        >
                          <Package className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {event.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveEvent(event.id)}
                                className="text-green-500 hover:bg-green-50"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectEvent(event.id)}
                                className="text-red-500 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEvent(event)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            asChild
                          >
                            <Link to={`/events/${event.id}`} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:inline-block md:ml-1">View</span>
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Packages Dialog */}
      <Dialog open={!!viewingPackages} onOpenChange={() => setViewingPackages(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Sponsorship Packages
            </DialogTitle>
            <DialogDescription>
              Packages for {viewingPackages?.eventTitle}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {viewingPackages?.packages?.map((pkg: any) => (
              <div key={pkg.id} className="border rounded-md p-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium">{pkg.name}</h3>
                  <Badge variant="outline">AED {pkg.price.toLocaleString()}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{pkg.description}</p>
              </div>
            ))}
            {(!viewingPackages?.packages || viewingPackages.packages.length === 0) && (
              <p className="text-center text-muted-foreground py-4">No packages found</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setViewingPackages(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Event Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this event and all its associated sponsorship packages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEvent} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Event Editor Dialog */}
      <EventEditor
        isOpen={isEventEditorOpen}
        onClose={() => setIsEventEditorOpen(false)}
        event={currentEvent}
        onEventUpdated={handleEventUpdated}
      />
    </>
  );
};

export default EventsTab;
