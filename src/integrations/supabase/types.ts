export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      brand_voice_profiles: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          keywords: string[] | null
          name: string
          sample_content: string | null
          style: string | null
          tone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          keywords?: string[] | null
          name: string
          sample_content?: string | null
          style?: string | null
          tone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          keywords?: string[] | null
          name?: string
          sample_content?: string | null
          style?: string | null
          tone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      comparison_actuals: {
        Row: {
          actual_winner: number | null
          comparison_id: string
          created_at: string
          id: string
          notes: string | null
          post_a_comments: number | null
          post_a_impressions: number | null
          post_a_likes: number | null
          post_a_shares: number | null
          post_a_url: string | null
          post_b_comments: number | null
          post_b_impressions: number | null
          post_b_likes: number | null
          post_b_shares: number | null
          post_b_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_winner?: number | null
          comparison_id: string
          created_at?: string
          id?: string
          notes?: string | null
          post_a_comments?: number | null
          post_a_impressions?: number | null
          post_a_likes?: number | null
          post_a_shares?: number | null
          post_a_url?: string | null
          post_b_comments?: number | null
          post_b_impressions?: number | null
          post_b_likes?: number | null
          post_b_shares?: number | null
          post_b_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_winner?: number | null
          comparison_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          post_a_comments?: number | null
          post_a_impressions?: number | null
          post_a_likes?: number | null
          post_a_shares?: number | null
          post_a_url?: string | null
          post_b_comments?: number | null
          post_b_impressions?: number | null
          post_b_likes?: number | null
          post_b_shares?: number | null
          post_b_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comparison_actuals_comparison_id_fkey"
            columns: ["comparison_id"]
            isOneToOne: true
            referencedRelation: "comparisons"
            referencedColumns: ["id"]
          },
        ]
      }
      comparisons: {
        Row: {
          created_at: string
          id: string
          metrics: Json | null
          post_a_id: string
          post_b_id: string
          suggestions: Json | null
          updated_at: string
          user_id: string
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metrics?: Json | null
          post_a_id: string
          post_b_id: string
          suggestions?: Json | null
          updated_at?: string
          user_id: string
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metrics?: Json | null
          post_a_id?: string
          post_b_id?: string
          suggestions?: Json | null
          updated_at?: string
          user_id?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comparisons_post_a_id_fkey"
            columns: ["post_a_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comparisons_post_b_id_fkey"
            columns: ["post_b_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comparisons_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          id: string
          message: string | null
          page: string | null
          rating: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          page?: string | null
          rating?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          page?: string | null
          rating?: number | null
          user_id?: string
        }
        Relationships: []
      }
      ip_usage_tracking: {
        Row: {
          comparisons_used: number
          created_at: string
          creates_used: number
          id: string
          ip_address: unknown
          updated_at: string
        }
        Insert: {
          comparisons_used?: number
          created_at?: string
          creates_used?: number
          id?: string
          ip_address: unknown
          updated_at?: string
        }
        Update: {
          comparisons_used?: number
          created_at?: string
          creates_used?: number
          id?: string
          ip_address?: unknown
          updated_at?: string
        }
        Relationships: []
      }
      post_analytics: {
        Row: {
          click_through_rate: number | null
          comments: number | null
          content: string
          created_at: string
          engagement_rate: number | null
          id: string
          impressions: number | null
          industry_benchmark_score: number | null
          likes: number | null
          post_id: string | null
          published_at: string | null
          shares: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          click_through_rate?: number | null
          comments?: number | null
          content: string
          created_at?: string
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          industry_benchmark_score?: number | null
          likes?: number | null
          post_id?: string | null
          published_at?: string | null
          shares?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          click_through_rate?: number | null
          comments?: number | null
          content?: string
          created_at?: string
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          industry_benchmark_score?: number | null
          likes?: number | null
          post_id?: string | null
          published_at?: string | null
          shares?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_analytics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          brand_voice_id: string | null
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          brand_voice_id?: string | null
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          brand_voice_id?: string | null
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_brand_voice_id_fkey"
            columns: ["brand_voice_id"]
            isOneToOne: false
            referencedRelation: "brand_voice_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          brand_voice_id: string | null
          content: string
          created_at: string
          id: string
          platform: string | null
          scheduled_for: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          brand_voice_id?: string | null
          content: string
          created_at?: string
          id?: string
          platform?: string | null
          scheduled_for: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          brand_voice_id?: string | null
          content?: string
          created_at?: string
          id?: string
          platform?: string | null
          scheduled_for?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_posts_brand_voice_id_fkey"
            columns: ["brand_voice_id"]
            isOneToOne: false
            referencedRelation: "brand_voice_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          feedback_shown_count: number | null
          id: string
          last_feedback_shown: string | null
          never_show_feedback: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_shown_count?: number | null
          id?: string
          last_feedback_shown?: string | null
          never_show_feedback?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_shown_count?: number | null
          id?: string
          last_feedback_shown?: string | null
          never_show_feedback?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
          usage_creates_count: number | null
          usage_reset_date: string | null
          usage_virality_checks_count: number | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          usage_creates_count?: number | null
          usage_reset_date?: string | null
          usage_virality_checks_count?: number | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
          usage_creates_count?: number | null
          usage_reset_date?: string | null
          usage_virality_checks_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_usage_limit: {
        Args: { limit_type: string; user_uuid: string }
        Returns: boolean
      }
      get_user_subscription_tier: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["subscription_tier"]
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      subscription_tier: "free" | "pro" | "team"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      subscription_tier: ["free", "pro", "team"],
    },
  },
} as const
