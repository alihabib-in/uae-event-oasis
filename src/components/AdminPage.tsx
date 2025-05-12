
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminSettings from "@/components/AdminSettings";
import { supabase } from "@/integrations/supabase/client";
import EventsTab from "./AdminPage/EventsTab";
import BidsTab from "./AdminPage/BidsTab";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [settings, setSettings] = useState<any>(null);
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

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-8">
          <TabsTrigger value="events" className="flex-1">Events</TabsTrigger>
          <TabsTrigger value="bids" className="flex-1">Bids</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events">
          <EventsTab />
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
  );
};

export default AdminPage;
