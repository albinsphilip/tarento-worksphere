import { useState, useEffect } from 'react';
import employeeService from '../services/employeeService';
import './Dashboard.css';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getAllEmployees();
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to load employees');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Simple calculations
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  const onLeaveEmployees = employees.filter(emp => emp.status === 'On Leave').length;
  const inactiveEmployees = employees.filter(emp => emp.status === 'Inactive').length;

  // Get unique departments
  const departments = [...new Set(employees.map(emp => emp.department))];

  return (
    <div className="simple-dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <p className="stat-number">{totalEmployees}</p>
        </div>
        
        <div className="stat-card">
          <h3>Active</h3>
          <p className="stat-number">{activeEmployees}</p>
        </div>
        
        <div className="stat-card">
          <h3>On Leave</h3>
          <p className="stat-number">{onLeaveEmployees}</p>
        </div>
        
        <div className="stat-card">
          <h3>Inactive</h3>
          <p className="stat-number">{inactiveEmployees}</p>
        </div>
      </div>

      <div className="departments-section">
        <h2>Departments</h2>
        <div className="departments-list">
          {departments.map(dept => {
            const deptCount = employees.filter(emp => emp.department === dept).length;
            return (
              <div key={dept} className="dept-item">
                <span className="dept-name">{dept}</span>
                <span className="dept-count">{deptCount} employees</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
