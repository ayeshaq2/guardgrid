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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      fire_incidents: {
        Row: {
          containment_percent: number | null
          created_at: string
          description: string | null
          id: string
          last_updated: string
          latitude: number
          location: string
          longitude: number
          name: string
          personnel_count: number | null
          severity: Database["public"]["Enums"]["fire_severity"]
          size_acres: number | null
          start_date: string
          status: Database["public"]["Enums"]["fire_status"]
        }
        Insert: {
          containment_percent?: number | null
          created_at?: string
          description?: string | null
          id?: string
          last_updated?: string
          latitude: number
          location: string
          longitude: number
          name: string
          personnel_count?: number | null
          severity?: Database["public"]["Enums"]["fire_severity"]
          size_acres?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["fire_status"]
        }
        Update: {
          containment_percent?: number | null
          created_at?: string
          description?: string | null
          id?: string
          last_updated?: string
          latitude?: number
          location?: string
          longitude?: number
          name?: string
          personnel_count?: number | null
          severity?: Database["public"]["Enums"]["fire_severity"]
          size_acres?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["fire_status"]
        }
        Relationships: []
      }
      fire_reports: {
        Row: {
          ai_analysis: Json | null
          created_at: string
          description: string | null
          has_smell: boolean | null
          has_visible_flames: boolean | null
          has_visible_smoke: boolean | null
          id: string
          latitude: number
          longitude: number
          photo_urls: string[] | null
          report_status: Database["public"]["Enums"]["report_status"]
          updated_at: string
          user_id: string | null
          verification_count: number | null
          video_urls: string[] | null
        }
        Insert: {
          ai_analysis?: Json | null
          created_at?: string
          description?: string | null
          has_smell?: boolean | null
          has_visible_flames?: boolean | null
          has_visible_smoke?: boolean | null
          id?: string
          latitude: number
          longitude: number
          photo_urls?: string[] | null
          report_status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
          user_id?: string | null
          verification_count?: number | null
          video_urls?: string[] | null
        }
        Update: {
          ai_analysis?: Json | null
          created_at?: string
          description?: string | null
          has_smell?: boolean | null
          has_visible_flames?: boolean | null
          has_visible_smoke?: boolean | null
          id?: string
          latitude?: number
          longitude?: number
          photo_urls?: string[] | null
          report_status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
          user_id?: string | null
          verification_count?: number | null
          video_urls?: string[] | null
        }
        Relationships: []
      }
      fire_sensors: {
        Row: {
          confidence_level: number | null
          created_at: string
          detection_time: string
          id: string
          is_active: boolean | null
          last_updated: string
          latitude: number
          longitude: number
          metadata: Json | null
          name: string
          sensor_type: Database["public"]["Enums"]["sensor_type"]
          smoke_density: number | null
          temperature_celsius: number | null
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string
          detection_time: string
          id?: string
          is_active?: boolean | null
          last_updated?: string
          latitude: number
          longitude: number
          metadata?: Json | null
          name: string
          sensor_type: Database["public"]["Enums"]["sensor_type"]
          smoke_density?: number | null
          temperature_celsius?: number | null
        }
        Update: {
          confidence_level?: number | null
          created_at?: string
          detection_time?: string
          id?: string
          is_active?: boolean | null
          last_updated?: string
          latitude?: number
          longitude?: number
          metadata?: Json | null
          name?: string
          sensor_type?: Database["public"]["Enums"]["sensor_type"]
          smoke_density?: number | null
          temperature_celsius?: number | null
        }
        Relationships: []
      }
      historical_hotspots: {
        Row: {
          area_name: string | null
          created_at: string
          fire_count: number
          id: string
          last_fire_date: string | null
          latitude: number
          longitude: number
          metadata: Json | null
          risk_score: number | null
        }
        Insert: {
          area_name?: string | null
          created_at?: string
          fire_count?: number
          id?: string
          last_fire_date?: string | null
          latitude: number
          longitude: number
          metadata?: Json | null
          risk_score?: number | null
        }
        Update: {
          area_name?: string | null
          created_at?: string
          fire_count?: number
          id?: string
          last_fire_date?: string | null
          latitude?: number
          longitude?: number
          metadata?: Json | null
          risk_score?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      fire_severity: "critical" | "high" | "medium" | "low"
      fire_status: "active" | "contained" | "controlled" | "monitored"
      report_status: "pending" | "verified" | "false_positive" | "duplicate"
      sensor_type: "satellite" | "ground" | "aerial" | "weather_station"
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
      fire_severity: ["critical", "high", "medium", "low"],
      fire_status: ["active", "contained", "controlled", "monitored"],
      report_status: ["pending", "verified", "false_positive", "duplicate"],
      sensor_type: ["satellite", "ground", "aerial", "weather_station"],
    },
  },
} as const
