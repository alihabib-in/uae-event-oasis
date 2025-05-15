
export interface EventSpace {
  id: string;
  name: string;
  location: string;
  capacity: number;
  amenities: string[];
  description: string | null;
  base_price: number;
  image_url: string | null;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface SpaceRequest {
  id: string;
  requester_name: string;
  company_name: string | null;
  email: string;
  phone: string;
  space_type: string;
  event_type: string;
  preferred_date: string;
  end_date: string;
  capacity: number;
  additional_requirements: string | null;
  status: string;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}
