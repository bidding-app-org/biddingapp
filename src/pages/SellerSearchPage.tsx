import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listSellerProducts } from '../api/products'
import type { ProductResponse } from '../types/api'
import { formatMoney } from '../utils/date'
import Toast from '../components/Toast'

const LS_SELLER = 'bidpulse.sellerName'

export default function SellerSearchPage() {
  const [sellerName, setSellerName] = useState(() => localStorage.getItem(LS_SELLER) ?? 'seller')
  const [items, setItems] = useState<ProductResponse[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; kind: 'success' | 'error' | 'info' } | null>(null)

  useEffect(() => {
    let alive = true
    const load = async () => {
    const normalized = sellerName.trim()
    if (!normalized) {
      setItems([])
      return
    }

    localStorage.setItem(LS_SELLER, normalized)
    setLoading(true)
    try {
      const data = await listSellerProducts(normalized)
      if (!alive) return
      setItems(data)
    } catch (e: any) {
      if (!alive) return
      setItems([])
      setToast({ msg: e?.message ?? 'Failed to load products', kind: 'error' })
    } finally {
      if (!alive) return
      setLoading(false)
    }
    }

    void load()

    return () => {
      alive = false
    }
  }, [sellerName])

  return (
    <div>
      <Toast message={toast?.msg ?? null} kind={toast?.kind ?? 'info'} onClose={() => setToast(null)} />

      <div className="panel">
        <div className="detailsHeader">
          <h2 style={{ margin: 0 }}>Seller Product Search</h2>
          <Link to="/seller" className="btn btnGhost">
            Back to Dashboard
          </Link>
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <label className="field" style={{ flex: 1 }}>
            <span className="label">Seller name</span>
            <input value={sellerName} onChange={(e) => setSellerName(e.target.value)} placeholder="e.g. seller" />
          </label>
        </div>

        <div className="divider" />

        {loading ? (
          <div className="skeleton" style={{ height: 160 }} />
        ) : items === null ? (
          <div className="muted">Enter seller name to search products.</div>
        ) : items.length === 0 ? (
          <div className="emptyState">
            <h3>No products found</h3>
            <p>Try another seller name.</p>
          </div>
        ) : (
          <>
            <div className="muted" style={{ marginBottom: 8 }}>
              Showing {items.length} products for seller
            </div>
            <div className="grid">
              {items.map((p) => (
                <div key={p.id} className="card productCard">
                  <div className="cardBody">
                    <div className="cardTitleRow">
                      <h3 className="cardTitle">{p.name}</h3>
                      <span className="price">{formatMoney(p.currentPrice)}</span>
                    </div>
                    <div className={`pill ${p.status === 'SOLD' ? 'pillSold' : 'pillActive'}`} style={{ position: 'static', display: 'inline-flex', marginTop: 8 }}>
                      {p.status}
                    </div>
                    <div className="muted">Ends: {p.endTime.replace('T', ' ')}</div>
                    <div className="row rowEnd" style={{ marginTop: 12 }}>
                      <Link className="btn btnGhost" to={`/products/${p.id}`}>
                        View
                      </Link>
                      <Link className="btn btnGhost" to={`/seller/products/${p.id}/edit`}>
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}