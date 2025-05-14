
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, MessageCircle, Handshake, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Connect",
      description: "Browse event profiles and discover opportunities that align with your brand values and audience.",
      icon: <Search className="w-10 h-10 text-primary" />,
      benefits: ["Access curated events", "Filter by industry & budget", "Explore detailed profiles"]
    },
    {
      number: "02",
      title: "Engage",
      description: "Initiate discussions directly with event organizers about potential sponsorship opportunities.",
      icon: <MessageCircle className="w-10 h-10 text-primary" />,
      benefits: ["Direct communication", "Clarify expectations", "Explore customization options"]
    },
    {
      number: "03",
      title: "Collaborate",
      description: "Finalize agreements and build meaningful partnerships that deliver value for all parties.",
      icon: <Handshake className="w-10 h-10 text-primary" />,
      benefits: ["Simple contract process", "Secure payments", "Post-event analytics"]
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-100 to-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            The Journey from Connection to Collaboration
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Our streamlined process makes it easy for brands and event organizers to find each other and create successful partnerships.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 relative mb-16">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 z-0"></div>
          
          {steps.map((step, index) => (
            <div key={step.number} className="flex-1 relative">
              {/* Circle with Number */}
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center border-2 border-primary text-primary font-bold text-lg mb-6 mx-auto z-10 relative shadow-md">
                {step.number.split("")[1]}
              </div>
              
              {/* Step Content */}
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all z-10 relative">
                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 text-center">{step.title}</h3>
                <p className="text-slate-600 mb-5 text-center">{step.description}</p>
                
                <div>
                  <h4 className="font-medium text-slate-700 mb-2 text-center">Key Benefits:</h4>
                  <ul className="space-y-2">
                    {step.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 shrink-0 mt-0.5" />
                        <span className="text-slate-600 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Arrow for connection */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-24 -right-4 transform -translate-y-1/2 z-20">
                  <div className="bg-primary rounded-full p-1">
                    <ArrowRight className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="px-6 py-5 text-lg rounded-full shadow-md hover:shadow-lg">
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
