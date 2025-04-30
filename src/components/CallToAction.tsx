
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CallToActionProps {
  type: "brand" | "organizer";
}

const CallToAction = ({ type }: CallToActionProps) => {
  const content = {
    brand: {
      title: "Ready to find the perfect event for your brand?",
      description:
        "Discover diverse sponsorship opportunities and increase your brand visibility at UAE events.",
      primaryText: "Browse Events",
      primaryLink: "/events",
      secondaryText: "Learn More",
      secondaryLink: "/for-brands",
      backgroundClass: "bg-gradient-to-r from-primary/10 to-primary/5",
    },
    organizer: {
      title: "Need sponsors for your upcoming event?",
      description:
        "Connect with brands eager to sponsor events and maximize your event's sponsorship revenue.",
      primaryText: "Post Your Event",
      primaryLink: "/post-event",
      secondaryText: "Learn More",
      secondaryLink: "/for-organizers",
      backgroundClass: "bg-gradient-to-r from-gold/10 to-gold/5",
    },
  };

  const selected = content[type];

  return (
    <section className={`py-16 ${selected.backgroundClass}`}>
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">{selected.title}</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {selected.description}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" asChild>
            <Link to={selected.primaryLink}>{selected.primaryText}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to={selected.secondaryLink}>{selected.secondaryText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
