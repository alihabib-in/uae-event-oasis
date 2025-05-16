
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
import { cn } from "@/lib/utils";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [settings, setSettings] = useState<any>(null);
  const [eventToEdit, setEventToEdit] = useState<any>(null);
  const navigate = useNavigate();

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

  const tabs = [
    { id: "events", label: "Events", icon: CalendarRange },
    { id: "spaces", label: "Spaces", icon: Building },
    { id: "space_requests", label: "Space Requests", icon: MessageSquare },
    { id: "bids", label: "Bids", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 flex">
        {/* Sidebar with vertical tabs */}
        <div className="w-64 border-r bg-muted/30">
          <div className="p-4 flex flex-col h-full">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="justify-start mb-6"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="space-y-1 flex-1">
              {tabs.map((tab) => (
                <Button 
                  key={tab.id}
                  variant={activeTab === tab.id ? "secondary" : "ghost"} 
                  className={cn(
                    "w-full justify-start",
                    activeTab === tab.id ? "bg-muted" : ""
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="mt-auto"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          {activeTab === "events" && <EventsTab onEditEvent={(event) => console.log(event)} />}
          {activeTab === "spaces" && <SpacesTab />}
          {activeTab === "space_requests" && <SpaceRequestsTab />}
          {activeTab === "bids" && <BidsTab />}
          {activeTab === "settings" && (
            <AdminSettings 
              settings={settings}
              onSettingsSaved={fetchSettings}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
