export const fmtDate = (s) => {
  if (!s) return '-'
  try {
    const d = new Date(s)
    if (Number.isNaN(d.getTime())) return s
    return d.toISOString().slice(0, 10)
  } catch { return s }
}