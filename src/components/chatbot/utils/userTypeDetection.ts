
import { Message, UserType } from '../types';

export const detectUserType = (
  userMessage: string,
  setUserType: (type: UserType) => void,
  addMessage: (message: Omit<Message, 'id'>) => void
): boolean => {
  const lowerCaseMessage = userMessage.toLowerCase();
  
  if (
    lowerCaseMessage.includes('sponsor') || 
    lowerCaseMessage.includes('brand') || 
    lowerCaseMessage.includes('advertise') ||
    lowerCaseMessage.includes('promote') ||
    lowerCaseMessage.includes('company')
  ) {
    setUserType('brand');
    setTimeout(() => {
      addMessage({
        content: "Great! I understand you're representing a brand looking to sponsor events. What type of events are you interested in sponsoring?",
        sender: 'bot',
        timestamp: Date.now(),
      });
    }, 500);
    return true;
  } else if (
    lowerCaseMessage.includes('event') || 
    lowerCaseMessage.includes('organiz') || 
    lowerCaseMessage.includes('organis') ||
    lowerCaseMessage.includes('host') ||
    lowerCaseMessage.includes('conference') ||
    lowerCaseMessage.includes('finding sponsors')
  ) {
    setUserType('event_organizer');
    setTimeout(() => {
      addMessage({
        content: "Excellent! I understand you're organizing an event and looking for sponsors. Could you tell me a bit more about your event?",
        sender: 'bot',
        timestamp: Date.now(),
      });
    }, 500);
    return true;
  }
  
  return false;
};
