// ─── src/app/dashboard/orders/page.tsx ───────────────────────────────────────
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Commandes' }

export default async function OrdersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, product:products(brand, model, sku), customer:customers(vinted_username)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="rounded-[14px] border border-border bg-card p-8 text-center">
      <div className="text-[15px] font-semibold mb-2">Vue Kanban — Commandes</div>
      <div className="text-[13px] text-muted-foreground">
        Phase 3 : Kanban drag-and-drop avec {orders?.length ?? 0} commandes.<br />
        En cours de développement.
      </div>
    </div>
  )
}
