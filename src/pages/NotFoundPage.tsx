import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="panel">
      <h2 style={{ marginTop: 0 }}>Page not found</h2>
      <p className="muted">That route doesn’t exist.</p>
      <Link className="btn btnPrimary" to="/">
        Go home
      </Link>
    </div>
  )
}
