
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SpaceRequestsTable from "./spacerequests/SpaceRequestsTable";
import RequestReplyDialog from "./spacerequests/RequestReplyDialog";
import DeleteRequestDialog from "./spacerequests/DeleteRequestDialog";

const SpaceRequestsTab = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("space_rental_requests")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      console.error("Error fetching space requests:", error);
      toast.error(`Failed to load requests: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = (request: any) => {
    setSelectedRequest(request);
    setIsReplyDialogOpen(true);
  };

  const handleSubmitResponse = async (id: string, status: string, response: string) => {
    try {
      const { error } = await supabase
        .from("space_rental_requests")
        .update({
          status,
          admin_response: response,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);
      
      if (error) throw error;
      
      toast.success("Response submitted successfully");
      fetchRequests();
    } catch (error: any) {
      console.error("Error submitting response:", error);
      toast.error(`Failed to submit response: ${error.message}`);
      throw error;
    }
  };

  const handleDeleteRequest = (requestId: string) => {
    setRequestToDelete(requestId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteRequest = async () => {
    if (!requestToDelete) return;
    
    try {
      const { error } = await supabase
        .from("space_rental_requests")
        .delete()
        .eq("id", requestToDelete);
      
      if (error) throw error;
      
      toast.success("Request deleted successfully");
      setIsDeleteDialogOpen(false);
      fetchRequests();
    } catch (error: any) {
      console.error("Error deleting request:", error);
      toast.error(`Failed to delete request: ${error.message}`);
    }
  };

  const addSampleRequests = async () => {
    setIsLoading(true);
    try {
      const currentDate = new Date();
      const sampleRequests = [
        {
          requester_name: "Ahmed Al Hashimi",
          company_name: "Desert Events",
          space_type: "Conference Hall",
          event_type: "Corporate Conference",
          preferred_date: new Date(currentDate.setDate(currentDate.getDate() + 30)).toISOString().split('T')[0],
          end_date: new Date(currentDate.setDate(currentDate.getDate() + 32)).toISOString().split('T')[0],
          capacity: 300,
          email: "ahmed@desertevents.ae",
          phone: "+971552345678",
          additional_requirements: "Need staging and audio-visual equipment setup",
          status: "pending"
        },
        {
          requester_name: "Fatima Khan",
          company_name: "Creative Productions",
          space_type: "Exhibition Hall",
          event_type: "Art Exhibition",
          preferred_date: new Date(currentDate.setDate(currentDate.getDate() + 15)).toISOString().split('T')[0],
          end_date: new Date(currentDate.setDate(currentDate.getDate() + 20)).toISOString().split('T')[0],
          capacity: 500,
          email: "fatima@creativeproductions.com",
          phone: "+971561234567",
          additional_requirements: "Gallery-style lighting and display panels",
          status: "pending"
        },
        {
          requester_name: "Omar Abdullah",
          company_name: "Tech Ventures UAE",
          space_type: "Ballroom",
          event_type: "Product Launch",
          preferred_date: new Date(currentDate.setDate(currentDate.getDate() + 45)).toISOString().split('T')[0],
          end_date: new Date(currentDate.setDate(currentDate.getDate() + 45)).toISOString().split('T')[0],
          capacity: 200,
          email: "omar@techventuresuae.com",
          phone: "+971543456789",
          additional_requirements: "High-speed internet and presentation screens",
          status: "pending"
        }
      ];
      
      const { error } = await supabase
        .from("space_rental_requests")
        .insert(sampleRequests);
      
      if (error) throw error;
      
      toast.success("Sample requests added successfully");
      fetchRequests();
    } catch (error: any) {
      console.error("Error adding sample requests:", error);
      toast.error(`Failed to add sample requests: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Space Rental Requests</CardTitle>
              <CardDescription>
                Manage venue and space rental requests
              </CardDescription>
            </div>
            <Button onClick={addSampleRequests} className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Sample Requests
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <SpaceRequestsTable 
            requests={requests}
            isLoading={isLoading}
            onReply={handleReply}
            onDelete={handleDeleteRequest}
          />
        </CardContent>
      </Card>

      {/* Reply Dialog */}
      <RequestReplyDialog
        isOpen={isReplyDialogOpen}
        onClose={() => setIsReplyDialogOpen(false)}
        request={selectedRequest}
        onSubmit={handleSubmitResponse}
      />
      
      {/* Delete Dialog */}
      <DeleteRequestDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteRequest}
      />
    </>
  );
};

export default SpaceRequestsTab;
