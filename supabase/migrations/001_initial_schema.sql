-- ============================================================
-- VintedPro CRM — Schéma Supabase complet
-- Migration: 001_initial_schema
-- ============================================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- pour la recherche full-text

-- ─── ENUM TYPES ──────────────────────────────────────────────────────────────

CREATE TYPE product_status AS ENUM (
  'TO_CLEAN',
  'TO_PHOTO',
  'DRAFT',
  'ONLINE',
  'SOLD',
  'RETURNED',
  'LOST'
);

CREATE TYPE order_status AS ENUM (
  'TO_PREPARE',
  'SHIPPED',
  'IN_TRANSIT',
  'DELIVERED',
  'PAID'
);

CREATE TYPE expense_type AS ENUM (
  'PACKAGING',
  'LABEL',
  'SHIPPING_SUPPLIES',
  'PHOTOGRAPHY',
  'STORAGE',
  'PLATFORM_FEES',
  'OTHER'
);

-- ─── TABLE: profiles (lié à auth.users de Supabase) ─────────────────────────

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  email       TEXT UNIQUE,
  avatar_url  TEXT,
  plan        TEXT DEFAULT 'FREE' CHECK (plan IN ('FREE', 'PRO', 'BUSINESS')),
  vinted_username TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── TABLE: products ─────────────────────────────────────────────────────────

CREATE TABLE products (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Identification
  sku               TEXT NOT NULL,
  UNIQUE(user_id, sku),

  -- Caractéristiques article
  brand             TEXT,
  model             TEXT,
  size              TEXT,
  color             TEXT,
  condition         TEXT,
  material          TEXT,
  description       TEXT,           -- Description générée par IA ou manuelle
  description_ai    BOOLEAN DEFAULT FALSE,

  -- Sourcing
  sourcing_location TEXT,
  purchase_date     DATE,

  -- Prix
  purchase_price    NUMERIC(10,2) DEFAULT 0,
  additional_fees   NUMERIC(10,2) DEFAULT 0, -- Frais lavage, réparation, etc.
  target_price      NUMERIC(10,2),
  min_price         NUMERIC(10,2),

  -- Stockage physique
  physical_location TEXT,

  -- Médias
  media_urls        TEXT[] DEFAULT '{}',
  thumbnail_url     TEXT,

  -- Statut
  status            product_status DEFAULT 'DRAFT',

  -- Vinted IDs (sync extension)
  vinted_item_id    TEXT UNIQUE,
  vinted_url        TEXT,

  -- Métriques calculées (dénormalisées pour performance)
  roi               NUMERIC(8,2),   -- % = (prix_vente - coût_total) / coût_total * 100
  net_margin        NUMERIC(10,2),  -- € = prix_vente - coût_total - frais_plateforme

  -- Timestamps
  listed_at         TIMESTAMPTZ,
  sold_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche et filtres fréquents
CREATE INDEX idx_products_user_id   ON products(user_id);
CREATE INDEX idx_products_status    ON products(user_id, status);
CREATE INDEX idx_products_sku       ON products(user_id, sku);
CREATE INDEX idx_products_brand     ON products(user_id, brand);
CREATE INDEX idx_products_search    ON products USING gin(to_tsvector('french', coalesce(brand,'') || ' ' || coalesce(model,'') || ' ' || coalesce(sku,'')));

-- ─── TABLE: customers ────────────────────────────────────────────────────────

CREATE TABLE customers (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  vinted_username  TEXT NOT NULL,
  vinted_user_id   TEXT,
  UNIQUE(user_id, vinted_username),

  -- Profil
  display_name     TEXT,
  avatar_url       TEXT,
  rating           NUMERIC(3,1),
  follower_count   INTEGER DEFAULT 0,

  -- CRM
  is_blacklisted   BOOLEAN DEFAULT FALSE,
  blacklist_reason TEXT,
  notes            TEXT,
  tags             TEXT[] DEFAULT '{}',

  -- Stats agrégées (mises à jour via trigger)
  total_orders     INTEGER DEFAULT 0,
  total_spent      NUMERIC(10,2) DEFAULT 0,
  last_order_at    TIMESTAMPTZ,

  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_user_id  ON customers(user_id);
CREATE INDEX idx_customers_username ON customers(user_id, vinted_username);

-- ─── TABLE: orders ───────────────────────────────────────────────────────────

CREATE TABLE orders (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id         UUID REFERENCES products(id) ON DELETE SET NULL,
  customer_id        UUID REFERENCES customers(id) ON DELETE SET NULL,

  -- Identifiants Vinted
  vinted_order_id    TEXT UNIQUE,

  -- Montants
  sale_price         NUMERIC(10,2) NOT NULL,
  platform_fee       NUMERIC(10,2) DEFAULT 0,   -- Commission Vinted ~5%
  shipping_cost      NUMERIC(10,2) DEFAULT 0,
  net_amount         NUMERIC(10,2),              -- = sale_price - platform_fee

  -- Statut
  status             order_status DEFAULT 'TO_PREPARE',

  -- Expédition
  shipping_provider  TEXT,
  shipping_label_url TEXT,
  tracking_number    TEXT,
  shipped_at         TIMESTAMPTZ,
  delivered_at       TIMESTAMPTZ,
  days_in_transit    INTEGER DEFAULT 0,

  -- Litige
  has_dispute        BOOLEAN DEFAULT FALSE,
  dispute_reason     TEXT,
  dispute_opened_at  TIMESTAMPTZ,

  -- Notes internes
  notes              TEXT,

  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id    ON orders(user_id);
CREATE INDEX idx_orders_status     ON orders(user_id, status);
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_customer   ON orders(customer_id);

-- ─── TABLE: consumable_expenses ──────────────────────────────────────────────

CREATE TABLE consumable_expenses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  type        expense_type NOT NULL,
  label       TEXT,           -- Description libre
  cost        NUMERIC(10,2) NOT NULL,
  quantity    INTEGER DEFAULT 1,
  total_cost  NUMERIC(10,2) GENERATED ALWAYS AS (cost * quantity) STORED,

  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  receipt_url TEXT,

  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_expenses_user_id ON consumable_expenses(user_id);
CREATE INDEX idx_expenses_date    ON consumable_expenses(user_id, date);

-- ─── TABLE: messages_templates ───────────────────────────────────────────────

CREATE TABLE message_templates (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  label      TEXT NOT NULL,
  content    TEXT NOT NULL,
  emoji      TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates par défaut pour tous les nouveaux utilisateurs
CREATE OR REPLACE FUNCTION create_default_templates()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO message_templates (user_id, label, emoji, content, is_default, sort_order) VALUES
    (NEW.id, 'Colis expédié', '📦', 'Bonjour ! Votre colis a bien été expédié. Vous recevrez votre numéro de suivi très prochainement. Bonne réception ! 😊', TRUE, 1),
    (NEW.id, 'Article disponible', '✅', 'Bonjour ! L''article est toujours disponible. N''hésitez pas si vous avez des questions !', TRUE, 2),
    (NEW.id, 'Offre acceptée', '🎉', 'Bonjour ! J''accepte votre offre avec plaisir. Je prépare votre colis dès que possible !', TRUE, 3),
    (NEW.id, 'Merci commande', '💙', 'Merci beaucoup pour votre achat ! J''espère que l''article vous plaira. N''hésitez pas à laisser un avis 😊', TRUE, 4),
    (NEW.id, 'Avis laissé', '⭐', 'Bonjour ! Je viens de vous laisser un avis positif. Merci pour cette belle transaction !', TRUE, 5);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_templates
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_default_templates();

-- ─── TRIGGERS: updated_at automatique ────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at   BEFORE UPDATE ON products   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_updated_at     BEFORE UPDATE ON orders     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_customers_updated_at  BEFORE UPDATE ON customers  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_profiles_updated_at   BEFORE UPDATE ON profiles   FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── TRIGGER: calcul automatique ROI & marge ─────────────────────────────────

CREATE OR REPLACE FUNCTION calc_product_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- ROI = (target_price - total_cost) / total_cost * 100
  IF NEW.purchase_price IS NOT NULL AND NEW.purchase_price > 0 AND NEW.target_price IS NOT NULL THEN
    NEW.roi := ROUND(
      ((NEW.target_price - NEW.purchase_price - COALESCE(NEW.additional_fees, 0)) /
       (NEW.purchase_price + COALESCE(NEW.additional_fees, 0))) * 100,
      2
    );
  END IF;
  -- Marge nette = target_price - achat - fees - commission Vinted (5%)
  IF NEW.target_price IS NOT NULL AND NEW.purchase_price IS NOT NULL THEN
    NEW.net_margin := ROUND(
      NEW.target_price
      - NEW.purchase_price
      - COALESCE(NEW.additional_fees, 0)
      - (NEW.target_price * 0.05),  -- 5% commission Vinted
      2
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_product_calc_metrics
  BEFORE INSERT OR UPDATE OF purchase_price, additional_fees, target_price
  ON products
  FOR EACH ROW EXECUTE FUNCTION calc_product_metrics();

-- ─── TRIGGER: màj stats client après commande ────────────────────────────────

CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE customers SET
    total_orders = (SELECT COUNT(*) FROM orders WHERE customer_id = NEW.customer_id AND user_id = NEW.user_id),
    total_spent  = (SELECT COALESCE(SUM(sale_price), 0) FROM orders WHERE customer_id = NEW.customer_id AND status = 'PAID'),
    last_order_at = NOW()
  WHERE id = NEW.customer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_update_customer
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW WHEN (NEW.customer_id IS NOT NULL)
  EXECUTE FUNCTION update_customer_stats();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
-- Chaque utilisateur ne voit que SES données

ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE products             ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders               ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumable_expenses  ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates    ENABLE ROW LEVEL SECURITY;

-- Profiles: lecture/écriture de son propre profil
CREATE POLICY "users_own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Products: CRUD sur ses propres produits
CREATE POLICY "users_own_products" ON products
  FOR ALL USING (auth.uid() = user_id);

-- Orders: CRUD sur ses propres commandes
CREATE POLICY "users_own_orders" ON orders
  FOR ALL USING (auth.uid() = user_id);

-- Customers: CRUD sur ses propres clients
CREATE POLICY "users_own_customers" ON customers
  FOR ALL USING (auth.uid() = user_id);

-- Expenses: CRUD sur ses propres dépenses
CREATE POLICY "users_own_expenses" ON consumable_expenses
  FOR ALL USING (auth.uid() = user_id);

-- Templates: lecture/écriture de ses propres templates
CREATE POLICY "users_own_templates" ON message_templates
  FOR ALL USING (auth.uid() = user_id);

-- ─── VUES ANALYTIQUES ────────────────────────────────────────────────────────

-- Vue: résumé mensuel des ventes
CREATE VIEW v_monthly_sales AS
SELECT
  o.user_id,
  DATE_TRUNC('month', o.created_at) AS month,
  COUNT(*)                           AS total_orders,
  SUM(o.sale_price)                  AS total_revenue,
  SUM(o.net_amount)                  AS total_net,
  AVG(p.roi)                         AS avg_roi,
  AVG(o.days_in_transit)             AS avg_transit_days
FROM orders o
LEFT JOIN products p ON p.id = o.product_id
WHERE o.status = 'PAID'
GROUP BY o.user_id, DATE_TRUNC('month', o.created_at);

-- Vue: articles les plus rentables par marque
CREATE VIEW v_brand_performance AS
SELECT
  p.user_id,
  p.brand,
  COUNT(*)              AS total_items,
  COUNT(o.id)           AS sold_items,
  AVG(p.roi)            AS avg_roi,
  SUM(o.net_amount)     AS total_margin,
  ROUND(COUNT(o.id)::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1) AS conversion_rate
FROM products p
LEFT JOIN orders o ON o.product_id = p.id AND o.status = 'PAID'
GROUP BY p.user_id, p.brand;

-- ─── DONNÉES DE TEST (optionnel, commenter en prod) ──────────────────────────
-- Les données de test sont insérées via les seeds Supabase
-- Voir: supabase/seed.sql
