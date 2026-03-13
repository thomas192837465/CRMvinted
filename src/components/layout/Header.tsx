// ─── src/components/layout/Header.tsx ────────────────────────────────────────
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Bell, Search, Plus, Filter, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import { cn } from '@/lib/utils'

const TITLES: Record<string, { main: string; sub: string }> = {
  '/dashboard':            { main: 'Vue d\'ensemble', sub: 'Dashboard' },
  '/dashboard/inventory':  { main: 'Inventaire',      sub: 'Stock' },
  '/dashboard/orders':     { main: 'Commandes',        sub: 'Logistique' },
  '/dashboard/customers':  { main: 'Clients',          sub: '& Messagerie' },
  '/dashboard/stats':      { main: 'Comptabilité',     sub: '& Statistiques' },
  '/dashboard/settings':   { main: 'Paramètres',       sub: 'Configuration' },
}

interface HeaderProps {
  user: Profile | null
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  const title = TITLES[pathname] ?? { main: 'VintedPro', sub: '' }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <header className="
      flex h-[60px] flex-shrink-0 items-center justify-between
      border-b border-border bg-surface px-6
    ">
      {/* Title */}
      <div className="text-[16px] font-semibold text-foreground">
        {title.main}{' '}
        {title.sub && <span className="text-cyan">/ {title.sub}</span>}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className={cn(
          'flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-[7px]',
          'text-muted-foreground text-[13px] w-[220px]',
          'focus-within:border-cyan/30 transition-colors',
        )}>
          <Search size={14} />
          <input
            className="flex-1 bg-transparent outline-none font-sans text-[13px] text-foreground placeholder:text-muted-foreground"
            placeholder="Rechercher…"
          />
          <kbd className="hidden text-[10px] text-muted-foreground/40 sm:inline">⌘K</kbd>
        </div>

        {/* Filter btn */}
        <button className="
          flex items-center gap-1.5 rounded-lg border border-border bg-card
          px-3.5 py-[7px] text-[13px] font-medium text-muted-foreground
          transition-all hover:border-cyan/30 hover:text-foreground
        ">
          <Filter size={14} />
          Filtres
        </button>

        {/* Primary CTA — contextual */}
        {pathname === '/dashboard/inventory' && (
          <button className="
            flex items-center gap-1.5 rounded-lg bg-cyan-gradient
            px-3.5 py-[7px] text-[13px] font-semibold text-white
            transition-opacity hover:opacity-90
          ">
            <Plus size={14} />
            Ajouter
          </button>
        )}

        {/* Notifications */}
        <button className="
          relative flex h-9 w-9 items-center justify-center
          rounded-lg border border-border bg-card text-muted-foreground
          transition-all hover:border-cyan/30 hover:text-foreground
        ">
          <Bell size={16} />
          {/* Dot rouge si alerte */}
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-[1.5px] ring-surface" />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            flex h-9 w-9 items-center justify-center rounded-lg
            border border-border bg-card text-muted-foreground
            transition-all hover:border-red-500/30 hover:text-red-400
          "
          title="Déconnexion"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  )
}
