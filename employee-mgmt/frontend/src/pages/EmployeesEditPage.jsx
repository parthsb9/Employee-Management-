import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { employeesApi } from '../api'
import { useToast } from '../ui/ToastProvider'

const defaultForm = {
  first_name: '', last_name: '', email: '', phone: '',
  department: '', title: '', date_joined: '',
  salary: '', status: 'ACTIVE'
}

export default function EmployeeEditPage({ mode }) {
  const { id } = useParams()
  const isEdit = mode === 'edit'
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isEdit) return
    (async () => {
      try {
        const emp = await employeesApi.get(id)
        setForm({
          ...defaultForm,
          ...emp,
          date_joined: emp.date_joined?.slice(0, 10) || ''
        })
      } catch {
        addToast('Failed to load employee', 'error')
        navigate('/employees')
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit])

  const validate = () => {
    const e = {}
    if (!form.first_name.trim()) e.first_name = 'Required'
    if (!form.last_name.trim()) e.last_name = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.date_joined) e.date_joined = 'Required'
    if (form.salary !== '' && Number(form.salary) < 0) e.salary = 'Must be ≥ 0'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const payload = { ...form, salary: form.salary === '' ? null : Number(form.salary) }
      if (isEdit) {
        await employeesApi.update(id, payload)
        addToast('Employee updated', 'success')
      } else {
        await employeesApi.create(payload)
        addToast('Employee created', 'success')
      }
      navigate('/employees')
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to save'
      addToast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-5">
      <div className="spinner-border text-secondary" role="status"><span className="visually-hidden">Loading...</span></div>
    </div>
  }

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="mb-3">{isEdit ? 'Edit Employee' : 'Add Employee'}</h4>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <Input label="First Name" name="first_name" value={form.first_name} onChange={handleChange} error={errors.first_name} required />
            <Input label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} error={errors.last_name} required />
            <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} required />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Input label="Department" name="department" value={form.department} onChange={handleChange} />
            <Input label="Title" name="title" value={form.title} onChange={handleChange} />
            <Input label="Date Joined" type="date" name="date_joined" value={form.date_joined} onChange={handleChange} error={errors.date_joined} required />
            <Input label="Salary" type="number" step="0.01" name="salary" value={form.salary} onChange={handleChange} error={errors.salary} />
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
            <button className="btn btn-primary" disabled={saving}>{isEdit ? 'Update' : 'Create'}</button>
            <button type="button" className="btn btn-secondary" onClick={() => history.back()}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Input({ label, error, required, ...rest }) {
  return (
    <div className="col-md-6">
      <label className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input className={`form-control ${error ? 'is-invalid' : ''}`} {...rest} />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  )
}