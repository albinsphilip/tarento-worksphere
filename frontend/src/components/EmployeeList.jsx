import { useState, useEffect } from 'react';
import employeeService from '../services/employeeService';
import EmployeeForm from './EmployeeForm';
import EmployeeDetails from './EmployeeDetails';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  // Details modal state
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [statuses, setStatuses] = useState(['Active', 'Inactive', 'On Leave']);

  // Sorting state
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterAndSortEmployees();
  }, [employees, searchTerm, departmentFilter, statusFilter, sortField, sortDirection]);

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

    // Filter by search term (name, email, position, or ID)
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.id.toString().includes(searchTerm) ||
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

    return filtered;
  };

  const sortEmployees = (employeesToSort) => {
    return [...employeesToSort].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      // Convert to strings for comparison if needed
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const filterAndSortEmployees = () => {
    const filtered = filterEmployees();
    const sorted = sortEmployees(filtered);
    setFilteredEmployees(sorted);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with ascending direction
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
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

  const handleRowClick = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setShowDetails(true);
  };

  const handleDetailsClose = () => {
    setShowDetails(false);
    setSelectedEmployeeId(null);
  };

  const handleDetailsEdit = (employee) => {
    setShowDetails(false);
    setSelectedEmployeeId(null);
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
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
            placeholder="Search by ID, name, email, or position..."
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
        <span>Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredEmployees.length)} of {filteredEmployees.length} employees</span>
        <div className="items-per-page">
          <label>Show: </label>
          <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="info-text">Click on any row to view details</span>
        </div>
      </div>

      {/* Employee Table */}
      {filteredEmployees.length === 0 ? (
        <div className="no-results">No employees found</div>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="sortable">
                ID {getSortIcon('id')}
              </th>
              <th onClick={() => handleSort('firstName')} className="sortable">
                Name {getSortIcon('firstName')}
              </th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email {getSortIcon('email')}
              </th>
              <th onClick={() => handleSort('phone')} className="sortable">
                Phone {getSortIcon('phone')}
              </th>
              <th onClick={() => handleSort('department')} className="sortable">
                Department {getSortIcon('department')}
              </th>
              <th onClick={() => handleSort('position')} className="sortable">
                Position {getSortIcon('position')}
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                Status {getSortIcon('status')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map(employee => (
              <tr key={employee.id} onClick={() => handleRowClick(employee.id)} className="clickable-row">
                <td>{employee.id}</td>
                <td>{employee.firstName} {employee.lastName}</td>
                <td>{employee.email}</td>
                <td>{employee.phone || '-'}</td>
                <td>{employee.department}</td>
                <td>{employee.position || '-'}</td>
                <td>
                  <span className={`status-badge status-${employee.status?.toLowerCase().replace(' ', '-')}`}>
                    {employee.status || 'Active'}
                  </span>
                </td>
                <td className="actions" onClick={(e) => e.stopPropagation()}>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            « Previous
          </button>
          
          <div className="pagination-numbers">
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show first page, last page, current page, and pages around current
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return <span key={pageNumber} className="pagination-ellipsis">...</span>;
              }
              return null;
            })}
          </div>

          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next »
          </button>
        </div>
      )}

      {/* Employee Form Modal */}
      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={handleFormClose}
        />
      )}

      {/* Employee Details Modal */}
      {showDetails && (
        <EmployeeDetails
          employeeId={selectedEmployeeId}
          onClose={handleDetailsClose}
          onEdit={handleDetailsEdit}
        />
      )}
    </div>
  );
};

export default EmployeeList;
