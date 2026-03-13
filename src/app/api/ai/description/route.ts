// ─── src/app/api/ai/description/route.ts ─────────────────────────────────────
// Génère une description Vinted optimisée via OpenAI GPT-4o-mini
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { productId, brand, model, size, color, condition, material } = await request.json()

  const prompt = `Tu es un expert en vente sur Vinted. Génère une description d'annonce optimisée, naturelle et vendeuse pour l'article suivant.

Article :
- Marque: ${brand ?? 'Non précisée'}
- Modèle: ${model ?? 'Non précisé'}
- Taille: ${size ?? 'Non précisée'}
- Couleur: ${color ?? 'Non précisée'}
- État: ${condition ?? 'Bon état'}
- Matière: ${material ?? 'Non précisée'}

Consignes :
- 3-5 phrases maximum
- Ton naturel, pas trop commercial
- Mentionner l'état avec honnêteté
- Ajouter les hashtags pertinents à la fin (#vintage #secondmain #marque etc.)
- Langue française uniquement

Réponds uniquement avec la description, sans préambule.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const description = data.choices?.[0]?.message?.content?.trim()

    if (!description) throw new Error('Empty response from OpenAI')

    // Sauvegarder la description générée dans Supabase
    if (productId) {
      await supabase
        .from('products')
        .update({ description, description_ai: true })
        .eq('id', productId)
        .eq('user_id', user.id)
    }

    return NextResponse.json({ description })
  } catch (err) {
    console.error('AI description error:', err)
    return NextResponse.json({ error: 'Génération IA échouée' }, { status: 500 })
  }
}
