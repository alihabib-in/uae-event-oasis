
import { Message } from '../types';

export const processBrandResponse = (
  userMessage: string, 
  addMessage: (message: Omit<Message, 'id'>) => void
) => {
  const lowerCaseMessage = userMessage.toLowerCase();
  
  // Check for budget related questions
  if (
    lowerCaseMessage.includes('budget') || 
    lowerCaseMessage.includes('cost') || 
    lowerCaseMessage.includes('price') || 
    lowerCaseMessage.includes('invest') || 
    lowerCaseMessage.includes('expensive')
  ) {
    setTimeout(() => {
      addMessage({
        content: "Sponsorship packages on our platform range from AED 5,000 for basic visibility to AED 50,000+ for premium packages. Would you like to see our different sponsorship tiers?",
        sender: 'bot',
        timestamp: Date.now(),
      });
    }, 800);
  }
  // Check for event type inquiries
  else if (
    lowerCaseMessage.includes('type') ||
    lowerCaseMessage.includes('kind') ||
    lowerCaseMessage.includes('category') ||
    lowerCaseMessage.includes('industry')
  ) {
    setTimeout(() => {
      addMessage({
        content: "We have a wide variety of events across different industries, including tech conferences, cultural festivals, business forums, sports events, and more. What industry are you particularly interested in?",
        sender: 'bot',
        timestamp: Date.now(),
      });
    }, 800);
  }
  // Check for benefits inquiries
  else if (
    lowerCaseMessage.includes('benefit') ||
    lowerCaseMessage.includes('get') ||
    lowerCaseMessage.includes('value') ||
    lowerCaseMessage.includes('worth') ||
    lowerCaseMessage.includes('roi')
  ) {
    setTimeout(() => {
      addMessage({
        content: "Our sponsors typically enjoy benefits like brand visibility, lead generation, audience engagement, and networking opportunities. Premium sponsors also receive speaking slots, dedicated booths, and VIP access. What aspects are most important for your brand?",
        sender: 'bot',
        timestamp: Date.now(),
      });
    }, 800);
  }
  // Default response
  else {
    setTimeout(() => {
      addMessage({
        content: "Would you like to browse our upcoming events or shall I help you find events that match your specific requirements?",
        sender: 'bot',
        timestamp: Date.now(),
      });
    }, 800);
  }
};
