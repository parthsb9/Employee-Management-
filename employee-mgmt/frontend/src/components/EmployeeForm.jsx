import { useState, useEffect } from 'react'
import { api, notify } from '../api'

const defaultForm = {
  first_name: '', last_name: '', email: '', phone: '',
  department: '', title: '', date_joined: '',
  salary: '', status: 'ACTIVE'
}

export default function EmployeeForm({ selected, onSaved, onCancel }) {
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selected) {
      setForm({
        ...defaultForm,
        ...selected,
        date_joined: selected.date_joined?.slice(0,10) || ''
      })
    } else {
      setForm(defaultForm)
    }
  }, [selected])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (selected?.id) {
        await api.put(`/employees/${selected.id}`, {
          ...form,
          salary: form.salary ? Number(form.salary) : null
        })
        notify('Employee updated', 'success')
      } else {
        await api.post('/employees', {
          ...form,
          salary: form.salary ? Number(form.salary) : null
        })
        notify('Employee created', 'success')
      }
      onSaved?.()
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to save'
      notify(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card card-body">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">First Name</label>
          <input className="form-control" name="first_name" value={form.first_name} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Last Name</label>
          <input className="form-control" name="last_name" value={form.last_name} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Phone</label>
          <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Department</label>
          <input className="form-control" name="department" value={form.department} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Title</label>
          <input className="form-control" name="title" value={form.title} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Date Joined</label>
          <input type="date" className="form-control" name="date_joined" value={form.date_joined} onChange={handleChange} required />
        </div>
        <div className="col-md-3">
          <label className="form-label">Salary</label>
          <input type="number" step="0.01" className="form-control" name="salary" value={form.salary} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Status</label>
          <select className="form-select" name="status" value={form.status} onChange={handleChange}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="ON_LEAVE">ON_LEAVE</option>
            <option value="TERMINATED">TERMINATED</option>
          </select>
        </div>
      </div>
      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-primary" disabled={loading}>{selected ? 'Update' : 'Create'}</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}