
export interface SponsorshipType {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  active: boolean;
}

export interface BrandInquiry {
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  budget: number;
  message: string;
}

export interface EventOrganizer {
  name: string;
  email: string;
  phone: string;
  company: string;
  eventName: string;
  title: string;
  sponsorshipType: string;
  description: string;
}

export const sponsorshipTypes: SponsorshipType[] = [
  {
    id: "1",
    name: "Platinum Sponsor",
    description: "Premium visibility across the entire event",
    price: 50000,
    features: [
      "Main stage branding",
      "Premium booth location",
      "Logo on all promotional materials",
      "10 VIP passes",
      "Opportunity to speak at the event",
      "Social media promotion"
    ],
    active: true
  },
  {
    id: "2",
    name: "Gold Sponsor",
    description: "High visibility throughout the event",
    price: 25000,
    features: [
      "Secondary stage branding",
      "Standard booth",
      "Logo on digital materials",
      "5 VIP passes",
      "Social media mentions"
    ],
    active: true
  },
  {
    id: "3",
    name: "Silver Sponsor",
    description: "Good visibility at the event",
    price: 10000,
    features: [
      "Logo on event website",
      "Small booth space",
      "2 VIP passes",
      "Mention in event program"
    ],
    active: true
  },
  {
    id: "4",
    name: "Bronze Sponsor",
    description: "Basic visibility at the event",
    price: 5000,
    features: [
      "Logo on event website",
      "1 VIP pass",
      "Mention in event program"
    ],
    active: true
  },
  {
    id: "5",
    name: "Merchandise Sponsor",
    description: "Brand exposure on event merchandise",
    price: 7500,
    features: [
      "Logo on event t-shirts",
      "Logo on event bags",
      "Mention in event program",
      "2 standard passes"
    ],
    active: false
  }
];

export const brandInquiries: BrandInquiry[] = [
  {
    name: "Ahmed Al Mansoori",
    email: "ahmed@emiratesgroup.ae",
    phone: "+971 55 123 4567",
    company: "Emirates Group",
    title: "Marketing Director",
    budget: 75000,
    message: "We're interested in becoming a platinum sponsor for the Dubai Business Forum. Please send us more details about the opportunities available."
  },
  {
    name: "Sarah Johnson",
    email: "sarah@adnoc.ae",
    phone: "+971 50 234 5678",
    company: "ADNOC",
    title: "Head of Brand Partnerships",
    budget: 50000,
    message: "Our company is looking to sponsor technology events in Abu Dhabi. We're particularly interested in the main stage branding option."
  },
  {
    name: "Mohammed Al Hashimi",
    email: "mohammed@emaar.ae",
    phone: "+971 54 345 6789",
    company: "Emaar Properties",
    title: "Brand Manager",
    budget: 30000,
    message: "We would like to discuss sponsorship opportunities for real estate and architecture events in Dubai. Our budget is flexible for the right partnership."
  },
  {
    name: "Lisa Wong",
    email: "lisa@mashreq.com",
    phone: "+971 52 456 7890",
    company: "Mashreq Bank",
    title: "Marketing Manager",
    budget: 25000,
    message: "We're interested in sponsoring financial technology events. Please provide information about upcoming fintech conferences in the UAE."
  },
  {
    name: "Fahad Al Qassimi",
    email: "fahad@etisalat.ae",
    phone: "+971 56 567 8901",
    company: "Etisalat",
    title: "Sponsorship Coordinator",
    budget: 40000,
    message: "We're looking for opportunities to showcase our 5G technology at tech events across the UAE. Please send information about technology expos and conferences."
  }
];

export const eventOrganizers: EventOrganizer[] = [
  {
    name: "Omar Al Falasi",
    email: "omar@dubaiexpo.ae",
    phone: "+971 55 678 9012",
    company: "Dubai Expo Events",
    eventName: "Dubai Tech Summit 2025",
    title: "Event Director",
    sponsorshipType: "Tech Showcase",
    description: "A major technology conference bringing together industry leaders, startups, and investors. We're looking for sponsors in various categories."
  },
  {
    name: "Aisha Al Zaabi",
    email: "aisha@abudhabi.events",
    phone: "+971 50 789 0123",
    company: "Abu Dhabi Events Authority",
    eventName: "Abu Dhabi Finance Forum",
    title: "Head of Events",
    sponsorshipType: "Stage Branding",
    description: "Annual finance forum hosting global banking leaders and fintech innovators. Looking for financial institution sponsors."
  },
  {
    name: "Daniel Rodriguez",
    email: "daniel@gulf.festivals",
    phone: "+971 54 890 1234",
    company: "Gulf Festivals",
    eventName: "Middle East Music Festival",
    title: "Partnerships Manager",
    sponsorshipType: "Entertainment",
    description: "The region's largest music festival attracting over 50,000 attendees. Multiple sponsorship opportunities available."
  },
  {
    name: "Layla Al Shamsi",
    email: "layla@sharjah.expo",
    phone: "+971 52 901 2345",
    company: "Sharjah Expo Center",
    eventName: "International Book Fair",
    title: "Director",
    sponsorshipType: "Cultural Event",
    description: "One of the world's largest book fairs with visitors from over 80 countries. Looking for educational and cultural sponsors."
  },
  {
    name: "Thomas Chen",
    email: "thomas@uaesportsconcil.org",
    phone: "+971 56 012 3456",
    company: "UAE Sports Council",
    eventName: "Dubai Marathon 2025",
    title: "Sponsorship Manager",
    sponsorshipType: "Sports",
    description: "Premier running event attracting elite and amateur runners from around the world. Multiple tiered sponsorship packages available."
  }
];
