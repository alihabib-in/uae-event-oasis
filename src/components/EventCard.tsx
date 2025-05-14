import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, Banknote, Award } from "lucide-react";

export interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    category: string;
    min_bid: number;
    max_bid: number;
    image?: string;
    is_public?: boolean;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  // Add a guard clause to prevent destructuring undefined
  if (!event) {
    console.error("Event is undefined in EventCard");
    return null;
  }

  // Safe destructuring with defaults
  const {
    id,
    title = "Untitled Event",
    date = new Date().toISOString(),
    location = "TBA",
    category = "Event",
    min_bid = 0,
    max_bid = 0,
    image = "/placeholder.svg"
  } = event;

  // Make sure we have a valid ID before rendering the card
  if (!id) {
    console.error("Event ID is missing in EventCard");
    return null;
  }

  return (
    <Link to={`/events/${id}`}>
      <Card className="overflow-hidden material-card h-full flex flex-col hover:shadow-md transition-all duration-300">
        <div className="aspect-[16/9] relative h-36">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="object-cover w-full h-full opacity-90"
          />
          <Badge className="absolute top-2 right-2 bg-primary rounded-full py-1 px-2 text-xs">
            {category}
          </Badge>
        </div>
        <CardContent className="pt-3 pb-2 flex-grow">
          <h3 className="text-base font-bold mb-1 leading-tight text-balance tracking-tight font-grotesk line-clamp-2">{title}</h3>
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center text-muted-foreground text-xs">
              <CalendarIcon className="h-3 w-3 mr-1 text-primary" />
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-muted-foreground text-xs">
              <MapPinIcon className="h-3 w-3 mr-1 text-accent" />
              <p className="truncate">{location}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-white/10 pt-2 pb-3 bg-muted/5">
          <div className="w-full flex items-center gap-1">
            <Banknote className="h-3 w-3 text-primary" />
            <p className="font-medium text-sm text-primary tracking-tight">
              AED {min_bid.toLocaleString()} - {max_bid.toLocaleString()}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;
