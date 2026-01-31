# 🚗 DriverScore API

A comprehensive RESTful API backend for real-time driver behavior monitoring, telemetry tracking, and intelligent scoring system designed to promote safer driving habits.

## 📋 Overview

DriverScore is a telemetry-driven platform built with Node.js and Express that monitors and analyzes driver behavior in real-time. The system captures GPS coordinates, speed data, acceleration patterns, and automatically detects unsafe driving events such as harsh braking, rapid acceleration, and speeding violations. Each trip receives a comprehensive safety score based on collected telemetry and detected events.

This API serves as the backbone for driver safety applications, fleet management systems, insurance telematics, or personal driving improvement tools.

## ✨ Key Features

### 🔐 User Management
- Secure user registration with validation
- Email-based authentication system
- Password-protected accounts
- User profile management

### 🚙 Vehicle Management
- Multi-vehicle support per user
- Complete vehicle information tracking (make, model, year)
- License and plate number registration
- Vehicle history and associations

### 🛣️ Real-Time Trip Tracking
- **Trip Lifecycle**: Start and end trip tracking with timestamps
- **Live Telemetry**: Continuous logging of speed, acceleration, GPS coordinates
- **Distance & Duration**: Automatic calculation of trip metrics
- **Status Monitoring**: Real-time trip status updates

### ⚠️ Intelligent Event Detection
The system automatically identifies and logs:
- **Harsh Braking**: Sudden deceleration events
- **Rapid Acceleration**: Aggressive acceleration patterns
- **Speeding**: Speed limit violations with duration tracking
- **Severity Classification**: Event ranking by intensity
- **Geolocation Tagging**: GPS coordinates for each event

### 📊 Trip Analytics & Scoring
- **Comprehensive Summaries**: Aggregate statistics for each trip
- **Event Counting**: Total events, harsh braking count, acceleration events
- **Speed Analytics**: Maximum speed, average speed, speeding duration
- **Safety Scoring**: Overall trip score based on behavior metrics
- **Historical Data**: Complete trip history with detailed breakdowns

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express 5.x |
| **Database** | MySQL with mysql2 driver |
| **Development** | Nodemon for hot-reloading |

## 📦 Prerequisites

Before running this project, ensure you have:

- **Node.js** v14.0 or higher
- **MySQL Server** 5.7 or higher
- **npm** or **yarn** package manager

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Panasoooonic/Group4F25.git
cd Group4F25
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Configuration

Create your database configuration file:

```bash
cp config/database-example.js config/database.js
```

Edit `config/database.js` with your MySQL credentials:

```javascript
const mysql = require("mysql2");

const sqlPool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "your_mysql_password",
    database: "DriverScore",
}).promise();

module.exports = { sqlPool };
```

### 4. Initialize Database

Run the following SQL commands in your MySQL client:

```sql
CREATE DATABASE DriverScore;
USE DriverScore;
```

Then execute the complete schema from the [Database Schema](#-database-schema) section below.

## 🎯 Usage

### Development Mode (Recommended)
Runs with automatic reloading on file changes:
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API server will start on **http://localhost:3000**

### Quick Health Check
```bash
curl http://localhost:3000/api/
```

Expected response: `{"ok": true, "message": "user router alive"}`

## 🔌 API Endpoints

### 👤 User Routes (`/api`)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/` | API health check | None |
| POST | `/api/register` | Register new user | `{firstName, lastName, email, password}` |
| POST | `/api/login` | Authenticate user | `{email, password}` |

**Example - Register User:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'
```

### 🚗 Vehicle Routes (`/api/vehicle`)

Manage vehicles associated with user accounts (CRUD operations for vehicle data).

### 🛣️ Trip Routes (`/api/trip`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trip/start` | Initiate a new trip |
| POST | `/api/trip/telemetry` | Log real-time telemetry data point |
| POST | `/api/trip/end` | Complete and finalize trip |

**Trip Workflow:**
1. Start trip → 2. Log telemetry points continuously → 3. End trip → 4. View summary

### 📊 Trip Summary Routes (`/api/summary`)

Retrieve comprehensive analytics and statistics for completed trips.

### ⚠️ Trip Event Routes (`/api/events`)

Access detected driving events with severity levels, timestamps, and GPS coordinates.

## 🗄️ Database Schema

The database consists of six interconnected tables that form a complete driver monitoring system:

### 👥 `users`
Stores user accounts with authentication credentials.

| Field | Type | Description |
|-------|------|-------------|
| userId | INT (PK, AUTO_INCREMENT) | Unique user identifier |
| firstName | VARCHAR(50) | User's first name |
| lastName | VARCHAR(50) | User's last name |
| email | VARCHAR(50) UNIQUE | Email address for login |
| password | VARCHAR(255) | Hashed password |
| createdAt | TIMESTAMP | Account creation timestamp |

### 🚙 `Vehicle`
Tracks vehicle information linked to users.

| Field | Type | Description |
|-------|------|-------------|
| vehicleId | INT (PK) | Unique vehicle identifier |
| userId | INT (FK) | Owner's user ID |
| make | VARCHAR(100) | Vehicle manufacturer |
| model | VARCHAR(100) | Vehicle model |
| year | INT | Manufacturing year |
| licenseNo | VARCHAR(50) | Driver's license number |
| plateNo | VARCHAR(50) | License plate number |
| createdAt | TIMESTAMP | Registration timestamp |

### 🛣️ `Trip`
Records trip metadata and scoring.

| Field | Type | Description |
|-------|------|-------------|
| tripId | INT (PK) | Unique trip identifier |
| userId | INT (FK) | Driver's user ID |
| vehicleId | INT (FK) | Vehicle used for trip |
| startTs | TIMESTAMP | Trip start time |
| endTs | TIMESTAMP | Trip end time |
| distanceKm | DECIMAL | Total distance traveled |
| durationSec | INT | Trip duration in seconds |
| averageSpeedKph | DECIMAL | Average speed |
| scoreTotal | DECIMAL | Overall safety score |
| status | VARCHAR(50) | Trip status (active/completed) |

### 📡 `TelemetryPoint`
Stores real-time GPS and motion data during trips.

| Field | Type | Description |
|-------|------|-------------|
| pointId | INT (PK) | Unique data point identifier |
| tripId | INT (FK) | Associated trip |
| timestamp | TIMESTAMP | Data capture time |
| speed | DECIMAL | Speed at this point (kph) |
| acceleration | DECIMAL | Acceleration value |
| lattitude | DOUBLE | GPS latitude |
| longitude | DOUBLE | GPS longitude |

### ⚠️ `TripEvent`
Logs detected unsafe driving behaviors.

| Field | Type | Description |
|-------|------|-------------|
| eventId | INT (PK) | Unique event identifier |
| tripId | INT (FK) | Associated trip |
| type | VARCHAR(50) | Event type: `HARSH_BRAKE`, `RAPID_ACCEL`, `SPEEDING` |
| timestamp | TIMESTAMP | When event occurred |
| severity | VARCHAR(50) | Event severity level |
| peakValue | DECIMAL | Maximum recorded value |
| lattitude | DOUBLE | Event GPS latitude |
| longitude | DOUBLE | Event GPS longitude |

### 📊 `TripSummary`
Aggregated trip statistics and analytics.

| Field | Type | Description |
|-------|------|-------------|
| tripId | INT (PK, FK) | Associated trip |
| eventsCount | INT | Total number of events |
| harshBrakingCount | INT | Number of harsh braking events |
| rapidAccelCount | INT | Number of rapid accelerations |
| speedingDurationSec | INT | Total time spent speeding |
| maxSpeed | DECIMAL | Maximum speed reached |
| notes | TEXT | Additional trip notes |

<details>
<summary><b>📝 Complete SQL Schema (Click to expand)</b></summary>

```sql
CREATE DATABASE DriverScore;
USE DriverScore;

CREATE TABLE users(
    userId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Vehicle (
    vehicleId INT PRIMARY KEY,
    userId INT,   
    make VARCHAR(100),
    model VARCHAR(100),
    year INT,
    licenseNo VARCHAR(50),
    plateNo VARCHAR(50),
    createdAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES users(userId)
);

CREATE TABLE Trip (
    tripId INT PRIMARY KEY,
    userId INT,
    vehicleId INT,
    startTs TIMESTAMP,
    endTs TIMESTAMP,
    distanceKm DECIMAL,
    durationSec INT,
    averageSpeedKph DECIMAL,
    scoreTotal DECIMAL,
    status VARCHAR(50),
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (vehicleId) REFERENCES Vehicle(vehicleId)
);

CREATE TABLE TripSummary (
    tripId INT PRIMARY KEY,
    eventsCount INT,
    harshBrakingCount INT,
    rapidAccelCount INT,
    speedingDurationSec INT,
    maxSpeed DECIMAL,
    notes TEXT,
    FOREIGN KEY (tripId) REFERENCES Trip(tripId)
);

CREATE TABLE TelemetryPoint (
    pointId INT PRIMARY KEY,
    tripId INT,
    timestamp TIMESTAMP,
    speed DECIMAL,
    acceleration DECIMAL,
    lattitude DOUBLE,
    longitude DOUBLE,
    FOREIGN KEY (tripId) REFERENCES Trip(tripId)
);

CREATE TABLE TripEvent (
    eventId INT PRIMARY KEY,
    tripId INT,
    type VARCHAR(50) NOT NULL,       -- HARSH_BRAKE, RAPID_ACCEL, SPEEDING
    timestamp TIMESTAMP,
    severity VARCHAR(50),
    peakValue DECIMAL,
    lattitude DOUBLE,
    longitude DOUBLE,
    FOREIGN KEY (tripId) REFERENCES Trip(tripId)
);
```
</details>

## 📁 Project Structure

```
Group4F25/
├── 📂 config/
│   ├── database.js              # MySQL connection pool configuration
│   └── database-example.js      # Template for database config
│
├── 📂 controllers/              # Business logic layer
│   ├── userController.js        # User authentication & registration
│   ├── tripController.js        # Trip lifecycle management
│   ├── vehicleController.js     # Vehicle CRUD operations
│   ├── tripEventController.js   # Event detection handling
│   └── tripSummaryController.js # Trip analytics generation
│
├── 📂 routes/                   # API endpoint definitions
│   ├── userRoutes.js            # /api user endpoints
│   ├── tripRoutes.js            # /api/trip endpoints
│   ├── vehicleRoutes.js         # /api/vehicle endpoints
│   ├── tripEventRoutes.js       # /api/events endpoints
│   └── tripSummaryRoutes.js     # /api/summary endpoints
│
├── server.js                    # Express application entry point
├── package.json                 # Project dependencies & scripts
├── package-lock.json            # Dependency lock file
└── .gitignore                   # Git ignore rules
```

## 🎓 Academic Project

This is a collaborative group project developed for **Fall 2025** coursework by **Group 4**. The project demonstrates proficiency in:
- RESTful API design
- Database schema design and normalization
- Real-time data processing
- MVC architecture pattern
- Node.js/Express development


## 🔐 Security Note

⚠️ **Important**: This is an educational project. For production use:
- Implement proper password hashing (bcrypt)
- Add JWT or session-based authentication
- Use environment variables for sensitive data
- Implement rate limiting
- Add input sanitization and validation middleware
- Enable HTTPS/SSL
