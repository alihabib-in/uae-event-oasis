import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BarChart, Tag, Users, Calendar, Edit, Trash2, Plus, Search, Info, Mail, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Navigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const AdminPage = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [adminSettings, setAdminSettings] = useState<any>(null);
  const [notificationEmails, setNotificationEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [customResponse, setCustomResponse] = useState("");
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseAction, setResponseAction] = useState<"approved" | "rejected" | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (eventsError) throw eventsError;
      setEvents(eventsData || []);
      
      // Fetch bids
      const { data: bidsData, error: bidsError } = await supabase
        .from('bids')
        .select('*, events(*)')
        .order('created_at', { ascending: false });
      
      if (bidsError) throw bidsError;
      setBids(bidsData || []);
      
      // Fetch admin settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('admin_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
      
      if (settingsData) {
        setAdminSettings(settingsData);
        setNotificationEmails(settingsData.notification_emails || []);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error(`Error fetching data: ${error.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  const addEmail = () => {
    if (!newEmail) return;
    
    if (!newEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (notificationEmails.includes(newEmail)) {
      toast.error("Email already exists");
      return;
    }
    
    setNotificationEmails([...notificationEmails, newEmail]);
    setNewEmail("");
  };

  const removeEmail = (email: string) => {
    setNotificationEmails(notificationEmails.filter(e => e !== email));
  };

  const saveEmailSettings = async () => {
    setIsUpdating(true);
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .update({
          notification_emails: notificationEmails,
          updated_at: new Date().toISOString()
        })
        .eq('id', adminSettings.id);
      
      if (error) throw error;
      
      toast.success("Notification emails updated successfully");
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast.error(`Error updating settings: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateEventStatus = async (eventId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status })
        .eq('id', eventId);
      
      if (error) throw error;
      
      toast.success(`Event ${status === 'approved' ? 'approved' : 'rejected'}`);
      fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error updating event status:', error);
      toast.error(`Error updating event: ${error.message}`);
    }
  };

  const handleBidAction = (bidId: string, action: "approved" | "rejected") => {
    setSelectedBidId(bidId);
    setResponseAction(action);
    setCustomResponse("");
    setIsResponseDialogOpen(true);
  };

  const updateBidStatus = async () => {
    if (!selectedBidId || !responseAction) return;
    
    try {
      const status = responseAction;
      const { error } = await supabase
        .from('bids')
        .update({ 
          status,
          admin_response: customResponse 
        })
        .eq('id', selectedBidId);
      
      if (error) throw error;

      // Get the bid data to send notification
      const { data: bidData } = await supabase
        .from('bids')
        .select('*, events(*)')
        .eq('id', selectedBidId)
        .single();

      if (bidData) {
        // Send notification to bidder
        const notificationData = {
          brandName: bidData.brand_name,
          eventId: bidData.event_id,
          eventName: bidData.events?.title || 'Unknown Event',
          email: bidData.email,
          phone: bidData.phone,
          bidAmount: bidData.bid_amount,
          contactName: bidData.contact_name,
          status: status,
          adminResponse: customResponse
        };

        // Get the current authenticated user's session
        const { data: { session } } = await supabase.auth.getSession();
        
        const { error: notificationError } = await fetch('https://uqtyatwvjmsgzywifhvc.supabase.co/functions/v1/send-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || ''}`
          },
          body: JSON.stringify({
            type: 'bid_status_update',
            data: notificationData
          })
        }).then(res => res.json());

        if (notificationError) {
          console.error('Error sending notification:', notificationError);
        }
      }
      
      toast.success(`Bid ${status === 'approved' ? 'approved' : 'rejected'}`);
      setIsResponseDialogOpen(false);
      fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error updating bid status:', error);
      toast.error(`Error updating bid: ${error.message}`);
    }
  };

  const filterData = (items: any[]) => {
    if (!searchQuery) return items;
    return items.filter(item => 
      Object.values(item).some(value => 
        typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  // If still loading auth state, show loading
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  // If not admin, redirect to login
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-background border-r p-4 h-screen">
          <div className="flex items-center mb-8">
            <span className="text-xl font-semibold">sponsorby</span>
            <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Admin</span>
          </div>
          
          <div className="space-y-1">
            <Button 
              variant={activeTab === "dashboard" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant={activeTab === "events" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("events")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Events
            </Button>
            <Button 
              variant={activeTab === "bids" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("bids")}
            >
              <Tag className="mr-2 h-4 w-4" />
              Sponsorship Bids
            </Button>
            <Button 
              variant={activeTab === "settings" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("settings")}
            >
              <Mail className="mr-2 h-4 w-4" />
              Notification Settings
            </Button>
          </div>

          <div className="mt-auto">
            <div className="flex items-center p-2 rounded-lg bg-primary/5">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/admin-avatar.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@sponsorby.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 bg-background border-b py-4 px-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-light">Admin Dashboard</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-64 pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  size="sm" 
                  onClick={() => fetchData()}
                  disabled={isFetching}
                >
                  {isFetching ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>
          </header>

          <main className="p-6">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{events.length}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {events.filter(e => e.status === 'approved').length} approved events
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Bids
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{bids.length}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {bids.filter(b => b.status === 'approved').length} approved bids
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Pending Approvals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {events.filter(e => e.status === 'pending').length + 
                         bids.filter(b => b.status === 'pending').length}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {events.filter(e => e.status === 'pending').length} events, {bids.filter(b => b.status === 'pending').length} bids
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {events.slice(0, 3).map((event) => (
                          <div key={event.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>{event.organizer_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{event.title}</p>
                                <p className="text-xs text-muted-foreground">{event.organizer_name}</p>
                              </div>
                            </div>
                            <Badge variant={event.status === 'pending' ? 'outline' : (event.status === 'approved' ? 'default' : 'destructive')}>{event.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("events")}>
                        View all
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Bids</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {bids.slice(0, 3).map((bid) => (
                          <div key={bid.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>{bid.brand_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{bid.brand_name}</p>
                                <p className="text-xs text-muted-foreground">{bid.events?.title || 'Unknown Event'}</p>
                              </div>
                            </div>
                            <Badge variant={bid.status === 'pending' ? 'outline' : (bid.status === 'approved' ? 'default' : 'destructive')}>
                              {bid.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab("bids")}>
                        View all
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "events" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-light">Events</h2>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-sm py-1">
                      {events.filter(e => e.status === 'pending').length} Pending
                    </Badge>
                    <Badge variant="default" className="text-sm py-1">
                      {events.filter(e => e.status === 'approved').length} Approved
                    </Badge>
                    <Badge variant="destructive" className="text-sm py-1">
                      {events.filter(e => e.status === 'rejected').length} Rejected
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  {filterData(events).length > 0 ? (
                    filterData(events).map((event) => (
                      <Card key={event.id}>
                        <CardHeader>
                          <div className="flex justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                {event.title}
                                <Badge variant={event.status === 'pending' ? 'outline' : (event.status === 'approved' ? 'default' : 'destructive')}>
                                  {event.status}
                                </Badge>
                              </CardTitle>
                              <CardDescription>
                                Organized by {event.organizer_name} • {new Date(event.date).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            {event.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-green-500 border-green-500 hover:bg-green-50 dark:hover:bg-green-950"
                                  onClick={() => updateEventStatus(event.id, 'approved')}
                                >
                                  <Check className="mr-1 h-4 w-4" /> Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                  onClick={() => updateEventStatus(event.id, 'rejected')}
                                >
                                  <X className="mr-1 h-4 w-4" /> Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium">Location</p>
                              <p className="text-sm text-muted-foreground">{event.venue}, {event.location}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Expected Attendees</p>
                              <p className="text-sm text-muted-foreground">{event.attendees}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Sponsorship Range</p>
                              <p className="text-sm text-muted-foreground">AED {Number(event.min_bid).toLocaleString()} - AED {Number(event.max_bid).toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div>
                            <p className="text-sm font-medium mb-2">Description</p>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div>
                            <p className="text-sm font-medium mb-2">Contact Information</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Phone: {event.phone}</p>
                                <Badge variant={event.phone_verified ? "default" : "outline"} className="text-xs">
                                  {event.phone_verified ? "Verified" : "Unverified"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Info className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No events found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "bids" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-light">Sponsorship Bids</h2>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-sm py-1">
                      {bids.filter(b => b.status === 'pending').length} Pending
                    </Badge>
                    <Badge variant="default" className="text-sm py-1">
                      {bids.filter(b => b.status === 'approved').length} Approved
                    </Badge>
                    <Badge variant="destructive" className="text-sm py-1">
                      {bids.filter(b => b.status === 'rejected').length} Rejected
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  {filterData(bids).length > 0 ? (
                    filterData(bids).map((bid) => (
                      <Card key={bid.id}>
                        <CardHeader>
                          <div className="flex justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                {bid.brand_name}
                                <Badge variant={bid.status === 'pending' ? 'outline' : (bid.status === 'approved' ? 'default' : 'destructive')}>
                                  {bid.status}
                                </Badge>
                              </CardTitle>
                              <CardDescription>
                                For event: {bid.events?.title || 'Unknown Event'} • Bid Amount: AED {Number(bid.bid_amount).toLocaleString()}
                              </CardDescription>
                            </div>
                            {bid.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-green-500 border-green-500 hover:bg-green-50 dark:hover:bg-green-950"
                                  onClick={() => handleBidAction(bid.id, 'approved')}
                                >
                                  <Check className="mr-1 h-4 w-4" /> Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                  onClick={() => handleBidAction(bid.id, 'rejected')}
                                >
                                  <X className="mr-1 h-4 w-4" /> Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium">Business Information</p>
                              <p className="text-sm text-muted-foreground">Nature: {bid.business_nature}</p>
                              <p className="text-sm text-muted-foreground">Location: {bid.company_address}, {bid.emirate}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Contact Information</p>
                              <p className="text-sm text-muted-foreground">Name: {bid.contact_name}</p>
                              <p className="text-sm text-muted-foreground">Email: {bid.email}</p>
                              <p className="text-sm text-muted-foreground">Phone: {bid.phone}</p>
                              <Badge variant={bid.phone_verified ? "default" : "outline"} className="text-xs mt-1">
                                {bid.phone_verified ? "Phone Verified" : "Phone Unverified"}
                              </Badge>
                            </div>
                          </div>
                          
                          {bid.message && (
                            <>
                              <Separator className="my-4" />
                              <div>
                                <p className="text-sm font-medium mb-2">Additional Message</p>
                                <p className="text-sm text-muted-foreground">{bid.message}</p>
                              </div>
                            </>
                          )}

                          {bid.admin_response && (
                            <>
                              <Separator className="my-4" />
                              <div>
                                <p className="text-sm font-medium mb-2">Admin Response</p>
                                <p className="text-sm text-muted-foreground">{bid.admin_response}</p>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Info className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No bids found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6 max-w-2xl">
                <h2 className="text-2xl font-light">Notification Settings</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>
                      Add email addresses that will receive notifications when new events or bids are submitted.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter email address" 
                        value={newEmail} 
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                      <Button onClick={addEmail}>Add</Button>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      {notificationEmails.map((email) => (
                        <div key={email} className="flex items-center justify-between bg-muted/40 p-2 rounded-md">
                          <span className="text-sm">{email}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeEmail(email)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      {notificationEmails.length === 0 && (
                        <p className="text-sm text-muted-foreground">No notification emails added yet.</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={saveEmailSettings} 
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Credentials</CardTitle>
                    <CardDescription>
                      Change your admin login credentials.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Current login: <span className="font-medium">test1</span> / <span className="font-medium">pass1</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      To change these credentials, please contact the system administrator.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Custom Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {responseAction === 'approved' ? 'Approve' : 'Reject'} Sponsorship Bid
            </DialogTitle>
            <DialogDescription>
              {responseAction === 'approved' 
                ? 'Add a custom response to the bidder to confirm approval.' 
                : 'Please provide a reason for rejecting this bid.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter your response to the bidder..."
              value={customResponse}
              onChange={(e) => setCustomResponse(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={updateBidStatus}
              variant={responseAction === 'approved' ? 'default' : 'destructive'}
            >
              {responseAction === 'approved' ? 'Approve' : 'Reject'} Bid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
