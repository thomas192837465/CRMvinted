// ─── src/components/stats/RevenueChart.tsx ───────────────────────────────────
'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import type { MonthlySales } from '@/types/database'

interface RevenueChartProps {
  data: MonthlySales[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-xl">
      <div className="mb-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-muted-foreground">{p.name} :</span>
          <span className="font-mono font-bold" style={{ color: p.fill }}>
            {p.value.toLocaleString('fr-FR')}€
          </span>
        </div>
      ))}
    </div>
  )
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Formatter les données pour Recharts
  const chartData = data.map(d => ({
    month:  new Date(d.month).toLocaleDateString('fr-FR', { month: 'short' }),
    CA:     Number(d.total_revenue),
    Marge:  Number(d.total_net),
    Orders: Number(d.total_orders),
  }))

  return (
    <div className="rounded-[14px] border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[14px] font-semibold">Évolution CA & Marge</div>
        <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan" />
            Chiffre d'affaires
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            Marge nette
          </span>
        </div>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} barCategoryGap="25%" barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false} tickLine={false}
              tick={{ fill: '#8892a4', fontSize: 11, fontFamily: 'Space Mono' }}
            />
            <YAxis
              axisLine={false} tickLine={false}
              tick={{ fill: '#8892a4', fontSize: 10 }}
              tickFormatter={v => `${v}€`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="CA"    name="CA"    fill="#06b6d4" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Marge" name="Marge" fill="#10b981" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-40 items-center justify-center text-[13px] text-muted-foreground">
          Aucune donnée de vente pour le moment
        </div>
      )}
    </div>
  )
}
