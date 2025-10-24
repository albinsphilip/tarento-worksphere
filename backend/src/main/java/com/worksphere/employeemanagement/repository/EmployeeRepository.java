package com.worksphere.employeemanagement.repository;

import com.worksphere.employeemanagement.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Search by name (first or last)
    @Query("SELECT e FROM Employee e WHERE " +
           "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Employee> searchByName(@Param("searchTerm") String searchTerm);

    // Filter by department
    List<Employee> findByDepartment(String department);

    // Filter by status
    List<Employee> findByStatus(String status);

    // Filter by department and status
    List<Employee> findByDepartmentAndStatus(String department, String status);

    // Check if email exists
    boolean existsByEmail(String email);

    // Search with multiple filters
    @Query("SELECT e FROM Employee e WHERE " +
           "(:searchTerm IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "(:department IS NULL OR e.department = :department) AND " +
           "(:status IS NULL OR e.status = :status)")
    List<Employee> searchWithFilters(
        @Param("searchTerm") String searchTerm,
        @Param("department") String department,
        @Param("status") String status
    );
}
