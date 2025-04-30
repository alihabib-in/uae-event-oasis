
import { Check } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Create Your Profile",
      description: "Sign up as a brand or event organizer and complete your profile with relevant details.",
    },
    {
      id: 2,
      title: "Post or Browse Events",
      description: "Event organizers post opportunities while brands browse and filter events.",
    },
    {
      id: 3,
      title: "Submit or Review Bids",
      description: "Brands submit competitive bids, and organizers review proposals from interested sponsors.",
    },
    {
      id: 4,
      title: "Connect & Finalize",
      description: "Once matched, communicate directly to finalize sponsorship details and agreements.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Our streamlined process makes it easy for brands and event organizers to connect and create successful sponsorships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 relative"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="font-bold text-primary">{step.id}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white shadow-sm rounded-lg border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Safe & Secure Platform</h3>
              <p className="text-gray-600 mb-6">
                Our platform ensures a seamless and secure experience for all users, with transparent processes and fair commission rates.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Verified event organizers and brands</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Secure bidding and payment system</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Transparent 5% commission fees</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <span>Dedicated support team</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <img
                className="rounded-lg object-cover w-full h-64 md:h-80"
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                alt="Platform security illustration"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
