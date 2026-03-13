// ─── src/types/database.ts ───────────────────────────────────────────────────
// Types TypeScript générés depuis le schéma Supabase
// (En production, générer avec: npx supabase gen types typescript --local)

export type ProductStatus = 'TO_CLEAN' | 'TO_PHOTO' | 'DRAFT' | 'ONLINE' | 'SOLD' | 'RETURNED' | 'LOST'
export type OrderStatus   = 'TO_PREPARE' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'PAID'
export type ExpenseType   = 'PACKAGING' | 'LABEL' | 'SHIPPING_SUPPLIES' | 'PHOTOGRAPHY' | 'STORAGE' | 'PLATFORM_FEES' | 'OTHER'
export type Plan          = 'FREE' | 'PRO' | 'BUSINESS'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'roi' | 'net_margin' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'user_id' | 'created_at'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Order, 'id' | 'user_id' | 'created_at'>>
      }
      customers: {
        Row: Customer
        Insert: Omit<Customer, 'id' | 'total_orders' | 'total_spent' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Customer, 'id' | 'user_id' | 'created_at'>>
      }
      consumable_expenses: {
        Row: ConsumableExpense
        Insert: Omit<ConsumableExpense, 'id' | 'total_cost' | 'created_at'>
        Update: Partial<Omit<ConsumableExpense, 'id' | 'user_id' | 'created_at'>>
      }
      message_templates: {
        Row: MessageTemplate
        Insert: Omit<MessageTemplate, 'id' | 'created_at'>
        Update: Partial<Omit<MessageTemplate, 'id' | 'user_id' | 'created_at'>>
      }
    }
    Views: {
      v_monthly_sales:    { Row: MonthlySales }
      v_brand_performance:{ Row: BrandPerformance }
    }
  }
}

// ─── ENTITY TYPES ─────────────────────────────────────────────────────────────

export interface Profile {
  id:              string
  full_name:       string | null
  email:           string | null
  avatar_url:      string | null
  plan:            Plan
  vinted_username: string | null
  created_at:      string
  updated_at:      string
}

export interface Product {
  id:                string
  user_id:           string
  sku:               string
  brand:             string | null
  model:             string | null
  size:              string | null
  color:             string | null
  condition:         string | null
  material:          string | null
  description:       string | null
  description_ai:    boolean
  sourcing_location: string | null
  purchase_date:     string | null
  purchase_price:    number
  additional_fees:   number
  target_price:      number | null
  min_price:         number | null
  physical_location: string | null
  media_urls:        string[]
  thumbnail_url:     string | null
  status:            ProductStatus
  vinted_item_id:    string | null
  vinted_url:        string | null
  roi:               number | null
  net_margin:        number | null
  listed_at:         string | null
  sold_at:           string | null
  created_at:        string
  updated_at:        string
}

export interface Order {
  id:                string
  user_id:           string
  product_id:        string | null
  customer_id:       string | null
  vinted_order_id:   string | null
  sale_price:        number
  platform_fee:      number
  shipping_cost:     number
  net_amount:        number | null
  status:            OrderStatus
  shipping_provider: string | null
  shipping_label_url:string | null
  tracking_number:   string | null
  shipped_at:        string | null
  delivered_at:      string | null
  days_in_transit:   number
  has_dispute:       boolean
  dispute_reason:    string | null
  dispute_opened_at: string | null
  notes:             string | null
  created_at:        string
  updated_at:        string
  // Relations (joins)
  product?:  Product
  customer?: Customer
}

export interface Customer {
  id:               string
  user_id:          string
  vinted_username:  string
  vinted_user_id:   string | null
  display_name:     string | null
  avatar_url:       string | null
  rating:           number | null
  follower_count:   number
  is_blacklisted:   boolean
  blacklist_reason: string | null
  notes:            string | null
  tags:             string[]
  total_orders:     number
  total_spent:      number
  last_order_at:    string | null
  created_at:       string
  updated_at:       string
}

export interface ConsumableExpense {
  id:          string
  user_id:     string
  type:        ExpenseType
  label:       string | null
  cost:        number
  quantity:    number
  total_cost:  number  // computed
  date:        string
  receipt_url: string | null
  created_at:  string
}

export interface MessageTemplate {
  id:         string
  user_id:    string
  label:      string
  content:    string
  emoji:      string | null
  is_default: boolean
  sort_order: number
  created_at: string
}

// ─── ANALYTICS VIEWS ──────────────────────────────────────────────────────────

export interface MonthlySales {
  user_id:           string
  month:             string
  total_orders:      number
  total_revenue:     number
  total_net:         number
  avg_roi:           number | null
  avg_transit_days:  number | null
}

export interface BrandPerformance {
  user_id:         string
  brand:           string | null
  total_items:     number
  sold_items:      number
  avg_roi:         number | null
  total_margin:    number | null
  conversion_rate: number | null
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export type WithRelations<T, R extends Record<string, unknown>> = T & R

// Product avec commande liée
export type ProductWithOrder = WithRelations<Product, { order?: Order }>

// Order enrichie
export type OrderWithDetails = WithRelations<Order, {
  product:  Product | null
  customer: Customer | null
}>
