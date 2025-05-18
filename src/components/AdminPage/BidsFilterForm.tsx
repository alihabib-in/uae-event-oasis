
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface BidsFilterFormProps {
  filters: {
    eventId: string;
    status: string;
    search: string;
  };
  events: any[];
  onFilterChange: (filterName: string, value: string) => void;
  onResetFilters: () => void;
}

const BidsFilterForm = ({ filters, events, onFilterChange, onResetFilters }: BidsFilterFormProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      <div className="w-full md:w-80">
        <Select
          value={filters.eventId}
          onValueChange={(value) => onFilterChange("eventId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Events</SelectItem>
            {events.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-48">
        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1 relative">
        <Input
          placeholder="Search brands, contacts..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-9"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      
      <Button
        variant="ghost"
        onClick={onResetFilters}
        className="flex items-center"
      >
        <X className="h-4 w-4 mr-1" />
        Reset
      </Button>
    </div>
  );
};

export default BidsFilterForm;
