// ─── src/components/inventory/InventoryTable.tsx ─────────────────────────────
'use client'

import { useState, useMemo } from 'react'
import { Search, Download, Plus, QrCode, Sparkles, Pencil, Trash2 } from 'lucide-react'
import { cn, PRODUCT_STATUS_CONFIG, formatEuro } from '@/lib/utils'
import type { Product, ProductStatus } from '@/types/database'

interface InventoryTableProps {
  products: Product[]
}

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: 'ALL',      label: 'Tous'             },
  { value: 'ONLINE',   label: 'En ligne'         },
  { value: 'DRAFT',    label: 'Brouillon'        },
  { value: 'TO_PHOTO', label: 'À photographier'  },
  { value: 'TO_CLEAN', label: 'À nettoyer'       },
  { value: 'SOLD',     label: 'Vendu'            },
]

function StatusPill({ status }: { status: ProductStatus }) {
  const cfg = PRODUCT_STATUS_CONFIG[status]
  if (!cfg) return null
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11.5px] font-semibold', cfg.color, cfg.bg)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', cfg.color.replace('text-', 'bg-'))} />
      {cfg.label}
    </span>
  )
}

function RoiBar({ roi }: { roi: number | null }) {
  if (roi == null) return <span className="text-muted-foreground text-sm">–</span>
  const pct = Math.min(Math.abs(roi) / 250 * 100, 100)
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-14 overflow-hidden rounded-full bg-card-hover">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan to-emerald-400" style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[12px] font-bold text-emerald-400">+{roi}%</span>
    </div>
  )
}

export function InventoryTable({ products }: InventoryTableProps) {
  const [filter, setFilter]   = useState('ALL')
  const [search, setSearch]   = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => products.filter(p => {
    const matchStatus = filter === 'ALL' || p.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || [p.brand, p.model, p.sku, p.color].some(f => f?.toLowerCase().includes(q))
    return matchStatus && matchSearch
  }), [products, filter, search])

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(p => p.id)))
  }

  return (
    <div>
      {/* Section header */}
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[15px] font-semibold">
          <span className="h-2 w-2 rounded-full bg-cyan" />
          Inventaire
          <span className="font-mono text-[12px] text-muted-foreground bg-card px-2 py-0.5 rounded">{filtered.length}</span>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-all hover:border-cyan/30 hover:text-foreground">
            <QrCode size={14} />Étiquettes
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-cyan-gradient px-3.5 py-1.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90">
            <Plus size={14} />Ajouter
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-[14px] border border-border bg-card">
        {/* Toolbar */}
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-[13px] text-muted-foreground w-48 focus-within:border-cyan/30 transition-colors">
            <Search size={13} />
            <input
              className="flex-1 bg-transparent outline-none text-[13px] text-foreground font-sans placeholder:text-muted-foreground"
              placeholder="SKU, marque…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="mx-1 h-5 w-px bg-border" />

          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'rounded-[7px] border px-3 py-1.5 text-[12.5px] font-medium transition-all',
                filter === f.value
                  ? 'border-cyan/30 bg-cyan/10 text-cyan'
                  : 'border-border bg-background text-muted-foreground hover:border-cyan/20 hover:text-foreground'
              )}
            >
              {f.label}
            </button>
          ))}

          <button className="ml-auto flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-[12.5px] font-medium text-muted-foreground transition-all hover:border-cyan/20 hover:text-foreground">
            <Download size={13} />Exporter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/30">
                <th className="w-10 px-4 py-2.5">
                  <input type="checkbox" className="accent-cyan"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                {['SKU', 'Article', 'Taille', 'Localisation', 'Achat', 'Cible', 'ROI', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="whitespace-nowrap px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.8px] text-muted-foreground/70">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr
                  key={p.id}
                  className={cn(
                    'border-b border-border/50 transition-colors last:border-0',
                    selected.has(p.id) ? 'bg-cyan/5' : 'hover:bg-card-hover/50'
                  )}
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="accent-cyan"
                      checked={selected.has(p.id)}
                      onChange={() => toggleSelect(p.id)}
                    />
                  </td>
                  <td className="px-3.5 py-3">
                    <span className="rounded bg-cyan/10 px-2 py-0.5 font-mono text-[11px] text-cyan">
                      {p.sku}
                    </span>
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="text-[13.5px] font-semibold">{p.brand}</div>
                    <div className="text-[12px] text-muted-foreground">{p.model} · {p.color}</div>
                  </td>
                  <td className="px-3.5 py-3 font-mono text-[12px] text-muted-foreground">{p.size ?? '–'}</td>
                  <td className="px-3.5 py-3 text-[12px] text-muted-foreground">{p.physical_location ?? '–'}</td>
                  <td className="px-3.5 py-3 font-mono text-[13px] font-bold text-muted-foreground">
                    {formatEuro(p.purchase_price)}
                  </td>
                  <td className="px-3.5 py-3 font-mono text-[13px] font-bold text-cyan">
                    {p.target_price ? formatEuro(p.target_price) : '–'}
                  </td>
                  <td className="px-3.5 py-3"><RoiBar roi={p.roi} /></td>
                  <td className="px-3.5 py-3"><StatusPill status={p.status} /></td>
                  <td className="px-3.5 py-3">
                    <div className="flex items-center gap-1.5">
                      <button className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400" title="Description IA">
                        <Sparkles size={13} />
                      </button>
                      <button className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-all hover:border-cyan/30 hover:bg-cyan/10 hover:text-cyan" title="Modifier">
                        <Pencil size={13} />
                      </button>
                      <button className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400" title="Supprimer">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-[13px] text-muted-foreground">
              Aucun article ne correspond aux filtres sélectionnés
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
