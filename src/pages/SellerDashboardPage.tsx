import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteProduct, listSellerProducts } from '../api/products'
import type { ProductResponse } from '../types/api'
import { formatMoney, parseLocalDateTime } from '../utils/date'
import Toast from '../components/Toast'

const LS_SELLER = 'bidpulse.sellerName'

export default function SellerDashboardPage() {
  const [sellerName, setSellerName] = useState(() => localStorage.getItem(LS_SELLER) ?? 'seller')
  const [items, setItems] = useState<ProductResponse[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; kind: 'success' | 'error' | 'info' } | null>(null)

  const load = async (name: string) => {
    if (!name.trim()) {
      setItems([])
      return
    }
    setLoading(true)
    try {
      const data = await listSellerProducts(name.trim())
      setItems(data)
    } catch (e: any) {
      setItems([])
      setToast({ msg: e?.message ?? 'Failed to load seller products', kind: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(sellerName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const normalized = useMemo(() => sellerName.trim(), [sellerName])

  const onApplySeller = () => {
    localStorage.setItem(LS_SELLER, normalized)
    load(normalized)
  }

  const onDelete = async (p: ProductResponse) => {
    if (!normalized) {
      setToast({ msg: 'Enter seller name first', kind: 'error' })
      return
    }

    const ok = window.confirm(`Delete '${p.name}'? This cannot be undone.`)
    if (!ok) return

    try {
      await deleteProduct(p.id, normalized)
      setToast({ msg: 'Deleted successfully', kind: 'success' })
      await load(normalized)
    } catch (e: any) {
      setToast({ msg: e?.message ?? 'Delete failed', kind: 'error' })
    }
  }

  return (
    <div>
      <Toast
        message={toast?.msg ?? null}
        kind={toast?.kind ?? 'info'}
        onClose={() => setToast(null)}
      />

      <div className="panel">
        <div className="detailsHeader">
          <h2 style={{ margin: 0 }}>Seller Dashboard</h2>
          <Link to="/seller/add" className="btn btnPrimary">
            + Add product
          </Link>
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <label className="field" style={{ flex: 1 }}>
            <span className="label">Seller name</span>
            <input
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              placeholder="e.g. seller"
            />
          </label>
          <div className="row rowEnd" style={{ alignItems: 'end' }}>
            <button className="btn btnGhost" onClick={onApplySeller}>
              Load
            </button>
          </div>
        </div>

        <div className="divider" />

        {loading || !items ? (
          <div className="skeleton" style={{ height: 180 }} />
        ) : items.length === 0 ? (
          <div className="emptyState">
            <h3>No products for this seller</h3>
            <p>Add your first auction product.</p>
            <Link to="/seller/add" className="btn btnPrimary">
              Add product
            </Link>
          </div>
        ) : (
          <div className="grid">
            {items.map((p) => {
              const ended =
                Date.now() >= parseLocalDateTime(p.endTime).getTime()

              return (
                <div key={p.id} className="card productCard">
                  <div className="cardBody">
                    <div className="cardTitleRow">
                      <h3 className="cardTitle">{p.name}</h3>
                      <span className="price">
                        {formatMoney(p.currentPrice)}
                      </span>
                    </div>

                    <div
                      className={`pill ${
                        p.status === 'SOLD'
                          ? 'pillSold'
                          : 'pillActive'
                      }`}
                      style={{
                        position: 'static',
                        display: 'inline-flex',
                        marginTop: 8,
                      }}
                    >
                      {p.status}
                    </div>

                    <div className="muted">
                      Ends: {p.endTime.replace('T', ' ')}
                    </div>

                    <div className="row rowEnd" style={{ marginTop: 12 }}>
                      <Link
                        className="btn btnGhost"
                        to={`/products/${p.id}`}
                      >
                        View
                      </Link>

                      <Link
                        className="btn btnGhost"
                        to={`/seller/products/${p.id}/edit`}
                        aria-disabled={ended}
                      >
                        Edit
                      </Link>

                      <button
                        className="btn btnDanger"
                        onClick={() => onDelete(p)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}