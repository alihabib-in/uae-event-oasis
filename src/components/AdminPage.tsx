
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import EventsTab from "./AdminPage/EventsTab";
import SpacesTab from "./AdminPage/SpacesTab";
import BidsTab from "./AdminPage/BidsTab";
import SpaceRequestsTab from "./AdminPage/SpaceRequestsTab";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AdminSettings from "./AdminSettings";
import { LogOut, Settings, Home, Building, CalendarRange, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { cn } from "@/lib/utils";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [settings, setSettings] = useState<any>(null);
  const [eventToEdit, setEventToEdit] = useState<any>(null);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Redirect non-admin users
  useEffect(() => {
    if (user && !isAdmin) {
      toast.error("You don't have permission to access the admin page");
      navigate("/");
    }
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    fetchSettings();
  }, []);

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="flex items-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-background border rounded-md">
            <TabsTrigger value="events" className="flex items-center">
              <CalendarRange className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="spaces" className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Spaces
            </TabsTrigger>
            <TabsTrigger value="space_requests" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Space Requests
            </TabsTrigger>
            <TabsTrigger value="bids" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Bids
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            <EventsTab onEditEvent={(event) => {
              setEventToEdit(event);
              console.log("Editing event:", event);
              // This should open the event editor
              const eventEditorElement = document.getElementById("event-editor");
              if (eventEditorElement) {
                eventEditorElement.setAttribute("data-state", "open");
              }
            }} />
          </TabsContent>
          
          <TabsContent value="spaces">
            <SpacesTab />
          </TabsContent>
          
          <TabsContent value="space_requests">
            <SpaceRequestsTab />
          </TabsContent>
          
          <TabsContent value="bids">
            <BidsTab />
          </TabsContent>
          
          <TabsContent value="settings">
            <AdminSettings 
              settings={settings}
              onSettingsSaved={fetchSettings}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
