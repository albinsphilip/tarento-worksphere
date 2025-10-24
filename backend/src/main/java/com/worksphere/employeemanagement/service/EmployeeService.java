package com.worksphere.employeemanagement.service;

import com.worksphere.employeemanagement.exception.ResourceNotFoundException;
import com.worksphere.employeemanagement.model.Employee;
import com.worksphere.employeemanagement.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    // Get all employees
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Get employee by ID
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    // Create new employee
    @Transactional
    public Employee createEmployee(Employee employee) {
        // Check if email already exists
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + employee.getEmail());
        }
        return employeeRepository.save(employee);
    }

    // Update employee
    @Transactional
    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = getEmployeeById(id);

        // Check if email is being changed and if it already exists
        if (!employee.getEmail().equals(employeeDetails.getEmail()) &&
            employeeRepository.existsByEmail(employeeDetails.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + employeeDetails.getEmail());
        }

        employee.setFirstName(employeeDetails.getFirstName());
        employee.setLastName(employeeDetails.getLastName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setPhone(employeeDetails.getPhone());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setPosition(employeeDetails.getPosition());
        employee.setSalary(employeeDetails.getSalary());
        employee.setHireDate(employeeDetails.getHireDate());
        employee.setStatus(employeeDetails.getStatus());
        employee.setAddress(employeeDetails.getAddress());

        return employeeRepository.save(employee);
    }

    // Delete employee
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }

    // Search employees by name or email
    public List<Employee> searchEmployees(String searchTerm) {
        return employeeRepository.searchByName(searchTerm);
    }

    // Filter by department
    public List<Employee> getEmployeesByDepartment(String department) {
        return employeeRepository.findByDepartment(department);
    }

    // Filter by status
    public List<Employee> getEmployeesByStatus(String status) {
        return employeeRepository.findByStatus(status);
    }

    // Advanced search with multiple filters
    public List<Employee> searchWithFilters(String searchTerm, String department, String status) {
        return employeeRepository.searchWithFilters(searchTerm, department, status);
    }

    // Get statistics for dashboard
    public Map<String, Object> getStatistics() {
        List<Employee> allEmployees = employeeRepository.findAll();
        Map<String, Object> stats = new HashMap<>();

        // Total employees
        stats.put("totalEmployees", allEmployees.size());

        // Count by status
        long activeCount = allEmployees.stream()
                .filter(e -> "Active".equalsIgnoreCase(e.getStatus()))
                .count();
        long inactiveCount = allEmployees.stream()
                .filter(e -> "Inactive".equalsIgnoreCase(e.getStatus()))
                .count();
        long onLeaveCount = allEmployees.stream()
                .filter(e -> "On Leave".equalsIgnoreCase(e.getStatus()))
                .count();

        Map<String, Long> statusBreakdown = new HashMap<>();
        statusBreakdown.put("Active", activeCount);
        statusBreakdown.put("Inactive", inactiveCount);
        statusBreakdown.put("On Leave", onLeaveCount);
        stats.put("statusBreakdown", statusBreakdown);

        // Count by department
        Map<String, Long> departmentBreakdown = allEmployees.stream()
                .collect(Collectors.groupingBy(
                        Employee::getDepartment,
                        Collectors.counting()
                ));
        stats.put("departmentBreakdown", departmentBreakdown);

        // Salary statistics
        if (!allEmployees.isEmpty()) {
            double avgSalary = allEmployees.stream()
                    .filter(e -> e.getSalary() != null)
                    .mapToDouble(Employee::getSalary)
                    .average()
                    .orElse(0.0);
            
            double totalSalary = allEmployees.stream()
                    .filter(e -> e.getSalary() != null)
                    .mapToDouble(Employee::getSalary)
                    .sum();

            stats.put("averageSalary", Math.round(avgSalary * 100.0) / 100.0);
            stats.put("totalSalary", Math.round(totalSalary * 100.0) / 100.0);
        } else {
            stats.put("averageSalary", 0.0);
            stats.put("totalSalary", 0.0);
        }

        // Recent hires (last 30 days)
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        long recentHires = allEmployees.stream()
                .filter(e -> e.getHireDate() != null && e.getHireDate().isAfter(thirtyDaysAgo))
                .count();
        stats.put("recentHires", recentHires);

        return stats;
    }
}
