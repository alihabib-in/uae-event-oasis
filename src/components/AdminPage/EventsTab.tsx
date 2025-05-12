
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Package } from "lucide-react";
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Events Management</CardTitle>
          <CardDescription>
            Manage events posted on the platform
          </CardDescription>
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
                        {event.title}
                      </TableCell>
                      <TableCell>
                        {event.date ? format(new Date(event.date), "PPP") : "N/A"}
                      </TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            event.is_public
                              ? "default"
                              : "secondary"
                          }
                        >
                          {event.is_public ? "Public" : "Hidden"}
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditEvent(event)}
                        >
                          Edit
                        </Button>
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
    </>
  );
};

export default EventsTab;
