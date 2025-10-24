import { useState, useEffect } from 'react';
import employeeService from '../services/employeeService';
import EmployeeForm from './EmployeeForm';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [statuses, setStatuses] = useState(['Active', 'Inactive', 'On Leave']);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getAllEmployees();
      setEmployees(response.data);
      
      // Extract unique departments
      const uniqueDepartments = [...new Set(response.data.map(emp => emp.department))];
      setDepartments(uniqueDepartments);
    } catch (err) {
      setError('Failed to load employees. Make sure the backend is running.');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    // Filter by search term (name or email)
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.position && emp.position.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by department
    if (departmentFilter) {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(emp => emp.status === statusFilter);
    }

    setFilteredEmployees(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.deleteEmployee(id);
        loadEmployees();
      } catch (err) {
        alert('Failed to delete employee');
        console.error('Error deleting employee:', err);
      }
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEmployee(null);
    loadEmployees();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setStatusFilter('');
  };

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="employee-list-container">
      <div className="header">
        <h1>Employee Management System</h1>
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add New Employee
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-box">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {(searchTerm || departmentFilter || statusFilter) && (
          <button className="btn btn-secondary" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="results-info">
        Showing {filteredEmployees.length} of {employees.length} employees
      </div>

      {/* Employee Table */}
      {filteredEmployees.length === 0 ? (
        <div className="no-results">No employees found</div>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.firstName} {employee.lastName}</td>
                <td>{employee.email}</td>
                <td>{employee.phone || '-'}</td>
                <td>{employee.department}</td>
                <td>{employee.position || '-'}</td>
                <td>${employee.salary ? employee.salary.toLocaleString() : '0'}</td>
                <td>
                  <span className={`status-badge status-${employee.status?.toLowerCase().replace(' ', '-')}`}>
                    {employee.status || 'Active'}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => handleEdit(employee)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(employee.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Employee Form Modal */}
      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default EmployeeList;
