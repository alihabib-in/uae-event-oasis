
import { createContext, useContext } from 'react';
import { Message, UserType } from './types';

interface ChatbotContextType {
  open: boolean;
  toggleChatbot: () => void;
  userType: UserType;
  setUserType: (type: UserType) => void;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id'>) => void;
}

export const ChatbotContext = createContext<ChatbotContextType>({
  open: false,
  toggleChatbot: () => {},
  userType: 'unknown',
  setUserType: () => {},
  messages: [],
  addMessage: () => {},
});

export const useChatbot = () => useContext(ChatbotContext);
