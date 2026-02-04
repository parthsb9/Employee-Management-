export default function StatusBadge({ status }) {
  const map = {
    ACTIVE: 'success',
    ON_LEAVE: 'warning',
    TERMINATED: 'secondary'
  }
  const color = map[status] || 'secondary'
  return <span className={`badge bg-${color}`}>{status}</span>
}