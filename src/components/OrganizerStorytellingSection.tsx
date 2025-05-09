
import React from "react";
import { motion } from "framer-motion";
import { Handshake, Coins, Briefcase, Users, Settings, Lightbulb, BarChart3, Mic, Star } from "lucide-react";

const OrganizerStorytellingSection = () => {
  return (
    <section className="py-16 bg-muted/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Financial Backing Section */}
        <div className="mb-24 relative">
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Secure Premium Financial Backing</h2>
              <p className="text-lg mb-6">
                Transform your event budget with sponsorship opportunities that connect you with brands seeking meaningful engagement. Our platform helps you secure the financial support needed to create exceptional events.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-primary" />
                  </div>
                  <span>Access to premium sponsorship packages</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Handshake className="h-5 w-5 text-primary" />
                  </div>
                  <span>Direct connections with relevant brands</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span>Curated sponsor matching based on audience</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="vector-art-container aspect-square relative">
                {/* Vector Art Animation - Financial Backing */}
                <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl h-full flex items-center justify-center">
                  <div className="relative w-full max-w-sm mx-auto">
                    {/* Event Base Circle */}
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 border border-white/10"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* Event Icon */}
                    <motion.div 
                      className="absolute left-[calc(50%-40px)] top-[calc(50%-40px)] h-20 w-20 rounded-full bg-card/40 backdrop-blur-sm border border-white/10 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <Briefcase className="h-10 w-10 text-primary" />
                    </motion.div>
                    
                    {/* Sponsor 1 */}
                    <motion.div 
                      className="absolute left-[20%] top-[30%] h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(14,165,233,0.3)" }}
                    >
                      <span className="font-bold text-primary">S1</span>
                    </motion.div>
                    
                    {/* Sponsor 2 */}
                    <motion.div 
                      className="absolute right-[20%] top-[30%] h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center"
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(139,92,246,0.3)" }}
                    >
                      <span className="font-bold text-secondary">S2</span>
                    </motion.div>
                    
                    {/* Sponsor 3 */}
                    <motion.div 
                      className="absolute left-[25%] bottom-[20%] h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(249,115,22,0.3)" }}
                    >
                      <span className="font-bold text-accent">S3</span>
                    </motion.div>
                    
                    {/* Money Flow */}
                    <svg className="absolute inset-0 w-full h-full">
                      <motion.path 
                        d="M 100 140 Q 150 170, 200 180" 
                        stroke="#0ea5e9" 
                        strokeWidth="3" 
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                      />
                      <motion.path 
                        d="M 300 140 Q 250 170, 200 180" 
                        stroke="#8b5cf6" 
                        strokeWidth="3" 
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1.0, duration: 0.6 }}
                      />
                      <motion.path 
                        d="M 110 260 Q 150 230, 200 180" 
                        stroke="#f97316" 
                        strokeWidth="3" 
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                      />
                      
                      {/* Money Icons */}
                      <motion.circle 
                        cx="150" cy="155" r="6" 
                        fill="#0ea5e9"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.3 }}
                      />
                      <motion.circle 
                        cx="250" cy="155" r="6" 
                        fill="#8b5cf6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3, duration: 0.3 }}
                      />
                      <motion.circle 
                        cx="150" cy="230" r="6" 
                        fill="#f97316"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4, duration: 0.3 }}
                      />
                    </svg>

                    {/* Pulse Effect */}
                    <motion.div 
                      className="absolute left-[calc(50%-50px)] top-[calc(50%-50px)] h-24 w-24 rounded-full bg-primary/10"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.5, 0.2]
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Comprehensive Event Management */}
        <div className="mb-24 relative">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary/10 rounded-full blur-xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="vector-art-container aspect-square relative">
                {/* Vector Art Animation - Event Management */}
                <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl h-full flex items-center justify-center">
                  <div className="relative w-full max-w-sm mx-auto">
                    {/* Central Event Hub */}
                    <motion.div 
                      className="absolute left-[calc(50%-50px)] top-[calc(50%-50px)] h-24 w-24 rounded-xl bg-gradient-to-br from-secondary/30 to-primary/30 border border-white/20 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <Settings className="h-12 w-12 text-white" />
                    </motion.div>
                    
                    {/* Stage & Lights */}
                    <motion.div 
                      className="absolute left-[10%] top-[20%] h-16 w-16 rounded-lg bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center"
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <Mic className="h-8 w-8 text-accent" />
                    </motion.div>
                    
                    {/* Marketing */}
                    <motion.div 
                      className="absolute right-[15%] top-[15%] h-16 w-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
                      initial={{ y: -30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      whileHover={{ rotate: -10, scale: 1.1 }}
                    >
                      <BarChart3 className="h-8 w-8 text-primary" />
                    </motion.div>
                    
                    {/* Brand Integration */}
                    <motion.div 
                      className="absolute right-[20%] bottom-[20%] h-16 w-16 rounded-lg bg-gradient-to-br from-yellow-400/20 to-primary/20 flex items-center justify-center"
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <Star className="h-8 w-8 text-yellow-500" />
                    </motion.div>
                    
                    {/* Manpower */}
                    <motion.div 
                      className="absolute left-[15%] bottom-[25%] h-16 w-16 rounded-lg bg-gradient-to-br from-secondary/20 to-yellow-400/20 flex items-center justify-center"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      whileHover={{ rotate: -10, scale: 1.1 }}
                    >
                      <Users className="h-8 w-8 text-secondary" />
                    </motion.div>

                    {/* Connecting Lines */}
                    <svg className="absolute inset-0 w-full h-full">
                      <motion.path 
                        d="M 80 80 Q 120 140, 180 180" 
                        stroke="url(#eventGradient1)" 
                        strokeWidth="2" 
                        strokeDasharray="5 5"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                      />
                      <motion.path 
                        d="M 300 80 Q 260 140, 220 180" 
                        stroke="url(#eventGradient2)" 
                        strokeWidth="2" 
                        strokeDasharray="5 5"
                        fill="none" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1.0, duration: 0.6 }}
                      />
                      <motion.path 
                        d="M 80 260 Q 120 220, 180 200" 
                        stroke="url(#eventGradient3)" 
                        strokeWidth="2" 
                        strokeDasharray="5 5"
                        fill="none" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                      />
                      <motion.path 
                        d="M 300 260 Q 260 220, 220 200" 
                        stroke="url(#eventGradient4)" 
                        strokeWidth="2" 
                        strokeDasharray="5 5"
                        fill="none" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                      />
                      <defs>
                        <linearGradient id="eventGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                        <linearGradient id="eventGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                        <linearGradient id="eventGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#7c3aed" />
                          <stop offset="100%" stopColor="#eab308" />
                        </linearGradient>
                        <linearGradient id="eventGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#eab308" />
                          <stop offset="100%" stopColor="#0ea5e9" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* Background Pulse */}
                    <motion.div 
                      className="absolute inset-0 rounded-xl bg-secondary/5"
                      animate={{ 
                        boxShadow: ['0 0 0 rgba(139,92,246,0)', '0 0 20px rgba(139,92,246,0.3)', '0 0 0 rgba(139,92,246,0)']
                      }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold mb-6">Complete Event Management Solutions</h2>
              <p className="text-lg mb-6">
                Leverage our extensive event management expertise to ensure your event runs flawlessly. We provide end-to-end support for all aspects of your event, from setup to execution.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Mic className="h-5 w-5 text-secondary" />
                  </div>
                  <span>Professional stage and lighting setup</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  <span>Experienced event staff and management</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-secondary" />
                  </div>
                  <span>Comprehensive marketing and promotion</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Star className="h-5 w-5 text-secondary" />
                  </div>
                  <span>Seamless brand integration throughout the event</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Event Examples */}
        <div className="relative">
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
          <div className="glass-card rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Real Event Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventExamples.map((example, index) => (
                <motion.div 
                  key={index}
                  className="relative bg-card/30 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {example.icon}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{example.title}</h3>
                    <p className="text-muted-foreground">{example.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const eventExamples = [
  {
    title: "Dubai Tech Summit",
    description: "Secured 12 premium sponsors generating an additional AED 800,000 in event funding with full production support.",
    icon: <Lightbulb className="h-16 w-16 text-primary/70" />
  },
  {
    title: "Abu Dhabi Fashion Week",
    description: "Integrated 8 luxury brands throughout the venue with custom installations and dedicated promotional spaces.",
    icon: <Star className="h-16 w-16 text-secondary/70" />
  },
  {
    title: "UAE Business Conference",
    description: "Managed complete event logistics for 2,000+ attendees while securing corporate sponsorships worth AED 1.2M.",
    icon: <Briefcase className="h-16 w-16 text-accent/70" />
  }
];

export default OrganizerStorytellingSection;
