import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listProducts } from '../api/products'
import type { ProductResponse } from '../types/api'
import { formatCountdown, formatMoney, parseLocalDateTime } from '../utils/date'

function useNow(tickMs = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), tickMs)
    return () => window.clearInterval(t)
  }, [tickMs])
  return now
}

export default function HomePage() {
  const [items, setItems] = useState<ProductResponse[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const now = useNow(1000)

  useEffect(() => {
    let alive = true
    listProducts()
      .then((data) => {
        if (!alive) return
        setItems(data)
        setError(null)
      })
      .catch((e: any) => {
        if (!alive) return
        setError(e?.message ?? 'Failed to load products')
        setItems([])
      })
    return () => {
      alive = false
    }
  }, [])

  const sorted = useMemo(() => {
    if (!items) return null
    return [...items].sort((a, b) => b.id - a.id)
  }, [items])

  return (
    <div>
      <div className="hero">
        <h1 className="heroTitle">Bid fast. Win smart.</h1>
        <p className="heroSubtitle">Browse active auctions and place a higher bid in seconds.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!sorted ? (
        <div className="skeletonGrid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="card skeleton" key={i} />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="emptyState">
          <h3>No products yet</h3>
          <p>Ask the seller to add a product.</p>
          <Link className="btn btnPrimary" to="/seller/add">
            Add a product
          </Link>
        </div>
      ) : (
        <div className="grid">
          {sorted.map((p) => {
            const end = parseLocalDateTime(p.endTime).getTime()
            const remaining = end - now

            return (
              <Link key={p.id} to={`/products/${p.id}`} className="card productCard">
                <div className="cardBody">
                  <div className="cardTitleRow">
                    <h3 className="cardTitle">{p.name}</h3>
                    <span className="price">{formatMoney(p.currentPrice)}</span>
                  </div>
                  <div className={`pill ${p.status === 'SOLD' ? 'pillSold' : 'pillActive'}`} style={{ position: 'static', display: 'inline-flex', marginTop: 8 }}>
                    {p.status}
                  </div>
                  <div className="muted">Ends in: {formatCountdown(remaining)}</div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
