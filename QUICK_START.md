# Quick Start Guide - WorkSphere Employee Management System

## ⚠️ Prerequisites Required

Before starting, you need:
- PostgreSQL
- Java 17
- Maven
- Node.js & npm

**Don't have these installed?** 

### 🚀 Easy Installation (Ubuntu/Debian):
```bash
cd /home/albinsphilip/Desktop/proj/WorkSphere
chmod +x install-prerequisites.sh
./install-prerequisites.sh
```

**Or follow manual installation:** See [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)

---

## 🚀 Fast Setup (Step by Step)

### Step 1: Setup PostgreSQL Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE employeedb;

# Verify it was created
\l

# Exit PostgreSQL
\q
```

### Step 2: Configure Backend
```bash
# Navigate to the backend directory
cd WorkSphere/backend

# Open application.properties and update if needed:
# - spring.datasource.username (default: postgres)
# - spring.datasource.password (default: postgres)
```

### Step 3: Run Backend
```bash
# In the backend directory
mvn clean install
mvn spring-boot:run

# Wait for message: "Started EmployeeManagementApplication"
# Backend will run on: http://localhost:8080
```

### Step 4: Run Frontend
```bash
# Open a NEW terminal
# Navigate to frontend directory
cd WorkSphere/frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Frontend will run on: http://localhost:5173
```

### Step 5: Access Application
Open your browser and go to:
```
http://localhost:5173
```

## ✅ Verification Checklist

- [ ] PostgreSQL is running
- [ ] Database `employeedb` is created
- [ ] Backend is running on port 8080
- [ ] Frontend is running on port 5173
- [ ] Browser shows the Employee Management interface

## 🎯 First Actions to Try

1. **Add an Employee**
   - Click "Add New Employee" button
   - Fill in the form
   - Click "Create"

2. **Search Employees**
   - Use the search box to find by name, email, or position

3. **Filter Employees**
   - Use department dropdown
   - Use status dropdown

4. **Edit Employee**
   - Click "Edit" button on any employee
   - Modify information
   - Click "Update"

5. **Delete Employee**
   - Click "Delete" button
   - Confirm deletion

## 🔍 Test the API Directly

### Get All Employees
```bash
curl http://localhost:8080/api/employees
```

### Create an Employee
```bash
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-1234",
    "department": "IT",
    "position": "Software Engineer",
    "salary": 75000,
    "hireDate": "2024-01-15",
    "status": "Active",
    "address": "123 Main St, City, State 12345"
  }'
```

### Search Employees
```bash
# Search by name
curl "http://localhost:8080/api/employees/search?searchTerm=john"

# Filter by department
curl "http://localhost:8080/api/employees/search?department=IT"

# Filter by status
curl "http://localhost:8080/api/employees/search?status=Active"

# Combined filters
curl "http://localhost:8080/api/employees/search?searchTerm=john&department=IT&status=Active"
```

## 🐛 Common Issues & Solutions

### Issue: Backend won't start
**Solution:**
- Check if PostgreSQL is running: `sudo systemctl status postgresql`
- Verify database credentials in `application.properties`
- Check if port 8080 is available: `lsof -i :8080`

### Issue: Frontend shows "Failed to load employees"
**Solution:**
- Make sure backend is running on port 8080
- Check browser console for errors
- Verify CORS is configured in backend

### Issue: Database connection error
**Solution:**
- Verify PostgreSQL is running
- Check username/password in `application.properties`
- Ensure database `employeedb` exists

### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📊 Default Configuration

| Component | Port | URL |
|-----------|------|-----|
| Backend API | 8080 | http://localhost:8080 |
| Frontend | 5173 | http://localhost:5173 |
| PostgreSQL | 5432 | localhost:5432/employeedb |

## 🎉 You're All Set!

Your Employee Management System is now running. Start managing employees with full CRUD operations, search, and filtering capabilities!

---

Need help? Check the main [README.md](README.md) for detailed documentation.
