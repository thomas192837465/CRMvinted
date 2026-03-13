// ─── src/components/stats/KpiCards.tsx ───────────────────────────────────────
import { TrendingUp, Euro, Package2, Truck, AlertTriangle } from 'lucide-react'
import { cn, formatEuro } from '@/lib/utils'

interface KpiCardsProps {
  revenue:      number
  netMargin:    number
  onlineCount:  number
  activeOrders: number
  disputes:     number
}

interface CardProps {
  label:       string
  value:       string
  sub:         string
  accent:      string
  icon:        React.ReactNode
  iconBg:      string
  topColor:    string
  valueColor?: string
}

function StatCard({ label, value, sub, accent, icon, iconBg, topColor, valueColor }: CardProps) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-[14px] border border-border bg-card p-5',
      'transition-all duration-200 hover:-translate-y-px hover:border-cyan/20',
      'before:absolute before:inset-x-0 before:top-0 before:h-[2px]',
    )} style={{ '--tw-before-bg': topColor } as React.CSSProperties}>
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-[14px]" style={{ background: topColor }} />

      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.8px] text-muted-foreground/70">
        {label}
      </div>

      <div className={cn('mb-2 font-mono text-[26px] font-bold leading-none', valueColor ?? 'text-foreground')}>
        {value}
      </div>

      <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
        {sub}
      </div>

      {/* Icon */}
      <div className={cn('absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-[9px]', iconBg)}>
        {icon}
      </div>
    </div>
  )
}

export function KpiCards({ revenue, netMargin, onlineCount, activeOrders, disputes }: KpiCardsProps) {
  const marginRate = revenue > 0 ? ((netMargin / revenue) * 100).toFixed(1) : '0'

  return (
    <div className="grid grid-cols-4 gap-3.5">
      <StatCard
        label="CA Total"
        value={formatEuro(revenue, 0)}
        sub="chiffre d'affaires cumulé"
        accent="#06b6d4"
        topColor="linear-gradient(90deg, #06b6d4, transparent)"
        icon={<Euro size={18} className="text-cyan" />}
        iconBg="bg-cyan/10"
      />
      <StatCard
        label="Marge nette"
        value={formatEuro(netMargin, 0)}
        sub={`${marginRate}% de taux de marge`}
        accent="#10b981"
        topColor="linear-gradient(90deg, #10b981, transparent)"
        icon={<TrendingUp size={18} className="text-emerald-400" />}
        iconBg="bg-emerald-400/10"
      />
      <StatCard
        label="Articles en ligne"
        value={String(onlineCount)}
        sub="publiés sur Vinted"
        accent="#f59e0b"
        topColor="linear-gradient(90deg, #f59e0b, transparent)"
        icon={<Package2 size={18} className="text-amber-400" />}
        iconBg="bg-amber-400/10"
      />
      <StatCard
        label="Commandes actives"
        value={String(activeOrders)}
        sub={disputes > 0 ? `⚠ ${disputes} litige${disputes > 1 ? 's' : ''} en cours` : 'tout en ordre'}
        accent={disputes > 0 ? '#ef4444' : '#8b5cf6'}
        topColor={disputes > 0 ? 'linear-gradient(90deg, #ef4444, transparent)' : 'linear-gradient(90deg, #8b5cf6, transparent)'}
        icon={disputes > 0
          ? <AlertTriangle size={18} className="text-red-400" />
          : <Truck size={18} className="text-violet-400" />
        }
        iconBg={disputes > 0 ? 'bg-red-400/10' : 'bg-violet-400/10'}
        valueColor={disputes > 0 ? 'text-red-400' : undefined}
      />
    </div>
  )
}
