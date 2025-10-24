import { useState } from 'react'
import Dashboard from './components/Dashboard'
import EmployeeList from './components/EmployeeList'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState('dashboard')

  return (
    <div className="App">
      <div className="admin-container">
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>🏢 WorkSphere</h2>
            <p>Admin Panel</p>
          </div>
          
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveView('dashboard')}
            >
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </button>
            
            <button 
              className={`nav-item ${activeView === 'employees' ? 'active' : ''}`}
              onClick={() => setActiveView('employees')}
            >
              <span className="nav-icon">👥</span>
              <span>Employees</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <p>© 2025 WorkSphere</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {activeView === 'dashboard' ? <Dashboard /> : <EmployeeList />}
        </main>
      </div>
    </div>
  )
}

export default App
