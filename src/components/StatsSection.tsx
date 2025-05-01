
import { Card, CardContent } from "@/components/ui/card";

const StatsSection = () => {
  const stats = [
    {
      value: "200+",
      label: "UAE Events",
      description: "Events listed across all emirates",
    },
    {
      value: "150+",
      label: "Active Brands",
      description: "Seeking sponsorship opportunities",
    },
    {
      value: "95%",
      label: "Success Rate",
      description: "Events finding suitable sponsors",
    },
    {
      value: "5%",
      label: "Commission",
      description: "Transparent fee structure",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">UAESponsor by the Numbers</h2>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Our platform is growing and connecting brands with events across the UAE.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg card-hover">
              <CardContent className="p-8 text-center">
                <p className="text-5xl font-bold text-primary mb-4">{stat.value}</p>
                <p className="text-xl font-medium mb-2">{stat.label}</p>
                <p className="text-gray-500">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
