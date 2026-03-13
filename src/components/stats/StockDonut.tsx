// ─── src/components/stats/StockDonut.tsx ─────────────────────────────────────
'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { Product } from '@/types/database'
import { PRODUCT_STATUS_CONFIG } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  ONLINE:   '#10b981',
  DRAFT:    '#6b7280',
  TO_PHOTO: '#8b5cf6',
  TO_CLEAN: '#f59e0b',
  SOLD:     '#06b6d4',
  RETURNED: '#ef4444',
  LOST:     '#374151',
}

interface StockDonutProps {
  products: Array<{ status: string }>
}

export function StockDonut({ products }: StockDonutProps) {
  const counts: Record<string, number> = {}
  products.forEach(p => { counts[p.status] = (counts[p.status] ?? 0) + 1 })

  const data = Object.entries(counts)
    .map(([status, count]) => ({
      status,
      label: PRODUCT_STATUS_CONFIG[status as keyof typeof PRODUCT_STATUS_CONFIG]?.label ?? status,
      count,
      color: STATUS_COLORS[status] ?? '#374151',
    }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className="rounded-[14px] border border-border bg-card p-5">
      <div className="mb-4 text-[14px] font-semibold">Répartition du stock</div>

      <div className="flex items-center gap-4">
        <div className="relative h-[90px] w-[90px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data} dataKey="count"
                cx="50%" cy="50%"
                innerRadius={28} outerRadius={42}
                strokeWidth={2} stroke="hsl(223, 14%, 13%)"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-[17px] font-bold text-cyan">{products.length}</span>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">items</span>
          </div>
        </div>

        <div className="flex-1 space-y-1.5">
          {data.map(d => (
            <div key={d.status} className="flex items-center gap-2 text-[12px]">
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: d.color }} />
              <span className="flex-1 text-muted-foreground">{d.label}</span>
              <div className="flex items-center gap-2">
                <div className="h-1 w-12 overflow-hidden rounded-full bg-card-hover">
                  <div className="h-full rounded-full" style={{ width: `${(d.count / products.length) * 100}%`, background: d.color }} />
                </div>
                <span className="w-4 text-right font-mono text-muted-foreground">{d.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
