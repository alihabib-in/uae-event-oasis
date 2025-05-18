
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BidsList from "./BidsList";
import BidsFilterForm from "./BidsFilterForm";

const BidsTab = () => {
  const [bids, setBids] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    eventId: "",
    status: "",
    search: "",
  });

  const fetchBids = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("bids")
        .select(`
          *,
          event:event_id (
            id,
            title
          )
        `)
        .order("created_at", { ascending: false });

      // Apply filters
      if (filters.eventId) {
        query = query.eq("event_id", filters.eventId);
      }
      
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      
      if (filters.search) {
        query = query.or(`
          brand_name.ilike.%${filters.search}%,
          contact_name.ilike.%${filters.search}%,
          email.ilike.%${filters.search}%
        `);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBids(data || []);
    } catch (error: any) {
      console.error("Error fetching bids:", error);
      toast.error(error.message || "Failed to load bids");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("id, title")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchBids();
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchBids();
  }, [filters]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      eventId: "",
      status: "",
      search: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sponsorship Bids</CardTitle>
        <CardDescription>
          View and manage all sponsorship bids for your events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BidsFilterForm 
          filters={filters}
          events={events}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFilters}
        />
        
        <div className="overflow-x-auto">
          <BidsList 
            bids={bids}
            onBidsUpdated={fetchBids}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BidsTab;
