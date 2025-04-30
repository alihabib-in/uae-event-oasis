
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  venue: string;
  category: string;
  minBid: number;
  maxBid: number;
  organizerId: string;
  organizerName: string;
  organizerLogo?: string;
  image: string;
  attendees: number;
  sponsorshipDetails: string[];
  status: "open" | "closed" | "awarded";
  featured?: boolean;
  tags?: string[];
}

export const events: Event[] = [
  {
    id: "1",
    title: "Dubai Tech Innovation Summit 2024",
    description: "Join us for the most anticipated tech event in Dubai, bringing together industry leaders, innovators, and tech enthusiasts. This summit will showcase cutting-edge technologies, feature insightful panel discussions, and offer unparalleled networking opportunities with tech pioneers from across the globe.",
    date: "2024-09-15",
    endDate: "2024-09-17",
    location: "Dubai, UAE",
    venue: "Dubai World Trade Centre",
    category: "Technology",
    minBid: 50000,
    maxBid: 200000,
    organizerId: "org1",
    organizerName: "Future Tech Events",
    organizerLogo: "https://i.pravatar.cc/150?img=3",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    attendees: 5000,
    sponsorshipDetails: [
      "Logo placement on event website and app",
      "Exhibition booth in premium location",
      "Keynote speaking opportunity",
      "VIP dinner invitation",
      "Social media promotions",
    ],
    status: "open",
    featured: true,
    tags: ["Tech", "Innovation", "Digital", "AI"],
  },
  {
    id: "2",
    title: "Abu Dhabi International Food Festival",
    description: "Experience the rich tapestry of global cuisines at the Abu Dhabi International Food Festival. This gastronomic celebration brings together renowned chefs, food artisans, and culinary innovators to showcase their exceptional creations and share their passion for food.",
    date: "2024-11-05",
    endDate: "2024-11-10",
    location: "Abu Dhabi, UAE",
    venue: "Abu Dhabi Corniche",
    category: "Food & Beverage",
    minBid: 30000,
    maxBid: 120000,
    organizerId: "org2",
    organizerName: "Abu Dhabi Events Authority",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    attendees: 15000,
    sponsorshipDetails: [
      "Brand activation zone",
      "Logo on all promotional materials",
      "Product sampling opportunities",
      "Chef demonstration sponsorship",
      "Media coverage package",
    ],
    status: "open",
    tags: ["Food", "Culture", "Festival", "Culinary"],
  },
  {
    id: "3",
    title: "Sharjah International Book Fair",
    description: "The Sharjah International Book Fair is one of the largest book fairs in the world, celebrating literature, knowledge, and cultural exchange. This prestigious event attracts publishers, authors, intellectuals, and book lovers from across the globe.",
    date: "2024-10-30",
    endDate: "2024-11-09",
    location: "Sharjah, UAE",
    venue: "Expo Centre Sharjah",
    category: "Arts & Culture",
    minBid: 25000,
    maxBid: 75000,
    organizerId: "org3",
    organizerName: "Sharjah Book Authority",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2015&q=80",
    attendees: 20000,
    sponsorshipDetails: [
      "Author signing session sponsorship",
      "Workshop and seminar branding",
      "Digital advertising throughout venue",
      "Children's reading corner sponsorship",
      "VIP lounge naming rights",
    ],
    status: "open",
    tags: ["Literature", "Education", "Books", "Culture"],
  },
  {
    id: "4",
    title: "Dubai International Sports Conference",
    description: "A premier sports conference bringing together global sports leaders, athletes, and industry professionals to discuss the future of sports, emerging trends, and innovations in the sporting world.",
    date: "2024-12-27",
    endDate: "2024-12-29",
    location: "Dubai, UAE",
    venue: "Madinat Jumeirah",
    category: "Sports",
    minBid: 75000,
    maxBid: 250000,
    organizerId: "org4",
    organizerName: "Dubai Sports Council",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80",
    attendees: 3000,
    sponsorshipDetails: [
      "Panel discussion sponsorship",
      "Athlete meet-and-greet opportunities",
      "Award ceremony presentation",
      "Branded merchandise for all attendees",
      "Exclusive sports clinic sponsorship",
    ],
    status: "open",
    featured: true,
    tags: ["Sports", "Conference", "Athletics", "Networking"],
  },
  {
    id: "5",
    title: "Ras Al Khaimah Fine Arts Festival",
    description: "The Ras Al Khaimah Fine Arts Festival showcases the work of local and international artists across various disciplines, celebrating creativity and cultural expression in the northern emirate.",
    date: "2025-02-03",
    endDate: "2025-02-28",
    location: "Ras Al Khaimah, UAE",
    venue: "Al Jazirah Al Hamra Heritage Village",
    category: "Arts & Culture",
    minBid: 15000,
    maxBid: 60000,
    organizerId: "org5",
    organizerName: "RAK Art Foundation",
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    attendees: 8000,
    sponsorshipDetails: [
      "Artist residency program sponsorship",
      "Exhibition space branding",
      "Workshop series naming rights",
      "Opening night reception host",
      "Art competition judging participation",
    ],
    status: "open",
    tags: ["Art", "Culture", "Festival", "Heritage"],
  },
  {
    id: "6",
    title: "Abu Dhabi Sustainability Week",
    description: "Abu Dhabi Sustainability Week is a global initiative championing sustainable development and addressing urgent challenges in energy, climate action, and sustainable resource management.",
    date: "2025-01-15",
    endDate: "2025-01-22",
    location: "Abu Dhabi, UAE",
    venue: "ADNEC",
    category: "Business",
    minBid: 100000,
    maxBid: 500000,
    organizerId: "org6",
    organizerName: "Masdar",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    attendees: 45000,
    sponsorshipDetails: [
      "Sustainability showcase pavilion",
      "Innovation awards sponsorship",
      "Green technology demonstration zone",
      "Policy forum presenting partnership",
      "Youth programs & mentorship opportunities",
    ],
    status: "open",
    featured: true,
    tags: ["Sustainability", "Environment", "Innovation", "Future"],
  },
];

export const getFeaturedEvents = (): Event[] => {
  return events.filter(event => event.featured);
};

export const getEventsByCategory = (category: string): Event[] => {
  return events.filter(event => event.category === category);
};

export const getEventById = (id: string): Event | undefined => {
  return events.find(event => event.id === id);
};
