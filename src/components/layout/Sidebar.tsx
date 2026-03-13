// ─── src/components/layout/Sidebar.tsx ───────────────────────────────────────
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package2, ClipboardList,
  Users, BarChart3, Sparkles, QrCode, Settings,
  ShoppingBag,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  {
    section: 'Navigation',
    items: [
      { href: '/dashboard',           label: 'Vue d\'ensemble', icon: LayoutDashboard },
      { href: '/dashboard/inventory', label: 'Inventaire',      icon: Package2,       badge: null,  badgeVariant: 'cyan' },
      { href: '/dashboard/orders',    label: 'Commandes',       icon: ClipboardList,  badge: null,  badgeVariant: 'red' },
      { href: '/dashboard/customers', label: 'Clients',         icon: Users },
      { href: '/dashboard/stats',     label: 'Comptabilité',    icon: BarChart3 },
    ],
  },
  {
    section: 'Outils',
    items: [
      { href: '/dashboard/ai',      label: 'Générateur IA',  icon: Sparkles, badge: 'β',  badgeVariant: 'cyan' },
      { href: '/dashboard/labels',  label: 'Étiquettes QR',  icon: QrCode },
      { href: '/dashboard/settings',label: 'Paramètres',     icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="
      relative flex w-[220px] flex-shrink-0 flex-col
      border-r border-border bg-surface
      after:absolute after:right-0 after:top-0 after:bottom-0 after:w-px
      after:bg-gradient-to-b after:from-transparent after:via-cyan/20 after:to-transparent
    ">
      {/* Logo */}
      <div className="border-b border-border px-5 py-[22px]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[8px] bg-cyan-gradient">
            <ShoppingBag size={17} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <div className="font-mono text-[13px] font-bold tracking-tight text-foreground">VintedPro</div>
            <div className="text-[10px] font-normal uppercase tracking-[0.5px] text-muted-foreground">CRM Dashboard</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3">
        {NAV_ITEMS.map(group => (
          <div key={group.section} className="mb-2">
            <div className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[1px] text-muted-foreground/60">
              {group.section}
            </div>
            {group.items.map(item => {
              const isActive = item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative mb-0.5 flex items-center gap-2.5 rounded-[10px] px-3 py-[9px]',
                    'text-[13.5px] font-medium transition-all duration-150',
                    isActive
                      ? 'border border-cyan/20 bg-gradient-to-r from-cyan/12 to-cyan/5 text-cyan-bright'
                      : 'text-muted-foreground hover:bg-card-hover hover:text-foreground'
                  )}
                >
                  {isActive && (
                    <span className="absolute -left-px top-[20%] bottom-[20%] w-[3px] rounded-r-sm bg-cyan" />
                  )}
                  <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
                  {item.label}
                  {item.badge && (
                    <span className={cn(
                      'ml-auto rounded-[10px] px-1.5 py-0.5 font-mono text-[10px] font-bold',
                      item.badgeVariant === 'cyan' && 'bg-cyan/15 text-cyan',
                      item.badgeVariant === 'red'  && 'bg-red-500/20 text-red-400',
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User card */}
      <div className="border-t border-border p-2.5">
        <div className="flex items-center gap-2.5 rounded-[10px] bg-card px-3 py-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan/60 to-purple-500/60 font-mono text-xs font-bold text-white">
            VP
          </div>
          <div className="min-w-0">
            <div className="truncate text-[12.5px] font-semibold text-foreground">Mon Compte</div>
            <div className="text-[10px] text-cyan font-mono">PRO · Actif</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
