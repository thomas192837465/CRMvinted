# VintedPro CRM — Guide de Déploiement Complet

## Prérequis

- Node.js 18+ (`node --version`)
- npm ou pnpm
- Compte [Supabase](https://supabase.com) (gratuit)
- Compte [Vercel](https://vercel.com) (gratuit)
- Optionnel : [Supabase CLI](https://supabase.com/docs/guides/cli) pour le dev local

---

## Étape 1 — Cloner et installer

```bash
# Cloner le projet
git clone <votre-repo> vintedpro
cd vintedpro

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.local.example .env.local
```

---

## Étape 2 — Créer le projet Supabase

1. Aller sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Cliquer **"New Project"**
3. Choisir un nom : `vintedpro-crm`, région : `West EU (Paris)`
4. Générer un mot de passe fort pour la DB

### Récupérer les clés API

Dans le dashboard Supabase > **Settings** > **API** :

```
URL             → NEXT_PUBLIC_SUPABASE_URL
anon / public   → NEXT_PUBLIC_SUPABASE_ANON_KEY
service_role    → SUPABASE_SERVICE_ROLE_KEY  (⚠️ ne jamais exposer côté client)
```

Renseigner ces valeurs dans `.env.local`.

---

## Étape 3 — Appliquer le schéma de base de données

### Option A : Via l'interface Supabase (recommandé pour débuter)

1. Aller dans **SQL Editor** de votre projet
2. Copier-coller le contenu de `supabase/migrations/001_initial_schema.sql`
3. Cliquer **"Run"**

### Option B : Via la CLI Supabase (dev local + prod)

```bash
# Installer la CLI
npm install -g supabase

# Login
supabase login

# Lier au projet
supabase link --project-ref VOTRE_PROJECT_REF

# Appliquer les migrations
supabase db push

# (Optionnel) Charger les données de test
supabase db reset  # reset + migrations + seed.sql
```

---

## Étape 4 — Configurer l'authentification Supabase

Dans **Authentication** > **URL Configuration** :

- **Site URL** : `http://localhost:3000` (dev) puis votre URL Vercel (prod)
- **Redirect URLs** : Ajouter `https://votre-app.vercel.app/auth/callback`

Dans **Authentication** > **Email Templates** : personnaliser si souhaité.

---

## Étape 5 — Lancer en développement

```bash
npm run dev
# → http://localhost:3000
```

1. Aller sur `http://localhost:3000/auth/login`
2. Créer un compte avec email + mot de passe
3. Vous êtes redirigé vers `/dashboard`

### Charger les données de test

Après avoir créé votre compte :

```bash
# Via la CLI Supabase
supabase db seed

# OU via SQL Editor : coller le contenu de supabase/seed.sql
```

---

## Étape 6 — Déployer sur Vercel

### Via l'interface Vercel (recommandé)

1. Pousser le code sur GitHub/GitLab
2. Aller sur [vercel.com/new](https://vercel.com/new)
3. Importer votre repo
4. Framework : **Next.js** (auto-détecté)
5. Ajouter les variables d'environnement :

| Variable | Valeur |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Votre URL Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Votre anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Votre service role key |
| `OPENAI_API_KEY` | Votre clé OpenAI (pour le module IA) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |

6. Cliquer **Deploy** !

### Via la CLI Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Étape 7 — Mettre à jour l'URL de production dans Supabase

Après le déploiement Vercel, récupérer l'URL (ex: `https://vintedpro.vercel.app`) :

**Supabase Dashboard** > **Authentication** > **URL Configuration** :
- Site URL → `https://vintedpro.vercel.app`
- Redirect URLs → `https://vintedpro.vercel.app/auth/callback`

---

## Structure du projet

```
vintedpro/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, metadata)
│   │   ├── globals.css             # CSS variables + Tailwind
│   │   ├── page.tsx                # Redirect vers /dashboard
│   │   ├── auth/
│   │   │   ├── login/page.tsx      # Page de connexion/inscription
│   │   │   └── callback/route.ts   # OAuth callback
│   │   ├── dashboard/
│   │   │   ├── layout.tsx          # Layout protégé (auth check)
│   │   │   ├── page.tsx            # Vue d'ensemble (KPIs)
│   │   │   ├── inventory/page.tsx  # Inventaire
│   │   │   ├── orders/page.tsx     # Commandes Kanban
│   │   │   ├── customers/page.tsx  # Clients
│   │   │   └── stats/page.tsx      # Comptabilité
│   │   └── api/
│   │       ├── products/           # CRUD produits
│   │       │   ├── route.ts        # GET /api/products, POST /api/products
│   │       │   └── [id]/route.ts   # PATCH, DELETE /api/products/:id
│   │       └── ai/description/     # POST /api/ai/description
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx         # Navigation latérale
│   │   │   └── Header.tsx          # Barre supérieure
│   │   ├── inventory/
│   │   │   ├── InventoryTable.tsx  # Tableau filtrable
│   │   │   └── InventoryKpiBar.tsx # KPIs inventaire
│   │   └── stats/
│   │       ├── KpiCards.tsx        # Cards KPI dashboard
│   │       ├── RevenueChart.tsx    # Graphique CA/Marge (Recharts)
│   │       ├── StockDonut.tsx      # Donut répartition stock
│   │       ├── ActivityFeed.tsx    # Flux d'activité
│   │       └── QuickActions.tsx    # Actions rapides
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Client navigateur
│   │   │   └── server.ts           # Client serveur + admin
│   │   └── utils.ts                # cn(), formatEuro(), calcROI()...
│   ├── types/
│   │   └── database.ts             # Types TypeScript complets
│   └── middleware.ts               # Auth middleware + protection routes
├── supabase/
│   ├── config.toml                 # Config CLI locale
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # Schéma complet + RLS + triggers
│   └── seed.sql                    # Données de test
├── .env.local.example              # Template variables d'environnement
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

---

## Variables d'environnement complètes

```env
# Supabase (obligatoires)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI (optionnel — pour le module IA)
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-32-chars>
```

---

## Roadmap des phases

| Phase | Statut | Contenu |
|---|---|---|
| ✅ Phase 1 | **Livré** | Maquette dashboard interactive |
| ✅ Phase 2 | **Livré** | Next.js + Supabase + Layout + Auth + Inventaire |
| 🔄 Phase 3 | En cours | Kanban Commandes (drag-and-drop) |
| ⏳ Phase 4 | Planifié | Clients + Templates + Calculateur marge |
| ⏳ Phase 5 | Planifié | Comptabilité + Export URSSAF |
| ⏳ Phase 6 | Planifié | Extension Chrome (Plasmo) |
