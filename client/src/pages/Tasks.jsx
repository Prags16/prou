import React, { useEffect, useState } from 'react'
import { getTasks, addTask, getEmployees } from '../api'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [emps, setEmps] = useState([])
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '' })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [t, e] = await Promise.all([getTasks(), getEmployees()])
      setTasks(t || [])
      setEmps(e || [])
    } catch (err) {
      setTasks([]); setEmps([])
      console.error('Failed to load tasks/employees', err)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function submit(e) {
    e.preventDefault()
    if (!form.title.trim()) return alert("Title is required")
    const payload = {
      title: form.title,
      description: form.description,
      assignedTo: form.assignedTo ? Number(form.assignedTo) : null
    }
    try {
      await addTask(payload)
      setForm({ title: '', description: '', assignedTo: '' })
      await load()
    } catch (err) {
      alert('Create task failed')
      console.error(err)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this task?')) return
    try {
      const API = import.meta.env.VITE_API || 'http://localhost:5000'
      const res = await fetch(`${API}/tasks/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('delete failed')
      await load()
    } catch (err) {
      alert('Delete failed')
      console.error(err)
    }
  }

  return (
    <div>
      <h2>Tasks</h2>

      <form onSubmit={submit} className="form" aria-label="add-task-form">
        <input placeholder="Title" value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} />

        <input placeholder="Description" value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} />

        <select value={form.assignedTo}
          onChange={e => setForm({ ...form, assignedTo: e.target.value })}>
          <option value="">Assign (optional)</option>
          {emps.map(em => <option key={em.id} value={em.id}>{em.name}</option>)}
        </select>

        <button type="submit">Create Task</button>
      </form>

      {loading ? <p>Loading…</p> : (
        <ul className="list">
          {tasks.length === 0 && <li className="card">No tasks yet — create one above.</li>}
          {tasks.map(t => {
            // compute assignedName in a simple, compatible way so editors don't complain
            const emp = emps.find(e => String(e.id) === String(t.assignedTo))
            const assignedName = (t && t.assigned_name) ? t.assigned_name : (emp ? emp.name : '—')

            return (
              <li key={t.id} className="card task-card" aria-label={`task-${t.id}`}>
                <div className="card-left">
                  <div className="card-title">{t.title}</div>
                  <div className="muted">{t.description}</div>
                  <div className="muted small">
                    Status: <span className={`badge badge-${t.status || 'todo'}`}>{t.status || 'todo'}</span>
                  </div>

                  <div className="muted small">
                    Assigned: {assignedName}
                  </div>
                </div>
                <div className="card-actions">
                  <button className="btn-delete" onClick={() => handleDelete(t.id)} title="Delete task">🗑</button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
