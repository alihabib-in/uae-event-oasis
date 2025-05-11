export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string
          id: string
          notification_emails: string[]
          require_otp_verification: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notification_emails?: string[]
          require_otp_verification?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_emails?: string[]
          require_otp_verification?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      bids: {
        Row: {
          admin_response: string | null
          bid_amount: number
          brand_name: string
          business_nature: string
          company_address: string
          contact_name: string
          created_at: string
          email: string
          emirate: string
          event_id: string | null
          id: string
          message: string | null
          phone: string
          phone_verified: boolean | null
          status: string | null
          user_id: string | null
          verification_code: string | null
        }
        Insert: {
          admin_response?: string | null
          bid_amount: number
          brand_name: string
          business_nature: string
          company_address: string
          contact_name: string
          created_at?: string
          email: string
          emirate: string
          event_id?: string | null
          id?: string
          message?: string | null
          phone: string
          phone_verified?: boolean | null
          status?: string | null
          user_id?: string | null
          verification_code?: string | null
        }
        Update: {
          admin_response?: string | null
          bid_amount?: number
          brand_name?: string
          business_nature?: string
          company_address?: string
          contact_name?: string
          created_at?: string
          email?: string
          emirate?: string
          event_id?: string | null
          id?: string
          message?: string | null
          phone?: string
          phone_verified?: boolean | null
          status?: string | null
          user_id?: string | null
          verification_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bids_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          attendees: number
          category: string
          created_at: string
          date: string
          description: string | null
          end_date: string | null
          id: string
          image: string | null
          is_public: boolean
          location: string
          max_bid: number
          min_bid: number
          organizer_logo: string | null
          organizer_name: string
          phone: string
          phone_verified: boolean | null
          sponsorship_details: string[] | null
          status: string | null
          tags: string[] | null
          title: string
          user_id: string | null
          venue: string
          verification_code: string | null
        }
        Insert: {
          attendees: number
          category: string
          created_at?: string
          date: string
          description?: string | null
          end_date?: string | null
          id?: string
          image?: string | null
          is_public?: boolean
          location: string
          max_bid: number
          min_bid: number
          organizer_logo?: string | null
          organizer_name: string
          phone: string
          phone_verified?: boolean | null
          sponsorship_details?: string[] | null
          status?: string | null
          tags?: string[] | null
          title: string
          user_id?: string | null
          venue: string
          verification_code?: string | null
        }
        Update: {
          attendees?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image?: string | null
          is_public?: boolean
          location?: string
          max_bid?: number
          min_bid?: number
          organizer_logo?: string | null
          organizer_name?: string
          phone?: string
          phone_verified?: boolean | null
          sponsorship_details?: string[] | null
          status?: string | null
          tags?: string[] | null
          title?: string
          user_id?: string | null
          venue?: string
          verification_code?: string | null
        }
        Relationships: []
      }
      sponsorship_packages: {
        Row: {
          created_at: string
          description: string | null
          event_id: string
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id: string
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string
          id?: string
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sponsorship_packages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_verification_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
