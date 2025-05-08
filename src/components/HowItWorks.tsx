
import { Check, Users, Calendar, MessageSquare, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Create Your Profile",
      description: "Sign up as a brand or event organizer and complete your profile with relevant details.",
      icon: <Users className="h-8 w-8 text-primary" />,
      color: "from-primary/20 to-primary/10"
    },
    {
      id: 2,
      title: "Post or Browse Events",
      description: "Event organizers post opportunities while brands browse and filter events.",
      icon: <Calendar className="h-8 w-8 text-secondary" />,
      color: "from-secondary/20 to-secondary/10"
    },
    {
      id: 3,
      title: "Submit or Review Bids",
      description: "Brands submit competitive bids, and organizers review proposals from interested sponsors.",
      icon: <MessageSquare className="h-8 w-8 text-accent" />,
      color: "from-accent/20 to-accent/10"
    },
    {
      id: 4,
      title: "Connect & Finalize",
      description: "Once matched, communicate directly to finalize sponsorship details and agreements.",
      icon: <Zap className="h-8 w-8 text-gold" />,
      color: "from-gold/20 to-gold/10"
    },
  ];

  return (
    <section className="py-20 bg-background/60 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 right-1/3 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white font-grotesk tracking-tight mb-4">The Journey from Connection to Collaboration</h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Our streamlined process makes it easy for brands and event organizers to connect and create successful sponsorships.
          </p>
        </div>

        {/* Visual journey path */}
        <div className="relative">
          {/* Connection path - visible only on larger screens */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent transform -translate-y-1/2 z-0"></div>
          
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg relative`}>
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
                  {step.icon}
                  <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-card text-white flex items-center justify-center text-xs font-bold border border-white/20">
                    {step.id}
                  </div>
                </div>
                <Card className="w-full bg-card/40 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-white font-grotesk">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits section */}
        <div className="mt-20 bg-card/30 backdrop-blur-sm rounded-lg border border-white/10 p-8 relative overflow-hidden">
          {/* Decorative corner accent */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-white font-grotesk tracking-tight">Safe & Secure Platform</h3>
              <p className="text-gray-300 mb-6">
                Our platform ensures a seamless and secure experience for all users, with transparent processes and fair commission rates.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span>Verified event organizers and brands</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span>Secure bidding and payment system</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span>Transparent 5% commission fees</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span>Dedicated support team</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 rounded-lg"></div>
              <img
                className="rounded-lg object-cover w-full h-64 md:h-80 opacity-80"
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                alt="Platform security illustration"
              />
              <div className="absolute inset-0 rounded-lg border border-white/10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
