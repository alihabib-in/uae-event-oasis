
import React from "react";

interface EventInfoCardProps {
  event: {
    date: string;
    venue: string;
    location: string;
    attendees: number;
    min_bid: number;
    max_bid: number;
  };
}

const EventInfoCard = ({ event }: EventInfoCardProps) => {
  return (
    <div className="bg-card/30 rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-medium">Event Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Event Date</p>
          <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Location</p>
          <p className="font-medium">{event.venue}, {event.location}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Expected Attendees</p>
          <p className="font-medium">{event.attendees}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Sponsorship Range</p>
          <p className="font-medium">AED {event.min_bid.toLocaleString()} - AED {event.max_bid.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default EventInfoCard;
