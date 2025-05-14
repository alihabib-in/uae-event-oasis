
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Connect",
      description: "Browse event profiles and discover opportunities that align with your brand values and audience.",
      icon: "🔍",
      benefits: ["Access curated events", "Filter by industry & budget", "Explore detailed profiles"]
    },
    {
      number: "02",
      title: "Engage",
      description: "Initiate discussions directly with event organizers about potential sponsorship opportunities.",
      icon: "✉️",
      benefits: ["Direct communication", "Clarify expectations", "Explore customization options"]
    },
    {
      number: "03",
      title: "Collaborate",
      description: "Finalize agreements and build meaningful partnerships that deliver value for all parties.",
      icon: "🤝",
      benefits: ["Simple contract process", "Secure payments", "Post-event analytics"]
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-100 to-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            The Journey from Connection to Collaboration
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our streamlined process makes it easy for brands and event organizers to find each other and create successful partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mb-16">
          {steps.map((step, index) => (
            <Card key={step.number} className="border-none shadow-lg overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
              <CardContent className="p-8">
                <div className="flex flex-col h-full">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-5xl font-bold text-slate-200">{step.number}</span>
                    <span className="text-4xl">{step.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">{step.title}</h3>
                  <p className="text-slate-600 mb-6">{step.description}</p>
                  
                  <div className="mt-auto">
                    <h4 className="font-medium text-slate-700 mb-2">Key Benefits:</h4>
                    <ul className="space-y-2">
                      {step.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                          <span className="text-slate-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-5 transform -translate-y-1/2">
                  <div className="bg-primary rounded-full p-2 z-10">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="px-8 py-6 text-lg rounded-full shadow-md hover:shadow-lg">
            <Link to="/events">
              Explore Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
