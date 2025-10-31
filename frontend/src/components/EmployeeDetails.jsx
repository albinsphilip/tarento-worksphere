import './EmployeeDetails.css';

const EmployeeDetails = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <div className="modal-overlay">
      <div className="employee-details-modal">
        <div className="modal-header">
          <h2>Employee Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="details-content">
          <div className="detail-row">
            <span className="label">Name:</span>
            <span className="value">{employee.firstName} {employee.lastName}</span>
          </div>
          <div className="detail-row">
            <span className="label">Email:</span>
            <span className="value">{employee.email}</span>
          </div>
          <div className="detail-row">
            <span className="label">Phone:</span>
            <span className="value">{employee.phone || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Department:</span>
            <span className="value">{employee.department}</span>
          </div>
          <div className="detail-row">
            <span className="label">Position:</span>
            <span className="value">{employee.position || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Salary:</span>
            <span className="value">₹{employee.salary?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="label">Hire Date:</span>
            <span className="value">{employee.hireDate}</span>
          </div>
          <div className="detail-row">
            <span className="label">Status:</span>
            <span className="value">{employee.status || 'Active'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;