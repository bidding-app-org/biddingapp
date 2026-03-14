import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProduct, updateProduct } from '../api/products'
import Toast from '../components/Toast'
import type { ProductResponse } from '../types/api'
import { parseLocalDateTime, toIsoLocalDateTime } from '../utils/date'

const LS_SELLER = 'bidpulse.sellerName'

function toDatetimeLocalValue(endTime: string): string {
  // Convert 'YYYY-MM-DDTHH:mm:ss' -> 'YYYY-MM-DDTHH:mm'
  const [d, t = '00:00:00'] = endTime.split('T')
  return `${d}T${t.slice(0, 5)}`
}

export default function EditProductPage() {
  const { id } = useParams()
  const productId = Number(id)
  const navigate = useNavigate()

  const [loaded, setLoaded] = useState<ProductResponse | null>(null)
  const [sellerName, setSellerName] = useState(() => localStorage.getItem(LS_SELLER) ?? 'seller')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startingPrice, setStartingPrice] = useState('')
  const [endTime, setEndTime] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; kind: 'success' | 'error' | 'info' } | null>(null)

  useEffect(() => {
    if (!Number.isFinite(productId) || productId <= 0) return
    ;(async () => {
      try {
        const p = await getProduct(productId)
        setLoaded(p)
        setName(p.name)
        setDescription(p.description)
        setStartingPrice(String(p.startingPrice))
        setEndTime(toDatetimeLocalValue(p.endTime))
      } catch (e: any) {
        setToast({ msg: e?.message ?? 'Failed to load product', kind: 'error' })
      }
    })()
  }, [productId])

  const ended = loaded ? Date.now() >= parseLocalDateTime(loaded.endTime).getTime() : false

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loaded) return

    if (!sellerName.trim()) return setToast({ msg: 'Seller name is required', kind: 'error' })
    if (!name.trim()) return setToast({ msg: 'Name is required', kind: 'error' })
    if (!description.trim()) return setToast({ msg: 'Description is required', kind: 'error' })
    if (!startingPrice || Number(startingPrice) <= 0) return setToast({ msg: 'Starting price must be > 0', kind: 'error' })
    if (!endTime) return setToast({ msg: 'End time is required', kind: 'error' })

    localStorage.setItem(LS_SELLER, sellerName.trim())

    const fd = new FormData()
    fd.append('sellerName', sellerName.trim())
    fd.append('name', name.trim())
    fd.append('description', description.trim())
    fd.append('startingPrice', startingPrice)
    fd.append('endTime', toIsoLocalDateTime(endTime))

    setSubmitting(true)
    try {
      const updated = await updateProduct(productId, fd)
      setToast({ msg: 'Updated!', kind: 'success' })
      navigate(`/products/${updated.id}`)
    } catch (e: any) {
      setToast({ msg: e?.message ?? 'Update failed', kind: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="panel">
      <Toast message={toast?.msg ?? null} kind={toast?.kind ?? 'info'} onClose={() => setToast(null)} />

      <div className="detailsHeader">
        <h2 style={{ margin: 0 }}>Edit Product</h2>
        <Link to="/seller" className="btn btnGhost">
          ← Dashboard
        </Link>
      </div>

      {!loaded ? (
        <div className="skeleton" style={{ height: 220, marginTop: 14 }} />
      ) : ended ? (
        <div className="alert alert-error" style={{ marginTop: 14 }}>
          This auction has ended. Editing is disabled.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="form" style={{ marginTop: 14 }}>
          <div className="row">
            <label className="field" style={{ flex: 1 }}>
              <span className="label">Seller name</span>
              <input value={sellerName} onChange={(e) => setSellerName(e.target.value)} />
            </label>
            <label className="field" style={{ flex: 1 }}>
              <span className="label">End date & time</span>
              <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </label>
          </div>

          <div className="row">
            <label className="field" style={{ flex: 1 }}>
              <span className="label">Product name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="field" style={{ flex: 1 }}>
              <span className="label">Starting price</span>
              <input value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} inputMode="decimal" />
            </label>
          </div>

          <label className="field">
            <span className="label">Description</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
          </label>

          <div className="row rowEnd">
            <button className="btn btnPrimary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
