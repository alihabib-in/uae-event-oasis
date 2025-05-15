
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
      <Card className="overflow-hidden group hover:shadow-xl transition-all duration-500 border-primary/10 h-full flex flex-col transform hover:-translate-y-1">
        <div className="aspect-[16/9] relative h-40 overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70"></div>
          <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary text-white rounded-full py-1 px-3 text-xs shadow-md">
            {category}
          </Badge>
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-lg font-bold text-white mb-1 leading-tight text-balance tracking-tight font-grotesk line-clamp-2 drop-shadow-md">
              {title}
            </h3>
          </div>
        </div>
        <CardContent className="pt-3 pb-2 flex-grow">
          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center text-muted-foreground text-xs">
              <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-muted-foreground text-xs">
              <MapPinIcon className="h-3.5 w-3.5 mr-1.5 text-accent" />
              <p className="truncate">{location}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-primary/5 pt-3 pb-3 bg-muted/10">
          <div className="w-full flex items-center gap-2">
            <Banknote className="h-4 w-4 text-primary" />
            <p className="font-medium text-sm text-primary tracking-tight">
              AED {min_bid.toLocaleString()} - {max_bid.toLocaleString()}
            </p>
            <div className="ml-auto">
              <Badge variant="outline" className="bg-primary/5 border-primary/10 text-xs">
                <Award className="h-3 w-3 mr-1" /> Sponsor
              </Badge>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;
