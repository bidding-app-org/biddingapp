export function parseLocalDateTime(localDateTime: string): Date {
  // Spring LocalDateTime typically serializes as 'YYYY-MM-DDTHH:mm:ss'
  // Parse as *local* time, not UTC.
  const [datePart, timePartRaw = '00:00:00'] = localDateTime.split('T')
  const [y, m, d] = datePart.split('-').map(Number)
  const timePart = timePartRaw.split('.')[0]
  const [hh = 0, mm = 0, ss = 0] = timePart.split(':').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1, hh, mm, ss)
}

export function formatMoney(value: string | number): string {
  const n = typeof value === 'string' ? Number(value) : value
  if (!Number.isFinite(n)) return String(value)
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n)
}

export function toIsoLocalDateTime(datetimeLocalValue: string): string {
  // Input from <input type="datetime-local"> is usually 'YYYY-MM-DDTHH:mm'
  // Ensure seconds are present for Spring's ISO_DATE_TIME parsing.
  if (!datetimeLocalValue) return datetimeLocalValue
  const hasSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(datetimeLocalValue)
  return hasSeconds ? datetimeLocalValue : `${datetimeLocalValue}:00`
}

export function formatCountdown(msRemaining: number): string {
  if (msRemaining <= 0) return 'Ended'
  const totalSeconds = Math.floor(msRemaining / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  parts.push(`${hours.toString().padStart(2, '0')}h`)
  parts.push(`${minutes.toString().padStart(2, '0')}m`)
  parts.push(`${seconds.toString().padStart(2, '0')}s`)
  return parts.join(' ')
}
