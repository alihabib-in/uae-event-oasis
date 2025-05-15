
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Check, X, Calendar, Users, Building, Info, MessageSquare, Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SpaceRequest } from "@/types/spaces";

const SpaceRequestsTab = () => {
  const [requests, setRequests] = useState<SpaceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingRequest, setViewingRequest] = useState<SpaceRequest | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [responseStatus, setResponseStatus] = useState<"approved" | "rejected" | "pending">("pending");
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("space_rental_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      console.error("Error fetching requests:", error.message);
      toast({
        variant: "destructive",
        title: "Error fetching space requests",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleViewRequest = (request: SpaceRequest) => {
    setViewingRequest(request);
    setAdminResponse(request.admin_response || "");
    setResponseStatus(request.status as "approved" | "rejected" | "pending");
  };

  const handleOpenResponseDialog = (request: SpaceRequest) => {
    setViewingRequest(request);
    setAdminResponse(request.admin_response || "");
    setResponseStatus(request.status as "approved" | "rejected" | "pending");
    setIsResponseDialogOpen(true);
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
      
      toast({
        title: "Request Deleted",
        description: "The space request has been deleted."
      });
      
      setIsDeleteDialogOpen(false);
      setRequestToDelete(null);
      fetchRequests();
    } catch (error: any) {
      console.error("Error deleting request:", error);
      toast({
        variant: "destructive",
        title: "Error deleting request",
        description: error.message
      });
    }
  };

  const saveResponse = async () => {
    if (!viewingRequest) return;

    try {
      const { error } = await supabase
        .from("space_rental_requests")
        .update({
          admin_response: adminResponse,
          status: responseStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", viewingRequest.id);

      if (error) throw error;

      toast({
        title: "Response Saved",
        description: `The request status has been updated to ${responseStatus}.`
      });

      setIsResponseDialogOpen(false);
      fetchRequests();
    } catch (error: any) {
      console.error("Error saving response:", error);
      toast({
        variant: "destructive",
        title: "Error saving response",
        description: error.message
      });
    }
  };
  
  const addSampleRequests = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const threeMonths = new Date(today);
      threeMonths.setMonth(threeMonths.getMonth() + 3);
      
      const sampleRequests = [
        {
          requester_name: "Mohammed Al Qasimi",
          company_name: "Gulf Innovations",
          email: "m.alqasimi@gulfinnov.ae",
          phone: "+971501234567",
          space_type: "Conference Hall",
          event_type: "Corporate Summit",
          preferred_date: nextMonth.toISOString().split('T')[0],
          end_date: new Date(nextMonth.setDate(nextMonth.getDate() + 2)).toISOString().split('T')[0],
          capacity: 120,
          additional_requirements: "Need AV equipment, catering options, and parking for 100 cars",
          status: "pending"
        },
        {
          requester_name: "Sarah Johnson",
          company_name: "Global Events Ltd",
          email: "sarah@globalevents.com",
          phone: "+971502345678",
          space_type: "Exhibition Hall",
          event_type: "Product Launch",
          preferred_date: threeMonths.toISOString().split('T')[0],
          end_date: new Date(threeMonths.setDate(threeMonths.getDate() + 5)).toISOString().split('T')[0],
          capacity: 350,
          additional_requirements: "Need stage setup, lighting, and sound system. Also require VIP area and separate media room.",
          status: "pending"
        },
        {
          requester_name: "Ahmed Hassan",
          company_name: null,
          email: "ahmed.hassan@gmail.com",
          phone: "+971503456789",
          space_type: "Ballroom",
          event_type: "Wedding Reception",
          preferred_date: new Date(today.setMonth(today.getMonth() + 2)).toISOString().split('T')[0],
          end_date: new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0],
          capacity: 200,
          additional_requirements: "Looking for venue with outdoor garden area for photography, catering facilities, and decoration options",
          status: "pending"
        }
      ];
      
      const { error } = await supabase
        .from("space_rental_requests")
        .insert(sampleRequests);
        
      if (error) throw error;
      
      toast({
        title: "Sample Requests Added",
        description: "Sample space rental requests have been added."
      });
      
      fetchRequests();
    } catch (error: any) {
      console.error("Error adding sample requests:", error);
      toast({
        variant: "destructive",
        title: "Error adding sample requests",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const getBadgeForStatus = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/20"><Check className="h-3 w-3 mr-1" /> Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/20"><X className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case "pending":
      default:
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Space Rental Requests</h2>
        <div className="flex gap-2">
          <Button onClick={addSampleRequests} variant="outline">
            <Plus className="h-4 w-4 mr-1" /> Add Sample Requests
          </Button>
          <Button onClick={fetchRequests} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-slate-100">
          <Calendar className="w-12 h-12 mx-auto text-slate-500 mb-2" />
          <p className="text-slate-500">No space rental requests yet</p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Space Type</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="font-medium">{request.requester_name}</div>
                    <div className="text-sm text-slate-400">{request.company_name || "Individual"}</div>
                  </TableCell>
                  <TableCell>{request.space_type}</TableCell>
                  <TableCell>{request.event_type}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(request.preferred_date)} to {formatDate(request.end_date)}
                    </div>
                  </TableCell>
                  <TableCell>{getBadgeForStatus(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewRequest(request)}>
                        <Info className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleOpenResponseDialog(request)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRequest(request.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Request Dialog */}
      {viewingRequest && (
        <Dialog open={!!viewingRequest && !isResponseDialogOpen} onOpenChange={(open) => !open && setViewingRequest(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Space Rental Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Requester Information</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-blue-400 mt-1" />
                      <div>
                        <p className="font-medium">{viewingRequest.requester_name}</p>
                        {viewingRequest.company_name && (
                          <p className="text-sm text-slate-400">{viewingRequest.company_name}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm">{viewingRequest.email}</p>
                    <p className="text-sm">{viewingRequest.phone}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Event Details</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start gap-2">
                      <Building className="h-4 w-4 text-blue-400 mt-1" />
                      <div>
                        <p className="font-medium">{viewingRequest.space_type}</p>
                        <p className="text-sm text-slate-400">{viewingRequest.event_type}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-blue-400 mt-1" />
                      <div>
                        <p className="text-sm">From: <span className="font-medium">{formatDate(viewingRequest.preferred_date)}</span></p>
                        <p className="text-sm">To: <span className="font-medium">{formatDate(viewingRequest.end_date)}</span></p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-blue-400 mt-1" />
                      <p className="text-sm">Capacity: <span className="font-medium">{viewingRequest.capacity}</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {viewingRequest.additional_requirements && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Additional Requirements</h4>
                  <p className="mt-2 text-sm bg-slate-100 p-3 rounded border border-slate-200">
                    {viewingRequest.additional_requirements}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <div className="mt-2 flex items-center gap-3">
                  <div>{getBadgeForStatus(viewingRequest.status)}</div>
                  <span className="text-sm text-slate-400">
                    Requested on {formatDate(viewingRequest.created_at)}
                  </span>
                </div>
              </div>

              {viewingRequest.admin_response && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Admin Response</h4>
                  <p className="mt-2 text-sm bg-slate-100 p-3 rounded border border-slate-200">
                    {viewingRequest.admin_response}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => handleOpenResponseDialog(viewingRequest)}>
                {viewingRequest.admin_response ? "Edit Response" : "Respond"}
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Respond to Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium mb-2">Status</p>
              <div className="flex space-x-2">
                <Button
                  variant={responseStatus === "approved" ? "default" : "outline"}
                  className={responseStatus === "approved" ? "" : "text-slate-400"}
                  onClick={() => setResponseStatus("approved")}
                >
                  <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button
                  variant={responseStatus === "rejected" ? "default" : "outline"}
                  className={responseStatus === "rejected" ? "" : "text-slate-400"}
                  onClick={() => setResponseStatus("rejected")}
                >
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button
                  variant={responseStatus === "pending" ? "default" : "outline"}
                  className={responseStatus === "pending" ? "" : "text-slate-400"}
                  onClick={() => setResponseStatus("pending")}
                >
                  Pending
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Response Message</p>
              <Textarea
                className="min-h-[150px]"
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Provide details about your decision..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveResponse}>
              Save Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Request Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this space rental request. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRequest} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SpaceRequestsTab;
