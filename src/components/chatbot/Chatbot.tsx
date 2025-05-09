
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, SendHorizontal } from 'lucide-react';
import { useChatbot } from './ChatbotProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

export const Chatbot = () => {
  const { open, toggleChatbot, messages, addMessage } = useChatbot();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    addMessage({
      content: input.trim(),
      sender: 'user',
    });
    
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (!open) {
    return (
      <Button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg flex items-center justify-center p-0 z-50"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }
  
  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-96 bg-background border rounded-xl shadow-xl flex flex-col z-50 overflow-hidden animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-primary text-primary-foreground">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary-foreground text-primary text-xs">AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm">sponsorby Assistant</h3>
            <p className="text-xs opacity-80">How can I help you today?</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleChatbot}
          className="h-8 w-8 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] px-4 py-2 rounded-xl ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                  : 'bg-muted rounded-tl-none'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 text-right mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="border-t p-3">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim()}
            size="icon"
            className="h-10 w-10"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
