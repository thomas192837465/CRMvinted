// ─── src/app/dashboard/inventory/page.tsx ────────────────────────────────────
import { createClient }       from '@/lib/supabase/server'
import { InventoryTable }     from '@/components/inventory/InventoryTable'
import { InventoryKpiBar }    from '@/components/inventory/InventoryKpiBar'

export const metadata = { title: 'Inventaire' }

interface SearchParams { status?: string; search?: string; brand?: string }

export default async function InventoryPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('products')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  if (searchParams.status && searchParams.status !== 'ALL') {
    query = query.eq('status', searchParams.status)
  }
  if (searchParams.brand) {
    query = query.ilike('brand', `%${searchParams.brand}%`)
  }

  const { data: products, error } = await query

  // KPI aggregates
  const allProducts = products ?? []
  const kpis = {
    total:        allProducts.length,
    online:       allProducts.filter(p => p.status === 'ONLINE').length,
    purchaseValue:allProducts.reduce((s, p) => s + p.purchase_price, 0),
    saleValue:    allProducts.reduce((s, p) => s + (p.target_price ?? 0), 0),
    avgRoi:       allProducts.filter(p => p.roi).reduce((s, p, _, arr) => s + (p.roi ?? 0) / arr.length, 0),
  }

  return (
    <div className="space-y-5">
      <InventoryKpiBar kpis={kpis} />
      <InventoryTable products={allProducts} />
    </div>
  )
}
