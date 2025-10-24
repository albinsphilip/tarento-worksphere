import { useState, useEffect } from 'react';
import employeeService from '../services/employeeService';
import './Dashboard.css';

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getStatistics();
      setStatistics(response.data);
    } catch (err) {
      setError('Failed to load statistics');
      console.error('Error loading statistics:', err);
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

  if (!statistics) {
    return null;
  }

  const formatSalary = (amount) => {
    if (!amount) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="subtitle">Real-time employee management insights</p>
        </div>
        <button className="refresh-btn" onClick={loadStatistics}>
          🔄 Refresh
        </button>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-header">
            <div className="metric-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <span className="metric-label">Total Workforce</span>
          </div>
          <div className="metric-value">{statistics.totalEmployees}</div>
          <div className="metric-footer">employees</div>
        </div>

        <div className="metric-card success">
          <div className="metric-header">
            <div className="metric-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <span className="metric-label">Active Now</span>
          </div>
          <div className="metric-value">{statistics.statusBreakdown?.Active || 0}</div>
          <div className="metric-footer">
            {((statistics.statusBreakdown?.Active / statistics.totalEmployees) * 100).toFixed(0)}% of total
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-header">
            <div className="metric-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <span className="metric-label">On Leave</span>
          </div>
          <div className="metric-value">{statistics.statusBreakdown?.['On Leave'] || 0}</div>
          <div className="metric-footer">employees away</div>
        </div>

        <div className="metric-card danger">
          <div className="metric-header">
            <div className="metric-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <span className="metric-label">Inactive</span>
          </div>
          <div className="metric-value">{statistics.statusBreakdown?.Inactive || 0}</div>
          <div className="metric-footer">employees</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-grid">
        {/* Left Column - Financial Stats */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>💰 Financial Overview</h2>
          </div>
          
          <div className="financial-stats">
            <div className="financial-item total-payroll">
              <div className="financial-label">Total Annual Payroll</div>
              <div className="financial-amount">{formatSalary(statistics.totalSalary)}</div>
              <div className="financial-sublabel">
                {statistics.totalEmployees} employees
              </div>
            </div>

            <div className="financial-divider"></div>

            <div className="financial-item avg-salary">
              <div className="financial-label">Average Salary</div>
              <div className="financial-amount">{formatSalary(statistics.averageSalary)}</div>
              <div className="financial-sublabel">per employee/year</div>
            </div>

            <div className="financial-divider"></div>

            <div className="financial-item monthly-cost">
              <div className="financial-label">Monthly Cost</div>
              <div className="financial-amount">
                {formatSalary(Math.round(statistics.totalSalary / 12))}
              </div>
              <div className="financial-sublabel">estimated payroll</div>
            </div>
          </div>

          <div className="recent-hires-card">
            <div className="recent-hires-icon">📅</div>
            <div className="recent-hires-content">
              <div className="recent-hires-number">{statistics.recentHires}</div>
              <div className="recent-hires-label">New Hires (Last 30 Days)</div>
            </div>
          </div>
        </div>

        {/* Right Column - Department & Status */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>📊 Department Distribution</h2>
          </div>
          
          <div className="department-list">
            {Object.entries(statistics.departmentBreakdown || {})
              .sort(([, a], [, b]) => b - a)
              .map(([dept, count]) => {
                const percentage = ((count / statistics.totalEmployees) * 100).toFixed(1);
                return (
                  <div key={dept} className="dept-item">
                    <div className="dept-info">
                      <span className="dept-name">{dept}</span>
                      <span className="dept-count">{count}</span>
                    </div>
                    <div className="dept-bar-wrapper">
                      <div className="dept-bar">
                        <div 
                          className="dept-bar-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="dept-percentage">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="status-distribution">
            <div className="status-title">Employee Status</div>
            <div className="status-chart">
              {statistics.statusBreakdown?.Active > 0 && (
                <div 
                  className="status-segment active"
                  style={{ 
                    width: `${(statistics.statusBreakdown.Active / statistics.totalEmployees) * 100}%` 
                  }}
                  title={`Active: ${statistics.statusBreakdown.Active}`}
                ></div>
              )}
              {statistics.statusBreakdown?.['On Leave'] > 0 && (
                <div 
                  className="status-segment leave"
                  style={{ 
                    width: `${(statistics.statusBreakdown['On Leave'] / statistics.totalEmployees) * 100}%` 
                  }}
                  title={`On Leave: ${statistics.statusBreakdown['On Leave']}`}
                ></div>
              )}
              {statistics.statusBreakdown?.Inactive > 0 && (
                <div 
                  className="status-segment inactive"
                  style={{ 
                    width: `${(statistics.statusBreakdown.Inactive / statistics.totalEmployees) * 100}%` 
                  }}
                  title={`Inactive: ${statistics.statusBreakdown.Inactive}`}
                ></div>
              )}
            </div>
            <div className="status-labels">
              <div className="status-label">
                <span className="status-dot active"></span>
                Active ({statistics.statusBreakdown?.Active || 0})
              </div>
              <div className="status-label">
                <span className="status-dot leave"></span>
                On Leave ({statistics.statusBreakdown?.['On Leave'] || 0})
              </div>
              <div className="status-label">
                <span className="status-dot inactive"></span>
                Inactive ({statistics.statusBreakdown?.Inactive || 0})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
