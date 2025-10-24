#!/bin/bash

# WorkSphere Prerequisites Installation Script
# For Ubuntu/Debian-based Linux systems

echo "================================================"
echo "  WorkSphere - Installation Script"
echo "  Installing: PostgreSQL, Java 17, Maven"
echo "================================================"
echo ""

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "⚠️  Please do not run this script as root or with sudo"
   echo "The script will ask for sudo password when needed"
   exit 1
fi

# Detect Linux distribution
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VER=$VERSION_ID
else
    echo "❌ Cannot detect Linux distribution"
    exit 1
fi

echo "📌 Detected OS: $OS $VER"
echo ""

# Update package lists
echo "📦 Updating package lists..."
sudo apt update

echo ""
echo "=========================================="
echo "1️⃣  Installing PostgreSQL..."
echo "=========================================="

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check PostgreSQL status
if systemctl is-active --quiet postgresql; then
    echo "✅ PostgreSQL installed and running"
    psql --version
else
    echo "❌ PostgreSQL installation failed"
    exit 1
fi

echo ""
echo "=========================================="
echo "2️⃣  Installing Java 17..."
echo "=========================================="

# Install Java 17
sudo apt install openjdk-17-jdk -y

# Verify Java installation
if command -v java &> /dev/null; then
    echo "✅ Java installed successfully"
    java -version
    
    # Set JAVA_HOME
    JAVA_PATH=$(dirname $(dirname $(readlink -f $(which java))))
    
    # Add to bashrc if not already present
    if ! grep -q "JAVA_HOME" ~/.bashrc; then
        echo "" >> ~/.bashrc
        echo "# Java Environment" >> ~/.bashrc
        echo "export JAVA_HOME=$JAVA_PATH" >> ~/.bashrc
        echo "export PATH=\$JAVA_HOME/bin:\$PATH" >> ~/.bashrc
        echo "✅ JAVA_HOME added to ~/.bashrc"
    else
        echo "ℹ️  JAVA_HOME already configured"
    fi
else
    echo "❌ Java installation failed"
    exit 1
fi

echo ""
echo "=========================================="
echo "3️⃣  Installing Maven..."
echo "=========================================="

# Install Maven
sudo apt install maven -y

# Verify Maven installation
if command -v mvn &> /dev/null; then
    echo "✅ Maven installed successfully"
    mvn -version
else
    echo "❌ Maven installation failed"
    exit 1
fi

echo ""
echo "=========================================="
echo "4️⃣  Configuring PostgreSQL..."
echo "=========================================="

# Configure PostgreSQL - set password and create database
echo "Setting up database..."

# Set postgres password
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';" 2>/dev/null

# Create database
sudo -u postgres psql -c "CREATE DATABASE employeedb;" 2>/dev/null || echo "Database 'employeedb' may already exist"

# Verify database creation
DB_EXISTS=$(sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -w employeedb | wc -l)

if [ $DB_EXISTS -eq 1 ]; then
    echo "✅ Database 'employeedb' is ready"
else
    echo "⚠️  Database creation may have failed"
fi

echo ""
echo "=========================================="
echo "5️⃣  Verification Summary"
echo "=========================================="

echo ""
echo "📊 Installed Versions:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# PostgreSQL
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL: $(psql --version | cut -d' ' -f3)"
else
    echo "❌ PostgreSQL: Not found"
fi

# Java
if command -v java &> /dev/null; then
    echo "✅ Java: $(java -version 2>&1 | head -n 1 | cut -d'"' -f2)"
else
    echo "❌ Java: Not found"
fi

# Maven
if command -v mvn &> /dev/null; then
    echo "✅ Maven: $(mvn -version | head -n 1 | cut -d' ' -f3)"
else
    echo "❌ Maven: Not found"
fi

# Node.js (should already be installed)
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "⚠️  Node.js: Not found (required for frontend)"
fi

# npm (should already be installed)
if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "⚠️  npm: Not found (required for frontend)"
fi

echo ""
echo "=========================================="
echo "🎉 Installation Complete!"
echo "=========================================="
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Reload your shell configuration:"
echo "   source ~/.bashrc"
echo ""
echo "2. Navigate to backend and build:"
echo "   cd /home/albinsphilip/Desktop/proj/WorkSphere/backend"
echo "   mvn clean install"
echo ""
echo "3. Run the backend:"
echo "   mvn spring-boot:run"
echo ""
echo "4. In a new terminal, run the frontend:"
echo "   cd /home/albinsphilip/Desktop/proj/WorkSphere/frontend"
echo "   npm run dev"
echo ""
echo "5. Open browser at: http://localhost:5173"
echo ""
echo "=========================================="
echo "📚 Documentation:"
echo "  - Installation Guide: INSTALLATION_GUIDE.md"
echo "  - Quick Start: QUICK_START.md"
echo "  - Full README: README.md"
echo "=========================================="
echo ""
echo "💡 Tip: If you encounter any issues, check INSTALLATION_GUIDE.md"
echo "    for troubleshooting steps."
echo ""
