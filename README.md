# Anapoorna (अन्नपूर्णा) - Food Donation & Rescue Management Platform

Anapoorna is a full-stack, enterprise-grade food donation and rescue management platform built to eliminate food waste by connecting food donors (restaurants, caterers, households) with nearby verified NGOs and receivers. The platform features **Haversine Geofenced Matching** and a **Greedy Nearest-Neighbor Route Optimization** solver for multi-stop pickup logistics.

---

## 🌟 Key Features

1. **Role-Based Access Control (RBAC)**:
   - **DONOR**: Create food donations with quantity (kg), servings, food type, expiry time, and GPS pickup location.
   - **NGO / RECEIVER**: Discover nearby active food donations within a configurable radius ($R$ km), claim pickups, and view route maps.
   - **VOLUNTEER**: Claim assigned pickup tasks and record delivery status state transitions.
   - **ADMIN**: Platform-wide monitoring, food volume metrics, and system auditing.

2. **Zero-Cost Haversine Geofencing**:
   - Calculates great-circle distance between donor pickup coordinates and receiver locations using the Haversine formula:
     \[ d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right) \]
   - Completely modular and decoupled behind a clean service layer, allowing future drop-in integrations with Google Maps or Mapbox.

3. **Multi-Stop Route Optimization MVP**:
   - Solves the Traveling Salesperson Problem (TSP) heuristic using a Nearest-Neighbor greedy algorithm.
   - Given an NGO depot location and a set of pickup IDs, generates the optimal stop sequence to minimize total travel distance and fuel cost.

4. **Stateless JWT Security & Hashed Credentials**:
   - Passwords hashed using BCrypt.
   - Stateless authentication via JSON Web Tokens (`Authorization: Bearer <token>`).

---

## 🛠️ Technology Stack

### Backend
- **Language**: Java 23 (JDK 23)
- **Framework**: Spring Boot 3.4.2
- **Database**: MySQL 8.0
- **Security**: Spring Security & JJWT (0.12.6)
- **ORM / Persistence**: Spring Data JPA & Hibernate 6
- **Validation**: Jakarta Bean Validation
- **Build Tool**: Apache Maven 3.9

### Frontend
- **Framework**: React 18 & Vite
- **HTTP Client**: Axios (with automatic JWT request/response interceptors)
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Styling**: Vanilla CSS Design System with Glassmorphism, CSS Tokens & Responsive Layouts

### DevOps & Testing
- **Testing**: JUnit 5 & Mockito
- **Containerization**: Docker & Docker Compose

---

## 🚀 Setup & Execution Guide

### Prerequisites
- JDK 23+
- Maven 3.9+
- Node.js 20+ & npm
- MySQL Server 8.0 (Running on `localhost:3306`)

---

### 1. Database Setup
```sql
CREATE DATABASE IF NOT EXISTS anapoorna_db;
```

---

### 2. Run Spring Boot Backend
Navigate to root directory:
```bash
cd c:\Projects\Anapoorna
mvn clean spring-boot:run
```
The backend server runs on `http://localhost:8080`.

---

### 3. Run React Frontend
In a new terminal:
```bash
cd c:\Projects\Anapoorna\frontend
npm install
npm run dev
```
The frontend dev server runs on `http://localhost:5173`.

---

## 🐳 Docker Deployment

To launch both MySQL 8 and the Spring Boot backend using Docker Compose:
```bash
docker-compose up --build
```

---

## 📑 API Endpoint Documentation (Postman Compatible)

### Authentication API
- `POST /api/auth/register` - Register a new User (`DONOR`, `NGO`, `VOLUNTEER`)
  - **Request Body**:
    ```json
    {
      "name": "Green Hotel",
      "email": "donor@greenhotel.org",
      "password": "password123",
      "phone": "+91 9876543210",
      "role": "DONOR",
      "address": "Bandra, Mumbai",
      "latitude": 19.0596,
      "longitude": 72.8295
    }
    ```
- `POST /api/auth/login` - Authenticate & obtain JWT token
- `GET /api/auth/me` - Get current authenticated user details

### Food Donation API
- `POST /api/donations` - Create a new food donation (DONOR / ADMIN)
- `GET /api/donations` - List all food donations
- `GET /api/donations/my` - List donations created by authenticated donor
- `GET /api/donations/nearby?latitude=19.0760&longitude=72.8777&radiusKm=10.0` - Geofenced radius search
- `PUT /api/donations/{id}/cancel` - Cancel food donation

### Pickup API
- `POST /api/pickups/assign` - Claim/assign food donation for pickup (NGO / ADMIN)
- `PATCH /api/pickups/{id}/status` - Update pickup state (`IN_TRANSIT`, `COMPLETED`, `FAILED`)

### Route Optimization API
- `POST /api/routing/optimize` - Compute optimal multi-stop pickup sequence
  - **Request Body**:
    ```json
    {
      "startLatitude": 19.0760,
      "startLongitude": 72.8777,
      "donationIds": [1, 2, 3]
    }
    ```

---

## 🧪 Running Automated Tests

Run full test suite (JUnit 5 + Mockito):
```bash
mvn clean test
```

---

## 🎓 Student Architectural Takeaways
- **Clean Architecture**: Ensures independence from frameworks. Controllers handle HTTP logic, Services encapsulate business rules, Repositories handle database operations, and DTOs keep database entities secure.
- **Stateless JWT**: Eliminates server-side session management bottlenecks, making the application cloud-native and horizontally scalable.
- **Haversine Math**: Enables full geofencing capabilities without relying on paid map API keys during initial development.
