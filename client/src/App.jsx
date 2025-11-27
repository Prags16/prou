import React, { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Tasks from './pages/Tasks'
import './index.css'

export default function App() {
  const [view, setView] = useState('dashboard')

  return (
    <div className="app">
      <header className="nav">
        <div className="nav-left">
          <h1 className="brand">ProU Mini</h1>
          <div className="brand-sub">Employees · Tasks</div>
        </div>

        <div className="nav-buttons">
          <button className={view==='dashboard'? 'active': ''} onClick={() => setView('dashboard')}>Dashboard</button>
          <button className={view==='employees'? 'active': ''} onClick={() => setView('employees')}>Employees</button>
          <button className={view==='tasks'? 'active': ''} onClick={() => setView('tasks')}>Tasks</button>
        </div>
      </header>

      <main className="container">
        {view === 'dashboard' && <Dashboard />}
        {view === 'employees' && <Employees />}
        {view === 'tasks' && <Tasks />}
      </main>

      <footer className="footer">
        <small>Built for ProU assessment • Pragnya Neerukonda</small>
      </footer>
    </div>
  )
}
