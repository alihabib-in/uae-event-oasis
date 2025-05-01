
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="hero-gradient min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Connect UAE Events with <span className="text-primary">Brand Sponsors</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              UAESponsor is the premier marketplace connecting event organizers
              with brands looking for sponsorship opportunities across the UAE.
              Simplify your sponsorship process and maximize your event's potential.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link to="/events">Find Events to Sponsor <ArrowRight className="ml-2" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link to="/post-event">Post Your Event</Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center">
              <div className="flex -space-x-2">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                  <span className="text-xs font-bold">AE</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/80 text-white flex items-center justify-center">
                  <span className="text-xs font-bold">DB</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/60 text-white flex items-center justify-center">
                  <span className="text-xs font-bold">SJ</span>
                </div>
              </div>
              <span className="ml-4 text-sm text-gray-500">
                <span className="font-semibold text-gray-900">200+ </span> 
                organizers trust our platform
              </span>
            </div>
          </div>
          <div className="relative animate-scale-in">
            <div className="aspect-[4/3] bg-white rounded-lg shadow-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                alt="UAE Events"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <p className="text-lg font-semibold">Dubai International Conference</p>
                  <p className="text-sm opacity-90">Featured Event</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 w-64">
              <div className="flex-shrink-0 h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                5%
              </div>
              <div>
                <p className="text-sm font-medium">Commission Fee</p>
                <p className="text-xs text-gray-500">Transparent pricing</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white p-3 rounded-lg shadow-lg flex items-center">
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Live Bidding
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
