// ─── src/app/dashboard/page.tsx ──────────────────────────────────────────────
import { createClient } from '@/lib/supabase/server'
import { KpiCards }      from '@/components/stats/KpiCards'
import { RevenueChart }  from '@/components/stats/RevenueChart'
import { StockDonut }    from '@/components/stats/StockDonut'
import { ActivityFeed }  from '@/components/stats/ActivityFeed'
import { QuickActions }  from '@/components/stats/QuickActions'

export const metadata = { title: 'Vue d\'ensemble' }

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // KPIs
  const [
    { data: products },
    { data: orders },
    { data: customers },
    { data: monthlySales },
  ] = await Promise.all([
    supabase.from('products').select('id, status, roi, purchase_price, target_price').eq('user_id', user!.id),
    supabase.from('orders').select('id, status, sale_price, has_dispute, created_at').eq('user_id', user!.id),
    supabase.from('customers').select('id').eq('user_id', user!.id),
    supabase.from('v_monthly_sales').select('*').eq('user_id', user!.id).order('month', { ascending: true }).limit(6),
  ])

  const onlineCount  = products?.filter(p => p.status === 'ONLINE').length ?? 0
  const totalRevenue = monthlySales?.reduce((s, m) => s + Number(m.total_revenue), 0) ?? 0
  const totalNet     = monthlySales?.reduce((s, m) => s + Number(m.total_net), 0) ?? 0
  const disputes     = orders?.filter(o => o.has_dispute).length ?? 0
  const activeOrders = orders?.filter(o => !['PAID'].includes(o.status)).length ?? 0

  return (
    <div className="space-y-6">
      <KpiCards
        revenue={totalRevenue}
        netMargin={totalNet}
        onlineCount={onlineCount}
        activeOrders={activeOrders}
        disputes={disputes}
      />

      <div className="grid grid-cols-[1fr_300px] gap-4">
        <div className="space-y-4">
          <RevenueChart data={monthlySales ?? []} />
          <ActivityFeed userId={user!.id} />
        </div>
        <div className="space-y-4">
          <StockDonut products={products ?? []} />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
