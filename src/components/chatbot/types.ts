
export type UserType = 'unknown' | 'brand' | 'event_organizer';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: number;
}
