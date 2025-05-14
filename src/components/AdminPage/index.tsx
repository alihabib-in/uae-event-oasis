
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import EventsTab from "./EventsTab";
import BidsTab from "./BidsTab";
import SpacesTab from "./SpacesTab";
import SpaceRequestsTab from "./SpaceRequestsTab";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Settings, Home, Building, CalendarRange, MessageSquare } from "lucide-react";
import Logo from "@/components/Logo";
import EventEditor from "@/components/EventEditor/EventEditor";

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("events");
  const [isEventEditorOpen, setIsEventEditorOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email);
      }
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleEditEvent = (event: any) => {
    setCurrentEvent(event);
    setIsEventEditorOpen(true);
  };

  const handleEventUpdated = () => {
    setIsEventEditorOpen(false);
    // Trigger a refresh of the events list
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-slate-900 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-6">
              <Logo />
              <nav className="hidden md:flex space-x-1">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/")}
                  className="text-sm font-medium"
                >
                  <Home className="h-4 w-4 mr-1" />
                  Home
                </Button>
                <Button 
                  variant={activeTab === "events" ? "secondary" : "ghost"} 
                  onClick={() => setActiveTab("events")}
                  className="text-sm font-medium"
                >
                  <CalendarRange className="h-4 w-4 mr-1" />
                  Events
                </Button>
                <Button 
                  variant={activeTab === "bids" ? "secondary" : "ghost"} 
                  onClick={() => setActiveTab("bids")}
                  className="text-sm font-medium"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Bids
                </Button>
                <Button 
                  variant={activeTab === "spaces" ? "secondary" : "ghost"} 
                  onClick={() => setActiveTab("spaces")}
                  className="text-sm font-medium"
                >
                  <Building className="h-4 w-4 mr-1" />
                  Spaces
                </Button>
                <Button 
                  variant={activeTab === "space_requests" ? "secondary" : "ghost"} 
                  onClick={() => setActiveTab("space_requests")}
                  className="text-sm font-medium"
                >
                  Building Requests
                </Button>
                <Button 
                  variant={activeTab === "settings" ? "secondary" : "ghost"} 
                  onClick={() => setActiveTab("settings")}
                  className="text-sm font-medium"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {userEmail && (
                <span className="text-sm text-slate-400 hidden md:inline-block">
                  {userEmail}
                </span>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="md:hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="bids">Bids</TabsTrigger>
                <TabsTrigger value="spaces">Spaces</TabsTrigger>
                <TabsTrigger value="space_requests">Requests</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div>
          {activeTab === "events" && <EventsTab onEditEvent={handleEditEvent} />}
          {activeTab === "bids" && <BidsTab />}
          {activeTab === "spaces" && <SpacesTab />}
          {activeTab === "space_requests" && <SpaceRequestsTab />}
          {activeTab === "settings" && (
            <div className="bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4">Admin Settings</h3>
              <p className="text-slate-400">Settings functionality will be implemented soon.</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Editor Dialog */}
      <EventEditor
        isOpen={isEventEditorOpen}
        onClose={() => setIsEventEditorOpen(false)}
        event={currentEvent}
        onEventUpdated={handleEventUpdated}
      />
    </div>
  );
};

export default AdminPage;
