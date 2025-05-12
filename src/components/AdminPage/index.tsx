
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
import { Dialog } from "@/components/ui/dialog";

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eventToEdit, setEventToEdit] = useState<any>(null);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("events");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
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

  const handleEditEvent = (event: any) => {
    setEventToEdit(event);
    setIsEditEventOpen(true);
  };

  const handleEventUpdated = () => {
    toast.success("Event updated successfully");
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
            <EventsTab onEditEvent={handleEditEvent} />
          </TabsContent>

          <TabsContent value="bids" className="space-y-6">
            <BidsTab />
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
    </div>
  );
};

export default AdminPage;
