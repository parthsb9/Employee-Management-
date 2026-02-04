import { useEffect, useState } from 'react'
import { api, notify } from '../api'

export default function EmployeeTable({ onEdit }) {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')

  const fetchData = async () => {
    try {
      const params = { page, page_size: pageSize }
      if (search) params.search = search
      if (department) params.department = department
      if (status) params.status = status
      const { data } = await api.get('/employees', { params })
      setItems(data.items)
      setTotal(data.total)
    } catch (err) {
      notify('Failed to load employees', 'error')
    }
  }

  useEffect(() => { fetchData() }, [page, pageSize, search, department, status])

  const onDelete = async (id) => {
    if (!confirm('Delete this employee?')) return
    try {
      await api.delete(`/employees/${id}`)
      notify('Deleted', 'success')
      fetchData()
    } catch {
      notify('Delete failed', 'error')
    }
  }

  const totalPages = Math.ceil(total / pageSize) || 1

  return (
    <div className="card">
      <div className="card-body">
        <div className="row g-2 mb-3">
          <div className="col-md-4">
            <input className="form-control" placeholder="Search name/email..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Filter by department"
              value={department} onChange={e => setDepartment(e.target.value)} />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">Status: All</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="ON_LEAVE">ON_LEAVE</option>
              <option value="TERMINATED">TERMINATED</option>
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
              {[5,10,20,50].map(n => <option key={n} value={n}>{n} / page</option>)}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Email</th><th>Dept</th><th>Title</th><th>Status</th><th>Joined</th><th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.first_name} {e.last_name}</td>
                  <td>{e.email}</td>
                  <td>{e.department || '-'}</td>
                  <td>{e.title || '-'}</td>
                  <td><span className="badge bg-secondary">{e.status}</span></td>
                  <td>{e.date_joined}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(e)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(e.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan="8" className="text-center py-4">No employees found.</td></tr>}
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