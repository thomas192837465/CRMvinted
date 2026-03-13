// ─── src/components/stats/ActivityFeed.tsx ───────────────────────────────────
import { createClient } from '@/lib/supabase/server'
import { Package2, ShoppingCart, UserPlus, AlertTriangle } from 'lucide-react'

interface ActivityFeedProps {
  userId: string
}

export async function ActivityFeed({ userId }: ActivityFeedProps) {
  const supabase = createClient()

  // Dernières commandes et produits modifiés
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, status, sale_price, created_at, product:products(brand, model)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  const activities = (recentOrders ?? []).map(o => ({
    id:    o.id,
    icon:  ShoppingCart,
    color: '#06b6d4',
    bg:    'rgba(6,182,212,0.12)',
    text:  `Commande — ${(o.product as any)?.brand ?? ''} ${(o.product as any)?.model ?? ''}`.trim() || `Commande ${o.id.slice(0, 8)}`,
    sub:   `${o.sale_price}€ · ${o.status}`,
    time:  new Date(o.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
  }))

  return (
    <div className="rounded-[14px] border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2 text-[14px] font-semibold">
        <span className="h-2 w-2 rounded-full bg-cyan" />
        Activité récente
      </div>

      {activities.length > 0 ? (
        <div className="space-y-2">
          {activities.map(a => (
            <div key={a.id} className="flex items-center gap-3 rounded-[8px] bg-card-hover/50 px-3 py-2.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[7px]"
                style={{ background: a.bg, color: a.color }}>
                <a.icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-[13px] font-medium">{a.text}</div>
                <div className="text-[11px] text-muted-foreground">{a.sub}</div>
              </div>
              <span className="flex-shrink-0 font-mono text-[11px] text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-[13px] text-muted-foreground">
          Aucune activité récente
        </div>
      )}
    </div>
  )
}

// ─── QuickActions ─────────────────────────────────────────────────────────────
// ─── src/components/stats/QuickActions.tsx ───────────────────────────────────
import Link from 'next/link'
import { Plus, Sparkles, Download, QrCode } from 'lucide-react'

const ACTIONS = [
  { href: '/dashboard/inventory?new=1', icon: Plus,      color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  label: 'Ajouter un article',      desc: 'Créer un produit en stock' },
  { href: '/dashboard/ai',              icon: Sparkles,  color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', label: 'Générer description IA',   desc: 'Optimiser vos annonces' },
  { href: '/dashboard/stats?export=1',  icon: Download,  color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Exporter URSSAF',          desc: 'PDF/CSV comptabilité' },
  { href: '/dashboard/labels',          icon: QrCode,    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Imprimer étiquettes',      desc: 'QR codes pour votre stock' },
]

export function QuickActions() {
  return (
    <div className="rounded-[14px] border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2 text-[14px] font-semibold">
        <span className="h-2 w-2 rounded-full bg-cyan" />
        Actions rapides
      </div>
      <div className="space-y-2">
        {ACTIONS.map(a => (
          <Link key={a.href} href={a.href} className="
            flex items-center gap-3 rounded-[10px] border border-border bg-card
            px-4 py-3 transition-all hover:border-cyan/20 hover:bg-card-hover
          ">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[8px]"
              style={{ background: a.bg, color: a.color }}>
              <a.icon size={16} />
            </div>
            <div>
              <div className="text-[13px] font-medium">{a.label}</div>
              <div className="text-[11px] text-muted-foreground">{a.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
