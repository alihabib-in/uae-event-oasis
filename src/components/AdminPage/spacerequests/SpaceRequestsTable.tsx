
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { MessageSquare, Trash2 } from "lucide-react";

interface SpaceRequest {
  id: string;
  requester_name: string;
  company_name?: string;
  space_type: string;
  event_type: string;
  preferred_date: string;
  capacity: number;
  status: string;
  [key: string]: any;
}

interface SpaceRequestsTableProps {
  requests: SpaceRequest[];
  isLoading: boolean;
  onReply: (request: SpaceRequest) => void;
  onDelete: (requestId: string) => void;
}

const SpaceRequestsTable = ({
  requests,
  isLoading,
  onReply,
  onDelete,
}: SpaceRequestsTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Requester</TableHead>
            <TableHead>Space Type</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                Loading space requests...
              </TableCell>
            </TableRow>
          ) : requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                No space rental requests found
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{request.requester_name}</p>
                    {request.company_name && (
                      <p className="text-xs text-muted-foreground">{request.company_name}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{request.space_type}</TableCell>
                <TableCell>{request.event_type}</TableCell>
                <TableCell>
                  {format(new Date(request.preferred_date), "PP")}
                </TableCell>
                <TableCell>{request.capacity}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReply(request)}
                      className="flex items-center gap-1"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Reply
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => onDelete(request.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SpaceRequestsTable;
