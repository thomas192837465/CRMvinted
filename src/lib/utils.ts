// ─── src/lib/utils.ts ─────────────────────────────────────────────────────────
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Format monétaire ─────────────────────────────────────────────────────────
export function formatEuro(amount: number | null | undefined, decimals = 2): string {
  if (amount == null) return '–'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}

// ─── Format pourcentage ───────────────────────────────────────────────────────
export function formatPct(value: number | null | undefined): string {
  if (value == null) return '–'
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}

// ─── Format date ──────────────────────────────────────────────────────────────
export function formatDate(date: string | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return '–'
  return new Date(date).toLocaleDateString('fr-FR', options ?? { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Calcul ROI ───────────────────────────────────────────────────────────────
export function calcROI(purchasePrice: number, additionalFees: number, targetPrice: number): number {
  const cost = purchasePrice + additionalFees
  if (cost === 0) return 0
  return Math.round(((targetPrice - cost) / cost) * 100 * 10) / 10
}

// ─── Calcul marge nette ───────────────────────────────────────────────────────
export function calcNetMargin(purchasePrice: number, additionalFees: number, salePrice: number, vintedFeeRate = 0.05): number {
  return Math.round((salePrice - purchasePrice - additionalFees - salePrice * vintedFeeRate) * 100) / 100
}

// ─── Générer SKU unique ───────────────────────────────────────────────────────
export function generateSKU(brand: string, index: number): string {
  const prefix = brand.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X')
  const num    = String(index).padStart(4, '0')
  return `${prefix}-${num}`
}

// ─── Status config ────────────────────────────────────────────────────────────
export const PRODUCT_STATUS_CONFIG = {
  TO_CLEAN:  { label: 'À nettoyer',        color: 'text-amber-400',   bg: 'bg-amber-400/10'  },
  TO_PHOTO:  { label: 'À photographier',   color: 'text-violet-400',  bg: 'bg-violet-400/10' },
  DRAFT:     { label: 'Brouillon',         color: 'text-slate-400',   bg: 'bg-slate-400/10'  },
  ONLINE:    { label: 'En ligne',          color: 'text-emerald-400', bg: 'bg-emerald-400/10'},
  SOLD:      { label: 'Vendu',             color: 'text-cyan-400',    bg: 'bg-cyan-400/10'   },
  RETURNED:  { label: 'Retourné',          color: 'text-red-400',     bg: 'bg-red-400/10'    },
  LOST:      { label: 'Perdu',             color: 'text-slate-600',   bg: 'bg-slate-600/10'  },
} as const

export const ORDER_STATUS_CONFIG = {
  TO_PREPARE: { label: 'À préparer', color: 'text-amber-400',   bg: 'bg-amber-400/10'  },
  SHIPPED:    { label: 'Expédié',    color: 'text-violet-400',  bg: 'bg-violet-400/10' },
  IN_TRANSIT: { label: 'En transit', color: 'text-cyan-400',    bg: 'bg-cyan-400/10'   },
  DELIVERED:  { label: 'Livré',      color: 'text-emerald-400', bg: 'bg-emerald-400/10'},
  PAID:       { label: 'Payé ✓',    color: 'text-green-400',   bg: 'bg-green-400/10'  },
} as const

export const EXPENSE_TYPE_LABELS: Record<string, string> = {
  PACKAGING:         'Emballage',
  LABEL:             'Étiquettes',
  SHIPPING_SUPPLIES: 'Fournitures expédition',
  PHOTOGRAPHY:       'Photographie',
  STORAGE:           'Stockage',
  PLATFORM_FEES:     'Frais plateforme',
  OTHER:             'Autre',
}
