import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { employeesApi } from '../api'
import StatusBadge from '../components/StatusBadge'
import { useToast } from '../ui/ToastProvider'
import { fmtDate } from '../utils/format'

const DEBOUNCE_MS = 400

export default function EmployeesPage() {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)

  // filters & paging
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')

  // client-side sorting (column + direction)
  const [sortBy, setSortBy] = useState({ col: 'id', dir: 'asc' })

  // Debounce the search text
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [search])

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = { page, page_size: pageSize }
      if (debouncedSearch) params.search = debouncedSearch
      if (department) params.department = department
      if (status) params.status = status
      const data = await employeesApi.list(params)
      setItems(data.items || [])
      setTotal(data.total || 0)
    } catch (e) {
      addToast('Failed to load employees', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, debouncedSearch, department, status])

  const onDelete = async (id) => {
    if (!confirm('Delete this employee?')) return
    try {
      await employeesApi.remove(id)
      addToast('Deleted employee', 'success')
      fetchData()
    } catch {
      addToast('Delete failed', 'error')
    }
  }

  const totalPages = Math.ceil(total / pageSize) || 1

  const sortedItems = useMemo(() => {
    const arr = [...items]
    arr.sort((a, b) => {
      const { col, dir } = sortBy
      const v1 = a[col] ?? ''
      const v2 = b[col] ?? ''
      if (v1 < v2) return dir === 'asc' ? -1 : 1
      if (v1 > v2) return dir === 'asc' ? 1 : -1
      return 0
    })
    return arr
  }, [items, sortBy])

  const setSort = (col) => {
    setSortBy((s) => {
      if (s.col === col) return { col, dir: s.dir === 'asc' ? 'desc' : 'asc' }
      return { col, dir: 'asc' }
    })
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0">Employees</h4>
          <Link className="btn btn-success" to="/employees/new">+ Add Employee</Link>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Search name/email..."
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value) }}
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Filter by department"
              value={department}
              onChange={(e) => { setPage(1); setDepartment(e.target.value) }}
            />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value) }}>
              <option value="">Status: All</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ON_LEAVE">ON_LEAVE</option>
              <option value="TERMINATED">TERMINATED</option>
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={pageSize} onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)) }}>
              {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n} / page</option>)}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <Th label="#" col="id" sortBy={sortBy} setSort={setSort} />
                <Th label="Name" col="first_name" sortBy={sortBy} setSort={setSort} />
                <Th label="Email" col="email" sortBy={sortBy} setSort={setSort} />
                <Th label="Dept" col="department" sortBy={sortBy} setSort={setSort} />
                <Th label="Title" col="title" sortBy={sortBy} setSort={setSort} />
                <Th label="Status" col="status" sortBy={sortBy} setSort={setSort} />
                <Th label="Joined" col="date_joined" sortBy={sortBy} setSort={setSort} />
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="8" className="text-center py-4">
                  <div className="spinner-border text-secondary" role="status"><span className="visually-hidden">Loading...</span></div>
                </td></tr>
              )}
              {!loading && sortedItems.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.first_name} {e.last_name}</td>
                  <td>{e.email}</td>
                  <td>{e.department || '-'}</td>
                  <td>{e.title || '-'}</td>
                  <td><StatusBadge status={e.status} /></td>
                  <td>{fmtDate(e.date_joined)}</td>
                  <td className="text-end">
                    <Link className="btn btn-sm btn-outline-primary me-2" to={`/employees/${e.id}`}>Edit</Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(e.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!loading && !sortedItems.length && (
                <tr><td colSpan="8" className="text-center py-4">No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div>Showing page {page} of {totalPages} (Total: {total})</div>
          <div className="btn-group">
            <button className="btn btn-outline-secondary" disabled={page<=1} onClick={() => setPage(p => p-1)}>Prev</button>
            <button className="btn btn-outline-secondary" disabled={page>=totalPages} onClick={() => setPage(p => p+1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Th({ label, col, sortBy, setSort }) {
  const active = sortBy.col === col
  const icon = !active ? '' : sortBy.dir === 'asc' ? '▲' : '▼'
  return (
    <th role="button" onClick={() => setSort(col)}>
      {label} {icon}
    </th>
  )
}