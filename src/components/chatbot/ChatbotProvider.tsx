
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Chatbot } from './Chatbot';

type UserType = 'unknown' | 'brand' | 'event_organizer';

interface ChatbotContextType {
  open: boolean;
  toggleChatbot: () => void;
  userType: UserType;
  setUserType: (type: UserType) => void;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id'>) => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

export const ChatbotContext = createContext<ChatbotContextType>({
  open: false,
  toggleChatbot: () => {},
  userType: 'unknown',
  setUserType: () => {},
  messages: [],
  addMessage: () => {},
});

interface ChatbotProviderProps {
  children: ReactNode;
}

const ChatbotProvider = ({ children }: ChatbotProviderProps) => {
  const [open, setOpen] = useState(false);
  const [userType, setUserType] = useState<UserType>('unknown');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hi there! I'm your sponsorby assistant. Are you looking to sponsor an event or find sponsors for your event?',
      sender: 'bot',
      timestamp: Date.now(),
    },
  ]);

  const toggleChatbot = () => setOpen(prev => !prev);
  
  const addMessage = ({ content, sender }: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    if (sender === 'user') {
      processBotResponse(content);
    }
  };
  
  const processBotResponse = (userMessage: string) => {
    // Determine user type based on message content
    if (userType === 'unknown') {
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
            content: 'Great! I understand you're representing a brand looking to sponsor events. What type of events are you interested in sponsoring?',
            sender: 'bot',
          });
        }, 500);
        return;
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
            content: 'Excellent! I understand you're organizing an event and looking for sponsors. Could you tell me a bit more about your event?',
            sender: 'bot',
          });
        }, 500);
        return;
      }
    }
    
    // Handle responses based on identified user type
    if (userType === 'brand') {
      processBrandResponse(userMessage);
    } else if (userType === 'event_organizer') {
      processEventOrganizerResponse(userMessage);
    } else {
      // Still trying to determine user type
      setTimeout(() => {
        addMessage({
          content: 'I'd like to help you better. Could you tell me if you're looking to sponsor events or find sponsors for your event?',
          sender: 'bot',
        });
      }, 500);
    }
  };
  
  const processBrandResponse = (userMessage: string) => {
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
          content: 'Sponsorship packages on our platform range from AED 5,000 for basic visibility to AED 50,000+ for premium packages. Would you like to see our different sponsorship tiers?',
          sender: 'bot',
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
          content: 'We have a wide variety of events across different industries, including tech conferences, cultural festivals, business forums, sports events, and more. What industry are you particularly interested in?',
          sender: 'bot',
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
          content: 'Our sponsors typically enjoy benefits like brand visibility, lead generation, audience engagement, and networking opportunities. Premium sponsors also receive speaking slots, dedicated booths, and VIP access. What aspects are most important for your brand?',
          sender: 'bot',
        });
      }, 800);
    }
    // Default response
    else {
      setTimeout(() => {
        addMessage({
          content: 'Would you like to browse our upcoming events or shall I help you find events that match your specific requirements?',
          sender: 'bot',
        });
      }, 800);
    }
  };
  
  const processEventOrganizerResponse = (userMessage: string) => {
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
          content: 'You can list your event by clicking on the "Post Your Event" button in the navigation bar. You'll need to provide details about your event, available sponsorship opportunities, and your contact information.',
          sender: 'bot',
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
          content: 'We charge a 5% commission fee only when you successfully match with sponsors. There are no upfront costs to list your event on our platform.',
          sender: 'bot',
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
          content: 'The timeline varies depending on your event and the types of sponsors you're looking for. Typically, we recommend listing your event at least 3-6 months before the date to give sponsors enough time to plan. Many sponsors start seeing your listing within 24 hours of posting.',
          sender: 'bot',
        });
      }, 800);
    }
    // Default response
    else {
      setTimeout(() => {
        addMessage({
          content: 'Would you like to post your event now or learn more about our sponsorship packages to help you structure your offerings?',
          sender: 'bot',
        });
      }, 800);
    }
  };
  
  return (
    <ChatbotContext.Provider
      value={{
        open,
        toggleChatbot,
        userType,
        setUserType,
        messages,
        addMessage,
      }}
    >
      {children}
      <Chatbot />
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => useContext(ChatbotContext);

export default ChatbotProvider;
