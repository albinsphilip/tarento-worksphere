# Installation Guide for Linux - WorkSphere Prerequisites

This guide will help you install all required software to run the Employee Management System on Linux.

## 📦 What You Need to Install

1. PostgreSQL (Database)
2. Java 17 (Backend runtime)
3. Maven (Build tool)
4. Node.js & npm (Already installed ✅)

---

## 🐘 Step 1: Install PostgreSQL

### For Ubuntu/Debian-based systems:

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

### For Fedora/RHEL/CentOS:

```bash
# Install PostgreSQL
sudo dnf install postgresql-server postgresql-contrib -y

# Initialize database
sudo postgresql-setup --initdb

# Start and enable service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

### For Arch Linux:

```bash
# Install PostgreSQL
sudo pacman -S postgresql

# Initialize database cluster
sudo -u postgres initdb -D /var/lib/postgres/data

# Start and enable service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

### Configure PostgreSQL:

```bash
# Switch to postgres user
sudo -i -u postgres

# Access PostgreSQL
psql

# Set password for postgres user (inside psql)
ALTER USER postgres PASSWORD 'postgres';

# Create the database
CREATE DATABASE employeedb;

# List databases to verify
\l

# Exit psql
\q

# Exit postgres user
exit
```

---

## ☕ Step 2: Install Java 17

### For Ubuntu/Debian:

```bash
# Install OpenJDK 17
sudo apt update
sudo apt install openjdk-17-jdk -y

# Verify installation
java -version
javac -version
```

### For Fedora/RHEL/CentOS:

```bash
# Install OpenJDK 17
sudo dnf install java-17-openjdk java-17-openjdk-devel -y

# Verify installation
java -version
javac -version
```

### For Arch Linux:

```bash
# Install OpenJDK 17
sudo pacman -S jdk17-openjdk

# Verify installation
java -version
javac -version
```

### Set JAVA_HOME (All distributions):

```bash
# Find Java installation path
java_path=$(dirname $(dirname $(readlink -f $(which java))))
echo $java_path

# Add to .bashrc or .zshrc
echo "export JAVA_HOME=$java_path" >> ~/.bashrc
echo "export PATH=\$JAVA_HOME/bin:\$PATH" >> ~/.bashrc

# Reload shell configuration
source ~/.bashrc

# Verify JAVA_HOME
echo $JAVA_HOME
```

---

## 🔨 Step 3: Install Maven

### For Ubuntu/Debian:

```bash
# Install Maven
sudo apt update
sudo apt install maven -y

# Verify installation
mvn -version
```

### For Fedora/RHEL/CentOS:

```bash
# Install Maven
sudo dnf install maven -y

# Verify installation
mvn -version
```

### For Arch Linux:

```bash
# Install Maven
sudo pacman -S maven

# Verify installation
mvn -version
```

### Alternative: Manual Installation (Latest Version)

```bash
# Download Maven
cd /tmp
wget https://dlcdn.apache.org/maven/maven-3/3.9.5/binaries/apache-maven-3.9.5-bin.tar.gz

# Extract
sudo tar -xvzf apache-maven-3.9.5-bin.tar.gz -C /opt

# Create symlink
sudo ln -s /opt/apache-maven-3.9.5 /opt/maven

# Add to PATH
echo "export M2_HOME=/opt/maven" >> ~/.bashrc
echo "export PATH=\$M2_HOME/bin:\$PATH" >> ~/.bashrc

# Reload
source ~/.bashrc

# Verify
mvn -version
```

---

## ✅ Step 4: Verify All Installations

Run these commands to verify everything is installed correctly:

```bash
# Check PostgreSQL
psql --version
# Expected: psql (PostgreSQL) 12.x or higher

# Check Java
java -version
# Expected: openjdk version "17.x.x"

# Check Maven
mvn -version
# Expected: Apache Maven 3.x.x

# Check Node.js (already installed)
node --version
# Expected: v18.x.x or higher

# Check npm (already installed)
npm --version
# Expected: 9.x.x or higher
```

---

## 🗄️ Step 5: Setup Database

```bash
# Login to PostgreSQL as postgres user
sudo -u postgres psql

# Inside psql, run:
CREATE DATABASE employeedb;

# Verify database was created
\l

# Exit
\q
```

---

## 🚀 Step 6: Test the Setup

### Test Backend:

```bash
# Navigate to backend
cd /home/albinsphilip/Desktop/proj/WorkSphere/backend

# Build the project
mvn clean install

# If successful, you should see "BUILD SUCCESS"
```

### Test Frontend:

```bash
# Navigate to frontend
cd /home/albinsphilip/Desktop/proj/WorkSphere/frontend

# Install dependencies (already done)
npm install

# Start dev server
npm run dev

# Should start on http://localhost:5173
```

---

## 🐛 Troubleshooting

### PostgreSQL Issues

**Issue: Can't connect to PostgreSQL**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# If not running, start it
sudo systemctl start postgresql

# Check if it's listening
sudo netstat -plnt | grep 5432
```

**Issue: Authentication failed**
```bash
# Edit pg_hba.conf (location varies by distro)
sudo nano /etc/postgresql/*/main/pg_hba.conf
# or
sudo nano /var/lib/pgsql/data/pg_hba.conf

# Change this line:
# local   all             postgres                                peer
# To:
# local   all             postgres                                md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Java Issues

**Issue: Command not found after installation**
```bash
# Reload shell
source ~/.bashrc

# Or close and reopen terminal
```

**Issue: Wrong Java version**
```bash
# List installed Java versions
sudo update-alternatives --config java

# Select Java 17 from the list
```

### Maven Issues

**Issue: Maven not found**
```bash
# Make sure PATH is set correctly
echo $PATH | grep maven

# If not found, add to .bashrc again and reload
source ~/.bashrc
```

---

## 📋 Quick Installation Script

Here's a script to install everything automatically (Ubuntu/Debian):

```bash
#!/bin/bash

echo "Installing WorkSphere prerequisites..."

# Update system
sudo apt update

# Install PostgreSQL
echo "Installing PostgreSQL..."
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Java 17
echo "Installing Java 17..."
sudo apt install openjdk-17-jdk -y

# Install Maven
echo "Installing Maven..."
sudo apt install maven -y

# Configure PostgreSQL
echo "Configuring PostgreSQL..."
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
sudo -u postgres psql -c "CREATE DATABASE employeedb;"

# Verify installations
echo ""
echo "=== Installation Complete ==="
echo "PostgreSQL: $(psql --version)"
echo "Java: $(java -version 2>&1 | head -n 1)"
echo "Maven: $(mvn -version | head -n 1)"
echo ""
echo "Database 'employeedb' created successfully!"
echo ""
echo "Next steps:"
echo "1. cd /home/albinsphilip/Desktop/proj/WorkSphere/backend"
echo "2. mvn spring-boot:run"
echo "3. Open new terminal"
echo "4. cd /home/albinsphilip/Desktop/proj/WorkSphere/frontend"
echo "5. npm run dev"
```

Save this as `install.sh`, make it executable with `chmod +x install.sh`, and run with `./install.sh`

---

## ✅ Installation Checklist

- [ ] PostgreSQL installed and running
- [ ] Java 17 installed
- [ ] Maven installed
- [ ] Node.js and npm installed (already done)
- [ ] PostgreSQL password set to 'postgres'
- [ ] Database 'employeedb' created
- [ ] Backend builds successfully (`mvn clean install`)
- [ ] Frontend starts successfully (`npm run dev`)

---

## 🎯 Ready to Continue?

Once all installations are complete, return to [QUICK_START.md](QUICK_START.md) to run the application!
