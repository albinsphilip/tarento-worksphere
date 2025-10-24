import { useState, useEffect } from 'react';
import employeeService from '../services/employeeService';
import './EmployeeDetails.css';

const EmployeeDetails = ({ employeeId, onClose, onEdit }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEmployeeDetails();
  }, [employeeId]);

  const loadEmployeeDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getEmployeeById(employeeId);
      setEmployee(response.data);
    } catch (err) {
      setError('Failed to load employee details');
      console.error('Error loading employee details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (amount) => {
    if (!amount) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="details-modal-overlay">
        <div className="details-modal-content">
          <div className="loading">Loading employee details...</div>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="details-modal-overlay">
        <div className="details-modal-content">
          <div className="error">{error || 'Employee not found'}</div>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="details-modal-overlay" onClick={onClose}>
      <div className="details-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="details-header">
          <div className="details-header-content">
            <div className="employee-avatar">
              {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
            </div>
            <div className="employee-title">
              <h2>{employee.firstName} {employee.lastName}</h2>
              <p className="employee-position">{employee.position} • {employee.department}</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="details-body">
          {/* Contact Information */}
          <section className="detail-section">
            <h3>Contact Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{employee.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{employee.phone || '-'}</span>
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Address</span>
                <span className="detail-value">{employee.address || '-'}</span>
              </div>
            </div>
          </section>

          {/* Employment Details */}
          <section className="detail-section">
            <h3>Employment Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Employee ID</span>
                <span className="detail-value">#{employee.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Department</span>
                <span className="detail-value">{employee.department}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Position</span>
                <span className="detail-value">{employee.position}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Hire Date</span>
                <span className="detail-value">{formatDate(employee.hireDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className={`status-badge status-${employee.status?.toLowerCase().replace(' ', '-')}`}>
                  {employee.status || 'Active'}
                </span>
              </div>
            </div>
          </section>

          {/* Salary Information */}
          <section className="detail-section salary-section">
            <h3>💰 Salary Information</h3>
            <div className="salary-card">
              <div className="salary-amount">
                <span className="salary-label">Annual Salary</span>
                <span className="salary-value">{formatSalary(employee.salary)}</span>
              </div>
              <div className="salary-breakdown">
                <div className="salary-breakdown-item">
                  <span>Monthly</span>
                  <strong>{formatSalary(employee.salary / 12)}</strong>
                </div>
                <div className="salary-breakdown-item">
                  <span>Per Day</span>
                  <strong>{formatSalary(employee.salary / 365)}</strong>
                </div>
              </div>
            </div>
          </section>

          {/* Leave Information */}
          <section className="detail-section leave-section">
            <h3>🏖️ Leave Management</h3>
            <div className="leave-cards">
              <div className="leave-card">
                <div className="leave-icon">✅</div>
                <div className="leave-info">
                  <span className="leave-label">Available Leave</span>
                  <span className="leave-value">{employee.leaveBalance || 20} days</span>
                </div>
              </div>
              <div className="leave-card">
                <div className="leave-icon">📅</div>
                <div className="leave-info">
                  <span className="leave-label">Leaves Taken</span>
                  <span className="leave-value">{employee.leavesTaken || 0} days</span>
                </div>
              </div>
              <div className="leave-card">
                <div className="leave-icon">🎯</div>
                <div className="leave-info">
                  <span className="leave-label">Total Annual Leave</span>
                  <span className="leave-value">{(employee.leaveBalance || 20) + (employee.leavesTaken || 0)} days</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="details-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={() => onEdit(employee)}>
            Edit Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
