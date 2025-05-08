
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Users, Database } from "lucide-react";

const Hero = () => {
  return (
    <div className="hero-gradient min-h-[92vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-balance leading-[1.1]">
              Connecting UAE Events with <span className="text-gradient">Brand Sponsors</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl">
              sponsorby is the premier marketplace providing brands high visibilty across the largest UAE events.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Button size="lg" className="text-lg px-8 py-7 rounded-xl" asChild>
                <Link to="/events">Find Events <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-7 rounded-xl border-2 border-white/20" asChild>
                <Link to="/post-event">Post Your Event</Link>
              </Button>
            </div>
            <div className="mt-12 flex items-center">
              <div className="flex -space-x-2">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                  <span className="text-xs font-bold">AE</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center">
                  <span className="text-xs font-bold">DB</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center">
                  <span className="text-xs font-bold">SJ</span>
                </div>
              </div>
              <span className="ml-4 text-sm text-gray-300">
                <span className="font-semibold text-white">200+ </span> 
                organizers trust our platform
              </span>
            </div>
          </div>
          <div className="lg:col-span-2 relative animate-scale-in">
            <div className="aspect-[4/3] bg-card/40 rounded-2xl glass-card overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                alt="UAE Events"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <p className="text-lg font-semibold">Dubai International Conference</p>
                  <p className="text-sm opacity-90">Featured Event</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-xl flex items-center space-x-4 w-64">
              <div className="flex-shrink-0 h-12 w-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                5%
              </div>
              <div>
                <p className="text-sm font-medium text-white">Commission Fee</p>
                <p className="text-xs text-gray-400">Transparent pricing</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 glass-card p-3 rounded-xl flex items-center">
              <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
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
