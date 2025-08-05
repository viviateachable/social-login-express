export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          city: string
          created_at: string
          id: string
          is_default: boolean | null
          name: string
          phone: string | null
          postal_code: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          city: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          name: string
          phone?: string | null
          postal_code: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          city?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string
          phone?: string | null
          postal_code?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_value: number
          end_date: string
          id: string
          is_special: boolean | null
          max_discount_amount: number | null
          min_amount: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["coupon_status"] | null
          title: string
          type: Database["public"]["Enums"]["coupon_type"]
          updated_at: string
          usage_limit: number | null
          used_count: number | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_value: number
          end_date: string
          id?: string
          is_special?: boolean | null
          max_discount_amount?: number | null
          min_amount?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["coupon_status"] | null
          title: string
          type: Database["public"]["Enums"]["coupon_type"]
          updated_at?: string
          usage_limit?: number | null
          used_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_value?: number
          end_date?: string
          id?: string
          is_special?: boolean | null
          max_discount_amount?: number | null
          min_amount?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["coupon_status"] | null
          title?: string
          type?: Database["public"]["Enums"]["coupon_type"]
          updated_at?: string
          usage_limit?: number | null
          used_count?: number | null
        }
        Relationships: []
      }
      login_logs: {
        Row: {
          device_info: Json | null
          id: string
          ip_address: unknown | null
          location: string | null
          login_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          location?: string | null
          login_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          location?: string | null
          login_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          id: string
          items: Json
          newebpay_trade_no: string | null
          order_number: string
          payment_method: string | null
          shipping_info: Json
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          items: Json
          newebpay_trade_no?: string | null
          order_number: string
          payment_method?: string | null
          shipping_info: Json
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          items?: Json
          newebpay_trade_no?: string | null
          order_number?: string
          payment_method?: string | null
          shipping_info?: Json
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          auth_bank: string | null
          created_at: string
          id: string
          merchant_order_no: string
          newebpay_trade_no: string | null
          order_id: string
          payment_type: string | null
          response_code: string | null
          response_data: Json | null
          response_msg: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          auth_bank?: string | null
          created_at?: string
          id?: string
          merchant_order_no: string
          newebpay_trade_no?: string | null
          order_id: string
          payment_type?: string | null
          response_code?: string | null
          response_data?: Json | null
          response_msg?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          auth_bank?: string | null
          created_at?: string
          id?: string
          merchant_order_no?: string
          newebpay_trade_no?: string | null
          order_id?: string
          payment_type?: string | null
          response_code?: string | null
          response_data?: Json | null
          response_msg?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          provider: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          provider?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          provider?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_coupons: {
        Row: {
          coupon_id: string
          created_at: string
          id: string
          is_used: boolean | null
          order_id: string | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string
          id?: string
          is_used?: boolean | null
          order_id?: string | null
          used_at?: string | null
          user_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string
          id?: string
          is_used?: boolean | null
          order_id?: string | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_coupons_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_test_coupons: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      coupon_status: "active" | "inactive" | "expired"
      coupon_type: "percentage" | "fixed"
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
      coupon_status: ["active", "inactive", "expired"],
      coupon_type: ["percentage", "fixed"],
    },
  },
} as const
