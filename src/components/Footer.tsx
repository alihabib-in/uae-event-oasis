
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">
                UAE<span className="text-gold">Sponsor</span>
              </span>
            </Link>
            <p className="mt-4 text-gray-500 text-sm">
              Connecting brands with event organizers in the UAE for impactful sponsorships.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">For Brands</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/events" className="text-gray-500 hover:text-primary">
                  Find Events
                </Link>
              </li>
              <li>
                <Link to="/how-to-bid" className="text-gray-500 hover:text-primary">
                  How to Bid
                </Link>
              </li>
              <li>
                <Link to="/brand-success-stories" className="text-gray-500 hover:text-primary">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">For Organizers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/post-event" className="text-gray-500 hover:text-primary">
                  Post an Event
                </Link>
              </li>
              <li>
                <Link to="/organizer-guide" className="text-gray-500 hover:text-primary">
                  Organizer Guide
                </Link>
              </li>
              <li>
                <Link to="/organizer-success-stories" className="text-gray-500 hover:text-primary">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-500 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-500 hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-500 hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-500 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} UAESponsor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
