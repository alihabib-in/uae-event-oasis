
import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Package, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  is_public: boolean;
  [key: string]: any;
}

interface EventsTableProps {
  events: Event[];
  isLoading: boolean;
  onViewPackages: (eventId: string) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

const EventsTable = ({
  events,
  isLoading,
  onViewPackages,
  onEditEvent,
  onDeleteEvent,
}: EventsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Packages</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                Loading events...
              </TableCell>
            </TableRow>
          ) : events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No events found
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">
                  {event.title}
                </TableCell>
                <TableCell>
                  {event.date ? format(new Date(event.date), "PPP") : "N/A"}
                </TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      event.is_public
                        ? "default"
                        : "secondary"
                    }
                  >
                    {event.is_public ? "Public" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => onViewPackages(event.id)}
                  >
                    <Package className="h-4 w-4" />
                    <span>View</span>
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditEvent(event)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => onDeleteEvent(event.id)}
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

export default EventsTable;
