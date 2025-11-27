import React, { useEffect, useState } from 'react'
import { getEmployees, addEmployee } from '../api'

export default function Employees() {
  const [emps, setEmps] = useState([])
  const [form, setForm] = useState({ name: '', role: '', email: '' })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getEmployees()
      setEmps(data)
    } catch (e) {
      setEmps([])
      console.error('Failed to load employees', e)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function submit(e) {
    e.preventDefault()
    if (!form.name.trim()) return alert("Name is required")
    try {
      await addEmployee(form)
      setForm({ name: '', role: '', email: '' })
      await load()
    } catch (err) {
      alert('Add failed')
      console.error(err)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this employee?')) return
    try {
      const API = import.meta.env.VITE_API || 'http://localhost:5000'
      const res = await fetch(`${API}/employees/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('delete failed')
      await load()
    } catch (err) {
      alert('Delete failed')
      console.error(err)
    }
  }

  return (
    <div>
      <h2>Employees</h2>

      <form onSubmit={submit} className="form" aria-label="add-employee-form">
        <input placeholder="Name" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />

        <input placeholder="Role" value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })} />

        <input placeholder="Email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />

        <button type="submit">Add</button>
      </form>

      {loading ? <p>Loading…</p> : (
        <ul className="list">
          {emps.length === 0 && <li className="card">No employees yet — add one above.</li>}
          {emps.map(e => (
            <li key={e.id} className="card emp-card" aria-label={`employee-${e.id}`}>
              <div>
                <div className="card-title">{e.name}</div>
                <div className="muted">{e.role} • {e.email}</div>
              </div>
              <div className="card-actions">
                <button className="btn-delete" onClick={() => handleDelete(e.id)} title="Delete employee">🗑</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
