
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import AdminSettings from "@/components/AdminSettings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import EventEditor from "@/components/EventEditor";
import { X, Check, Package } from "lucide-react";

const AdminPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eventToEdit, setEventToEdit] = useState<any>(null);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("events");

  // Dialog states for bid approval/rejection
  const [bidActionDialogOpen, setBidActionDialogOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<any>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [adminResponse, setAdminResponse] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
    fetchData();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      const { data: settings } = await supabase
        .from("admin_settings")
        .select("notification_emails")
        .single();

      if (settings && settings.notification_emails) {
        const isUserAdmin = settings.notification_emails.includes(user.email);
        setIsAdmin(isUserAdmin);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (eventsError) throw eventsError;

      // Fetch bids
      const { data: bidsData, error: bidsError } = await supabase
        .from("bids")
        .select("*, events(title)")
        .order("created_at", { ascending: false });

      if (bidsError) throw bidsError;

      setEvents(eventsData || []);
      setBids(bidsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load admin data");
    }
  };

  const handleEditEvent = (event: any) => {
    setEventToEdit(event);
    setIsEditEventOpen(true);
  };

  const handleEventUpdated = () => {
    fetchData();
  };

  const handleViewPackages = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from("sponsorship_packages")
        .select("*")
        .eq("event_id", eventId)
        .order("price", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Show packages in a dialog
        setSelectedBid({
          eventId,
          packages: data,
          eventTitle: events.find((e) => e.id === eventId)?.title || "Event"
        });
        setActionType("view_packages");
        setBidActionDialogOpen(true);
      } else {
        toast.info("No sponsorship packages found for this event");
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to load sponsorship packages");
    }
  };

  const handleBidAction = (bid: any, action: "approve" | "reject") => {
    setSelectedBid(bid);
    setActionType(action);
    setAdminResponse("");
    setBidActionDialogOpen(true);
  };

  const confirmBidAction = async () => {
    if (!selectedBid || !actionType || (actionType !== "approve" && actionType !== "reject")) return;

    try {
      // Update the bid status in the database
      const { error } = await supabase
        .from("bids")
        .update({
          status: actionType === "approve" ? "approved" : "rejected",
          admin_response: adminResponse
        })
        .eq("id", selectedBid.id);

      if (error) throw error;

      // Send email notification
      await supabase.functions.invoke("send-notification", {
        body: {
          type: "bid_status_update",
          data: {
            brandName: selectedBid.brand_name,
            eventName: selectedBid.events?.title || "the event",
            email: selectedBid.email,
            bidAmount: selectedBid.bid_amount,
            contactName: selectedBid.contact_name,
            status: actionType,
            adminResponse: adminResponse
          }
        }
      });

      toast.success(`Bid ${actionType === "approve" ? "approved" : "rejected"} successfully`);
      setBidActionDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error(`Error ${actionType}ing bid:`, error);
      toast.error(`Failed to ${actionType} bid`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access the admin area.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p>
                If you believe this is an error, please contact the system
                administrator.
              </p>
              <Button onClick={() => navigate("/")}>Return Home</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-8 grid grid-cols-3 max-w-md">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="bids">Bids</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
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
                      {events.map((event) => (
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
                              onClick={() => handleEditEvent(event)}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {events.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6">
                            No events found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bids" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bids Management</CardTitle>
                <CardDescription>
                  Review and manage sponsorship bids
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Brand</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bids.map((bid) => (
                        <TableRow key={bid.id}>
                          <TableCell className="font-medium">
                            {bid.brand_name}
                          </TableCell>
                          <TableCell>{bid.events?.title || "N/A"}</TableCell>
                          <TableCell>AED {bid.bid_amount.toLocaleString()}</TableCell>
                          <TableCell>
                            {format(new Date(bid.created_at), "PPP")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                bid.status === "approved"
                                  ? "success"
                                  : bid.status === "rejected"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {bid.status || "pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {bid.status === "pending" && (
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => handleBidAction(bid, "reject")}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-success"
                                  onClick={() => handleBidAction(bid, "approve")}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {bids.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6">
                            No bids found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Event Editor Dialog */}
      <EventEditor 
        isOpen={isEditEventOpen}
        onClose={() => setIsEditEventOpen(false)}
        event={eventToEdit}
        onEventUpdated={handleEventUpdated}
      />

      {/* Bid Action Dialog */}
      <Dialog open={bidActionDialogOpen} onOpenChange={setBidActionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" 
                ? "Approve Bid" 
                : actionType === "reject" 
                ? "Reject Bid" 
                : "Sponsorship Packages"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "view_packages" 
                ? `Packages for ${selectedBid?.eventTitle}`
                : `${actionType === "approve" ? "Approve" : "Reject"} bid from ${selectedBid?.brand_name} for ${selectedBid?.events?.title}`}
            </DialogDescription>
          </DialogHeader>
          
          {actionType === "view_packages" ? (
            <div className="space-y-4 py-2">
              {selectedBid?.packages?.map((pkg: any) => (
                <div key={pkg.id} className="border rounded-md p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium">{pkg.name}</h3>
                    <Badge variant="outline">AED {pkg.price.toLocaleString()}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                </div>
              ))}
              {(!selectedBid?.packages || selectedBid.packages.length === 0) && (
                <p className="text-center text-muted-foreground py-4">No packages found</p>
              )}
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <Textarea
                placeholder="Enter a response message to be included in the notification email..."
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                rows={4}
              />
            </div>
          )}

          <DialogFooter className="flex sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setBidActionDialogOpen(false)}
            >
              Cancel
            </Button>
            
            {actionType !== "view_packages" && (
              <Button
                type="button"
                variant={actionType === "approve" ? "default" : "destructive"}
                onClick={confirmBidAction}
              >
                {actionType === "approve" ? "Approve Bid" : "Reject Bid"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
