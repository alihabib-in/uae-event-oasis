
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SpaceRequest {
  id: string;
  requester_name: string;
  company_name?: string;
  space_type: string;
  event_type: string;
  preferred_date: string;
  capacity: number;
  status: string;
  email: string;
  [key: string]: any;
}

interface RequestReplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  request: SpaceRequest | null;
  onSubmit: (id: string, status: string, response: string) => Promise<void>;
}

const RequestReplyDialog = ({
  isOpen,
  onClose,
  request,
  onSubmit,
}: RequestReplyDialogProps) => {
  const [status, setStatus] = useState<string>("pending");
  const [response, setResponse] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!request) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(request.id, status, response);
      onClose();
    } catch (error) {
      console.error("Error submitting response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reply to Space Request</DialogTitle>
          <DialogDescription>
            {request?.requester_name}'s request for {request?.space_type}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Request Details</Label>
            <div className="bg-muted p-3 rounded-md text-sm">
              <p><strong>Event Type:</strong> {request?.event_type}</p>
              <p><strong>Date:</strong> {request?.preferred_date}</p>
              <p><strong>Capacity:</strong> {request?.capacity}</p>
              <p><strong>Email:</strong> {request?.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup
              value={status}
              onValueChange={setStatus}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="pending" />
                <Label htmlFor="pending">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="approved" id="approved" />
                <Label htmlFor="approved">Approved</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rejected" id="rejected" />
                <Label htmlFor="rejected">Rejected</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Response</Label>
            <Textarea
              placeholder="Write your response here..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={5}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Response"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestReplyDialog;
