# WorkSphere - Employee Management System

A comprehensive full-stack employee management system with CRUD operations, search, and filtering capabilities.

## 🚀 Tech Stack

### Backend
- **Spring Boot 3.1.5** - Java framework
- **Spring Data JPA** - Data persistence
- **PostgreSQL** - Database
- **Lombok** - Reduce boilerplate code
- **Maven** - Build tool

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **CSS3** - Styling

## 📋 Features

✅ **CRUD Operations**
- Create new employees
- View all employees
- Update employee information
- Delete employees

✅ **Search & Filter**
- Search by name, email, or position
- Filter by department
- Filter by status (Active, Inactive, On Leave)
- Real-time filtering

✅ **Employee Fields**
- First Name & Last Name
- Email (unique)
- Phone Number
- Department
- Position
- Salary
- Hire Date
- Status
- Address

✅ **User Experience**
- Responsive design
- Form validation
- Loading states
- Error handling
- Confirmation dialogs
- Modal-based forms

## 🛠️ Prerequisites

Before running this application, make sure you have:

- **Java 17** or higher
- **Maven 3.6+**
- **Node.js 18+** and npm
- **PostgreSQL 12+**

## 📦 Installation & Setup

### 1. Database Setup

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE employeedb;

# Exit
\q
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Update application.properties if needed
# File: src/main/resources/application.properties
# Configure your PostgreSQL credentials:
# - spring.datasource.username
# - spring.datasource.password

# Build the project
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🎯 Usage

1. **Start PostgreSQL** database
2. **Run the backend** server (`mvn spring-boot:run`)
3. **Run the frontend** application (`npm run dev`)
4. **Open browser** at `http://localhost:5173`

## 📡 API Endpoints

### Employee Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/{id}` | Get employee by ID |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |
| GET | `/api/employees/search` | Search with filters |
| GET | `/api/employees/department/{dept}` | Get by department |
| GET | `/api/employees/status/{status}` | Get by status |

### Search Parameters
- `searchTerm` - Search in name, email, position
- `department` - Filter by department
- `status` - Filter by status

## 🏗️ Project Structure

```
WorkSphere/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/worksphere/employeemanagement/
│   │       │   ├── config/
│   │       │   │   └── CorsConfig.java
│   │       │   ├── controller/
│   │       │   │   └── EmployeeController.java
│   │       │   ├── exception/
│   │       │   │   ├── GlobalExceptionHandler.java
│   │       │   │   └── ResourceNotFoundException.java
│   │       │   ├── model/
│   │       │   │   └── Employee.java
│   │       │   ├── repository/
│   │       │   │   └── EmployeeRepository.java
│   │       │   ├── service/
│   │       │   │   └── EmployeeService.java
│   │       │   └── EmployeeManagementApplication.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── EmployeeList.jsx
    │   │   ├── EmployeeList.css
    │   │   ├── EmployeeForm.jsx
    │   │   └── EmployeeForm.css
    │   ├── services/
    │   │   └── employeeService.js
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## 🎨 Screenshots & Features

### Main Dashboard
- Employee table with all information
- Search bar for quick filtering
- Department and status filters
- Add new employee button

### Employee Form
- Modal-based form
- Input validation
- Support for all employee fields
- Edit and create modes

### Filtering
- Real-time search
- Multiple filter combinations
- Clear filters option
- Result count display

## 🔧 Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/employeedb
spring.datasource.username=your_username
spring.datasource.password=your_password

# Server
server.port=8080
```

### Frontend Configuration
Edit `frontend/src/services/employeeService.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api/employees';
```

## 🚨 Troubleshooting

### Backend Issues
- **Port 8080 in use**: Change `server.port` in application.properties
- **Database connection failed**: Verify PostgreSQL is running and credentials are correct
- **Build errors**: Run `mvn clean install -U`

### Frontend Issues
- **Port 5173 in use**: Vite will automatically use next available port
- **API connection failed**: Verify backend is running on port 8080
- **Dependencies error**: Delete `node_modules` and run `npm install` again

## 📝 Development

### Build for Production

**Backend:**
```bash
cd backend
mvn clean package
java -jar target/employee-management-1.0.0.jar
```

**Frontend:**
```bash
cd frontend
npm run build
# Built files will be in dist/ directory
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

WorkSphere Employee Management System

---

**Happy Coding! 🎉**
