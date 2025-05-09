
import { useState, ReactNode } from 'react';
import { ChatbotContext } from './useChatbotContext';
import { Chatbot } from './Chatbot';
import { Message, UserType } from './types';
import { processBrandResponse } from './utils/brandResponses';
import { processEventOrganizerResponse } from './utils/organizerResponses';
import { detectUserType } from './utils/userTypeDetection';

interface ChatbotProviderProps {
  children: ReactNode;
}

const ChatbotProvider = ({ children }: ChatbotProviderProps) => {
  const [open, setOpen] = useState(false);
  const [userType, setUserType] = useState<UserType>('unknown');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your sponsorby assistant. Are you looking to sponsor an event or find sponsors for your event?",
      sender: 'bot',
      timestamp: Date.now(),
    },
  ]);

  const toggleChatbot = () => setOpen(prev => !prev);
  
  const addMessage = ({ content, sender, timestamp }: Omit<Message, 'id'>) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp,
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    if (sender === 'user') {
      processBotResponse(content);
    }
  };
  
  const processBotResponse = (userMessage: string) => {
    // Determine user type based on message content
    if (userType === 'unknown') {
      const typeDetected = detectUserType(userMessage, setUserType, addMessage);
      if (typeDetected) return;
    }
    
    // Handle responses based on identified user type
    if (userType === 'brand') {
      processBrandResponse(userMessage, addMessage);
    } else if (userType === 'event_organizer') {
      processEventOrganizerResponse(userMessage, addMessage);
    } else {
      // Still trying to determine user type
      setTimeout(() => {
        addMessage({
          content: "I'd like to help you better. Could you tell me if you're looking to sponsor events or find sponsors for your event?",
          sender: 'bot',
          timestamp: Date.now(),
        });
      }, 500);
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

export { useChatbot } from './useChatbotContext';
export default ChatbotProvider;
