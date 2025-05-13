
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
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import EventEditor from "@/components/EventEditor/EventEditor";
import EventsTab from "./EventsTab";
import BidsTab from "./BidsTab";
import { PieChart, BarChart, Clock, Users } from "lucide-react";

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eventToEdit, setEventToEdit] = useState<any>(null);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("events");
  const [settings, setSettings] = useState<any>(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBids: 0,
    pendingApprovals: 0,
    totalUsers: 0
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
    fetchSettings();
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      // Get events count
      const { count: eventsCount } = await supabase
        .from("events")
        .select("*", { count: 'exact', head: true });
      
      // Get bids count
      const { count: bidsCount } = await supabase
        .from("bids")
        .select("*", { count: 'exact', head: true });
      
      // Get pending approvals
      const { count: pendingCount } = await supabase
        .from("events")
        .select("*", { count: 'exact', head: true })
        .eq("status", "pending");
      
      // Get users count - we don't have a profiles table, so we'll estimate based on events with unique user_ids
      const { data: uniqueUsers } = await supabase
        .from("events")
        .select("user_id")
        .not("user_id", "is", null);
      
      // Count unique user_ids (this is a simplified approach)
      const uniqueUserIds = new Set();
      if (uniqueUsers) {
        uniqueUsers.forEach(item => {
          if (item.user_id) uniqueUserIds.add(item.user_id);
        });
      }
      
      setStats({
        totalEvents: eventsCount || 0,
        totalBids: bidsCount || 0,
        pendingApprovals: pendingCount || 0,
        totalUsers: uniqueUserIds.size || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .single();
        
      if (error) {
        console.error("Error fetching settings:", error);
        return;
      }
      
      setSettings(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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

  const handleEditEvent = (event: any) => {
    console.log("Edit event clicked:", event);
    setEventToEdit(event);
    setIsEditEventOpen(true);
  };

  const handleEventUpdated = () => {
    toast.success("Event updated successfully");
    // Refresh the events list
    const eventsTab = document.getElementById('events-tab-trigger');
    if (eventsTab) {
      eventsTab.click();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary/30 mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage events, bids, and platform settings</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-sm text-muted-foreground">Logged in as {user?.email}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Events</p>
                <p className="text-3xl font-bold">{stats.totalEvents}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Bids</p>
                <p className="text-3xl font-bold">{stats.totalBids}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center">
                <PieChart className="h-6 w-6 text-sky-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Pending Approval</p>
                <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-violet-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="bg-white rounded-lg shadow-sm p-6">
          <TabsList className="mb-8 grid grid-cols-3 max-w-md">
            <TabsTrigger id="events-tab-trigger" value="events">Events</TabsTrigger>
            <TabsTrigger value="bids">Bids</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <EventsTab onEditEvent={handleEditEvent} />
          </TabsContent>

          <TabsContent value="bids" className="space-y-6">
            <BidsTab />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings 
              settings={settings}
              onSettingsSaved={fetchSettings}
            />
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
    </div>
  );
};

export default AdminPage;
