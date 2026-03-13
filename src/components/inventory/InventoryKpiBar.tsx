// ─── src/components/inventory/InventoryKpiBar.tsx ────────────────────────────
import { Package2, CheckCircle2, CircleDollarSign, TrendingUp } from 'lucide-react'
import { formatEuro } from '@/lib/utils'

interface Kpis {
  total:         number
  online:        number
  purchaseValue: number
  saleValue:     number
  avgRoi:        number
}

export function InventoryKpiBar({ kpis }: { kpis: Kpis }) {
  return (
    <div className="grid grid-cols-4 gap-3.5">
      {[
        { label: 'Total articles',    value: String(kpis.total),              sub: 'dans l\'inventaire',       icon: Package2,          top: 'linear-gradient(90deg,#06b6d4,transparent)', ic: 'text-cyan bg-cyan/10' },
        { label: 'En ligne',          value: String(kpis.online),             sub: `${Math.round(kpis.online/Math.max(kpis.total,1)*100)}% du stock`, icon: CheckCircle2, top: 'linear-gradient(90deg,#10b981,transparent)', ic: 'text-emerald-400 bg-emerald-400/10' },
        { label: 'Valeur d\'achat',   value: formatEuro(kpis.purchaseValue,0),sub: 'investi au total',          icon: CircleDollarSign,  top: 'linear-gradient(90deg,#f59e0b,transparent)', ic: 'text-amber-400 bg-amber-400/10' },
        { label: 'Valeur de vente',   value: formatEuro(kpis.saleValue,0),    sub: 'potentiel à prix cible',   icon: TrendingUp,        top: 'linear-gradient(90deg,#8b5cf6,transparent)', ic: 'text-violet-400 bg-violet-400/10' },
      ].map(c => (
        <div key={c.label} className="relative overflow-hidden rounded-[14px] border border-border bg-card p-5 transition-all hover:-translate-y-px hover:border-cyan/20">
          <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-[14px]" style={{ background: c.top }} />
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.8px] text-muted-foreground/70">{c.label}</div>
          <div className="mb-2 font-mono text-[24px] font-bold leading-none text-foreground">{c.value}</div>
          <div className="text-[12px] text-muted-foreground">{c.sub}</div>
          <div className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-[9px] ${c.ic}`}>
            <c.icon size={18} />
          </div>
        </div>
      ))}
    </div>
  )
}
