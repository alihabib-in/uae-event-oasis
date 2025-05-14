
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Building, MapPin, Check, Users } from "lucide-react";
import RentSpaceForm from "@/components/RentSpaceForm";

const RentSpacePage = () => {
  // Sample event spaces
  const spaces = [
    {
      name: "Grand Convention Center",
      location: "Dubai Business Bay",
      capacity: "Up to 1,000 guests",
      features: ["Full AV equipment", "Catering services", "Flexible layouts", "VIP rooms"],
      image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=2062&auto=format&fit=crop"
    },
    {
      name: "Waterfront Exhibition Hall",
      location: "Abu Dhabi Corniche",
      capacity: "Up to 500 guests",
      features: ["Panoramic sea views", "Modern facilities", "Exhibition booths", "Outdoor terrace"],
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
    },
    {
      name: "Desert Palm Resort",
      location: "Al Ain Road, Dubai",
      capacity: "Up to 300 guests",
      features: ["Lush gardens", "Luxury amenities", "Private setting", "Accommodation"],
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              <div className="flex-1 space-y-6">
                <div className="inline-block bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium">
                  Event Spaces for Rent
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Find the Perfect Venue for Your Next Event
                </h1>
                <p className="text-xl text-slate-300">
                  We offer premium event spaces across the UAE. From intimate gatherings to large conferences, we have the perfect venue for every occasion.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Building className="w-4 h-4 text-blue-400" />
                    </span>
                    <span className="text-slate-300">Premium Venues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-blue-400" />
                    </span>
                    <span className="text-slate-300">Prime Locations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-400" />
                    </span>
                    <span className="text-slate-300">Various Capacities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-400" />
                    </span>
                    <span className="text-slate-300">Flexible Dates</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full">
                <div className="relative h-80 md:h-96 overflow-hidden rounded-2xl shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop" 
                    alt="Premium event venue" 
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-white font-medium text-xl">Dubai Conference Center</div>
                    <div className="text-slate-300 flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> Downtown Dubai
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Spaces */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center text-slate-100">
              Featured Event Spaces
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {spaces.map((space, index) => (
                <div key={index} className="rounded-lg overflow-hidden transition-transform hover:scale-[1.02] shadow-xl">
                  <div className="h-48 relative">
                    <img 
                      src={space.image} 
                      alt={space.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-lg font-semibold text-white">{space.name}</h3>
                      <div className="flex items-center text-slate-300 text-sm">
                        <MapPin className="h-3 w-3 mr-1" /> {space.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 dark-card">
                    <div className="text-blue-400 mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{space.capacity}</span>
                    </div>
                    
                    <div className="space-y-2">
                      {space.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-slate-300">
                          <Check className="h-4 w-4 text-blue-400 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Request Form */}
        <section className="py-16 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3 space-y-6">
                <h2 className="text-3xl font-bold text-white">
                  Request a Venue for Your Event
                </h2>
                <p className="text-slate-300">
                  Fill out the form to request a space for your upcoming event. Our team will review your requirements and get back to you with options and pricing.
                </p>
                
                <div className="space-y-4 mt-6">
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-400" />
                      <h3 className="font-medium text-white">Flexible Scheduling</h3>
                    </div>
                    <p className="text-slate-400 mt-2 text-sm">
                      Choose from a variety of available dates that work best for your event.
                    </p>
                  </div>
                  
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-blue-400" />
                      <h3 className="font-medium text-white">Premium Venues</h3>
                    </div>
                    <p className="text-slate-400 mt-2 text-sm">
                      Access to exclusive spaces equipped with modern amenities and services.
                    </p>
                  </div>
                  
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-blue-400" />
                      <h3 className="font-medium text-white">Prime Locations</h3>
                    </div>
                    <p className="text-slate-400 mt-2 text-sm">
                      Venues in strategic locations across Dubai, Abu Dhabi, and Sharjah.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-2/3 dark-card p-6 rounded-lg">
                <RentSpaceForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default RentSpacePage;
