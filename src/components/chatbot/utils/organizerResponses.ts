
import { Message } from '../types';

export const processEventOrganizerResponse = (
  userMessage: string, 
  addMessage: (message: Omit<Message, 'id'>) => void
) => {
  const lowerCaseMessage = userMessage.toLowerCase();
  
  // Check for how-to-list questions
  if (
    lowerCaseMessage.includes('list') || 
    lowerCaseMessage.includes('add') || 
    lowerCaseMessage.includes('post') || 
    lowerCaseMessage.includes('publish') || 
    lowerCaseMessage.includes('create')
  ) {
    setTimeout(() => {
      addMessage({
        content: "You can list your event by clicking on the \"Post Your Event\" button in the navigation bar. You'll need to provide details about your event, available sponsorship opportunities, and your contact information.",
        sender: 'bot',
        timestamp: Date.now(),
      });
    }, 800);
  }
  // Check for commission/fee questions
  else if (
    lowerCaseMessage.includes('fee') ||
    lowerCaseMessage.includes('commission') ||
    lowerCaseMessage.includes('cost') ||
    lowerCaseMessage.includes('pay') ||
    lowerCaseMessage.includes('charge')
  ) {
    setTimeout(() => {
      addMessage({
        content: "We charge a 5% commission fee only when you successfully match with sponsors. There are no upfront costs to list your event on our platform.",
        sender: 'bot',
        timestamp: Date.now(),
      });
    }, 800);
  }
  // Check for timeline questions
  else if (
    lowerCaseMessage.includes('time') ||
    lowerCaseMessage.includes('long') ||
    lowerCaseMessage.includes('when') ||
    lowerCaseMessage.includes('soon') ||
    lowerCaseMessage.includes('process')
  ) {
    setTimeout(() => {
      addMessage({
        content: "The timeline varies depending on your event and the types of sponsors you're looking for. Typically, we recommend listing your event at least 3-6 months before the date to give sponsors enough time to plan. Many sponsors start seeing your listing within 24 hours of posting.",
        sender: 'bot',
        timestamp: Date.now(),
      });
    }, 800);
  }
  // Default response
  else {
    setTimeout(() => {
      addMessage({
        content: "Would you like to post your event now or learn more about our sponsorship packages to help you structure your offerings?",
        sender: 'bot',
        timestamp: Date.now(),
      });
    }, 800);
  }
};
