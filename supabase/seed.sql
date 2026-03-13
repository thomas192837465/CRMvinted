-- ─── supabase/seed.sql ────────────────────────────────────────────────────────
-- Données de test — à exécuter APRÈS la migration 001
-- Commande: supabase db reset (reset + migrations + seed)
-- OU: supabase db seed

-- IMPORTANT: Remplacer 'USER_ID_ICI' par un vrai UUID d'un utilisateur auth.users
-- En dev, créer un compte depuis /auth/login, puis copier l'UUID depuis la table auth.users

DO $$
DECLARE
  v_user_id UUID;
  v_customer1_id UUID;
  v_customer2_id UUID;
  v_product1_id UUID;
  v_product2_id UUID;
  v_product3_id UUID;
BEGIN
  -- Prendre le premier utilisateur disponible
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'Aucun utilisateur trouvé. Créez un compte avant de seeder.';
    RETURN;
  END IF;

  -- ─── CLIENTS ──────────────────────────────────────────────────────────────
  INSERT INTO customers (user_id, vinted_username, display_name, rating, notes, is_blacklisted)
  VALUES
    (v_user_id, 'marie_dupont92', 'Marie D.', 4.9, 'Cliente fidèle, très sympa', FALSE),
    (v_user_id, 'jean_martin75', 'Jean M.', 4.7, '', FALSE),
    (v_user_id, 'trouble_buyer_99', NULL, 2.1, '⚠️ Tentative d''arnaque. À bannir.', TRUE)
  RETURNING id INTO v_customer1_id;

  SELECT id INTO v_customer1_id FROM customers WHERE vinted_username = 'marie_dupont92' AND user_id = v_user_id;
  SELECT id INTO v_customer2_id FROM customers WHERE vinted_username = 'jean_martin75' AND user_id = v_user_id;

  -- ─── PRODUITS ─────────────────────────────────────────────────────────────
  INSERT INTO products (user_id, sku, brand, model, size, color, condition, purchase_price, additional_fees, target_price, min_price, physical_location, status, purchase_date)
  VALUES
    (v_user_id, 'NIK-0001', 'Nike', 'Air Max 90', '42', 'Blanc/Rouge', 'Très bon état', 45.00, 2.00, 89.00, 65.00, 'Étagère A1', 'ONLINE', '2024-01-15'),
    (v_user_id, 'LEV-0002', 'Levi''s', '501 Original', '32/32', 'Bleu délavé', 'Bon état', 22.00, 0.00, 48.00, 35.00, 'Boîte B3', 'DRAFT', '2024-01-18'),
    (v_user_id, 'ADI-0003', 'Adidas', 'Stan Smith', '40', 'Blanc/Vert', 'Neuf sans étiquette', 38.00, 0.00, 75.00, 58.00, 'Étagère A2', 'SOLD', '2024-01-10'),
    (v_user_id, 'ZAR-0004', 'Zara', 'Manteau laine', 'M', 'Camel', 'Bon état', 30.00, 3.00, 65.00, 45.00, 'Penderie C1', 'TO_PHOTO', '2024-01-20'),
    (v_user_id, 'VIN-0005', 'Vintage', 'Veste en jean', 'L', 'Bleu', 'État correct', 15.00, 5.00, 42.00, 28.00, 'Boîte B1', 'TO_CLEAN', '2024-01-22'),
    (v_user_id, 'PRL-0006', 'Polo Ralph Lauren', 'Polo classic fit', 'S', 'Navy', 'Très bon état', 18.00, 0.00, 45.00, 30.00, 'Boîte B2', 'ONLINE', '2024-01-12')
  RETURNING id INTO v_product1_id;

  SELECT id INTO v_product1_id FROM products WHERE sku = 'NIK-0001' AND user_id = v_user_id;
  SELECT id INTO v_product3_id FROM products WHERE sku = 'ADI-0003' AND user_id = v_user_id;

  -- ─── COMMANDES ────────────────────────────────────────────────────────────
  INSERT INTO orders (user_id, product_id, customer_id, sale_price, platform_fee, status, shipping_provider, tracking_number, days_in_transit)
  VALUES
    (v_user_id, v_product1_id,  v_customer1_id, 89.00, 4.45, 'TO_PREPARE', 'Mondial Relay', NULL, 0),
    (v_user_id, v_product3_id,  v_customer2_id, 75.00, 3.75, 'PAID',       'Colissimo', 'CL12345678FR', 3);

  -- ─── DÉPENSES ─────────────────────────────────────────────────────────────
  INSERT INTO consumable_expenses (user_id, type, label, cost, quantity, date)
  VALUES
    (v_user_id, 'PACKAGING',    'Boîtes carton A4',      0.45, 20, '2024-01-01'),
    (v_user_id, 'LABEL',        'Étiquettes thermiques', 0.05, 100, '2024-01-01'),
    (v_user_id, 'PHOTOGRAPHY',  'Fond photo blanc',      12.99, 1, '2024-01-05');

  RAISE NOTICE 'Seed OK pour user_id = %', v_user_id;
END;
$$;
