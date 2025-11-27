import React, { useEffect, useState } from 'react'
import { getEmployees, getTasks } from '../api'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#f59e0b', '#2563eb', '#10b981'] // todo, inprogress, done

export default function Dashboard(){
  const [emps, setEmps] = useState([])
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    let mounted = true
    async function load(){
      try{
        const [e, t] = await Promise.all([getEmployees(), getTasks()])
        if(!mounted) return
        setEmps(e || [])
        setTasks(t || [])
      }catch(err){
        console.error('dashboard load', err)
        if(mounted) { setEmps([]); setTasks([]) }
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const doneCount = tasks.filter(x => x.status === 'done').length
  const inProg = tasks.filter(x => x.status === 'inprogress').length
  const todo = tasks.filter(x => !x.status || x.status === 'todo').length

  const data = [
    { name: 'Todo', value: todo },
    { name: 'In Progress', value: inProg },
    { name: 'Done', value: doneCount }
  ]

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="stats-grid" style={{alignItems:'stretch'}}>
        <div className="stat-card">
          <div className="stat-number">{emps.length}</div>
          <div className="stat-label">Employees</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{tasks.length}</div>
          <div className="stat-label">Total tasks</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{doneCount}</div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{inProg}</div>
          <div className="stat-label">In progress</div>
        </div>
      </div>

      <div style={{display:'flex', gap:18, marginTop:18, flexWrap:'wrap'}}>
        <div style={{minWidth:260, flex:1, background:'#fff', padding:14, borderRadius:12, border:'1px solid #eee'}}>
          <h4 style={{marginTop:0}}>Tasks distribution</h4>
          <div style={{height:220}}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} innerRadius={60} outerRadius={90} dataKey="value" label>
                  {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{flex:1, minWidth:300}}>
          <h4 style={{marginTop:0}}>Quick lists</h4>
          <div className="quick-list">
            <div className="quick-left">
              <h4>Recent employees</h4>
              <ul className="mini-list">
                {emps.slice(-5).reverse().map(e => (<li key={e.id}>{e.name} <span className="muted">• {e.role}</span></li>))}
                {emps.length===0 && <li className="muted">No employees yet</li>}
              </ul>
            </div>
            <div className="quick-right">
              <h4>Recent tasks</h4>
              <ul className="mini-list">
                {tasks.slice(-6).reverse().map(t => (
                  <li key={t.id}>
                    <strong>{t.title}</strong>
                    <div className="muted small">{t.description || '—'}</div>
                  </li>
                ))}
                {tasks.length===0 && <li className="muted">No tasks yet</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
