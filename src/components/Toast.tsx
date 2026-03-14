import { useEffect } from 'react'

export type ToastKind = 'success' | 'error' | 'info'

export default function Toast({
  message,
  kind,
  onClose,
}: {
  message: string | null
  kind: ToastKind
  onClose: () => void
}) {
  useEffect(() => {
    if (!message) return
    const t = window.setTimeout(onClose, 3500)
    return () => window.clearTimeout(t)
  }, [message, onClose])

  if (!message) return null

  return (
    <div className={`toast toast-${kind}`} role="status" aria-live="polite">
      <div className="toastMsg">{message}</div>
      <button className="toastClose" onClick={onClose} aria-label="Close">
        ×
      </button>
    </div>
  )
}
