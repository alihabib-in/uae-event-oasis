
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon } from "lucide-react";

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

  const {
    id,
    title,
    date,
    location,
    category,
    min_bid,
    max_bid,
    image
  } = event;

  return (
    <Link to={`/events/${id}`}>
      <Card className="overflow-hidden material-card h-full flex flex-col">
        <div className="aspect-[16/9] relative">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="object-cover w-full h-full opacity-90"
          />
          <Badge className="absolute top-4 right-4 bg-primary rounded-full py-1.5 px-3">
            {category}
          </Badge>
        </div>
        <CardContent className="pt-6 pb-4 flex-grow">
          <div className="flex items-center mb-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4 mr-1 text-primary" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
          <h3 className="text-xl font-bold mb-3 leading-tight text-balance text-white tracking-tight font-grotesk">{title}</h3>
          <div className="flex items-center text-muted-foreground text-sm mb-2">
            <MapPinIcon className="h-4 w-4 mr-1 text-accent" />
            <p>{location}</p>
          </div>
        </CardContent>
        <CardFooter className="border-t border-white/10 pt-4 pb-5 bg-muted/5">
          <div className="w-full">
            <p className="text-sm text-muted-foreground mb-1">Sponsorship Range:</p>
            <p className="font-bold text-lg text-primary tracking-tight">
              AED {min_bid.toLocaleString()} - {max_bid.toLocaleString()}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;
