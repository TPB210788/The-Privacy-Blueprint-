export function isOverdue(lastReviewed: string): boolean {
  if (!lastReviewed) return false
  const reviewDate = new Date(lastReviewed)
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1)
  return reviewDate < twelveMonthsAgo
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  const [year, month, day] = dateStr.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`
}

export function exportToCSV(
  rows: Record<string, string>[],
  filename: string,
): void {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const esc = (v: string) =>
    v.includes(',') || v.includes('"') || v.includes('\n')
      ? `"${v.replace(/"/g, '""')}"`
      : v

  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => esc(r[h] ?? '')).join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}
