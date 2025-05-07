
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, Calendar, PieChart } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      value: "200+",
      label: "UAE Events",
      description: "Events listed across all emirates",
      icon: <Calendar className="h-10 w-10 text-primary" />
    },
    {
      value: "150+",
      label: "Active Brands",
      description: "Seeking sponsorship opportunities",
      icon: <Users className="h-10 w-10 text-secondary" />
    },
    {
      value: "95%",
      label: "Success Rate",
      description: "Events finding suitable sponsors",
      icon: <PieChart className="h-10 w-10 text-accent" />
    },
    {
      value: "5%",
      label: "Commission",
      description: "Transparent fee structure",
      icon: <Search className="h-10 w-10 text-primary" />
    },
  ];

  return (
    <section className="py-24 section-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title">sponsorby by the Numbers</h2>
          <p className="section-subtitle">
            Our platform is growing and connecting brands with events across the UAE.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 material-card">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <p className="text-5xl font-bold text-primary mb-4">{stat.value}</p>
                <p className="text-xl font-medium mb-3 text-white">{stat.label}</p>
                <p className="text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary/5 rounded-full"></div>
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-secondary/5 rounded-full"></div>
    </section>
  );
};

export default StatsSection;
