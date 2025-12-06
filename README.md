# 🎯 Task Management API - Backend

A production-grade RESTful API built with Node.js, Express, and MongoDB. Features secure JWT authentication, comprehensive task management, and robust validation with TypeScript.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.0+-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#️-project-structure)
- [Security](#-security)
- [Deployment](#-deployment)

## ✨ Features

### Authentication & Security
- 🔐 **JWT Authentication** - Access & refresh token strategy
- 🍪 **HttpOnly Cookies** - Secure token storage
- 🔒 **Password Hashing** - bcrypt with salt rounds
- 🛡️ **Security Headers** - Helmet.js protection
- 🚦 **Rate Limiting** - Prevent brute force attacks
- ⚠️ **CORS Protection** - Configurable origin whitelist

### Task Management
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete
- 🔍 **Text Search** - MongoDB full-text search
- 🎯 **Advanced Filtering** - Priority, status, due date
- 📊 **Sorting & Pagination** - Efficient data retrieval
- ⚡ **Optimized Queries** - Indexed fields for performance

### Developer Experience
- 📝 **TypeScript** - Full type safety
- ✅ **Zod Validation** - Schema-based request validation
- 🧪 **Error Handling** - Centralized error middleware
- 📊 **Request Logging** - Morgan HTTP logger
- 🐳 **Docker Support** - Multi-stage production build
- 🔄 **Auto-restart** - ts-node-dev for development

## 🛠️ Tech Stack

### Core
- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[Express 5](https://expressjs.com/)** - Web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - ODM for MongoDB

### Authentication & Security
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)** - JWT implementation
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Password hashing
- **[helmet](https://helmetjs.github.io/)** - Security headers
- **[cors](https://github.com/expressjs/cors)** - CORS middleware
- **[express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)** - Rate limiting
- **[cookie-parser](https://github.com/expressjs/cookie-parser)** - Cookie handling

### Validation & Logging
- **[Zod](https://zod.dev/)** - Schema validation
- **[morgan](https://github.com/expressjs/morgan)** - HTTP logger
- **[dotenv](https://github.com/motdotla/dotenv)** - Environment variables

## 🏗️ Architecture

### High-Level System Design

```mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js Frontend<br/>www.crmint.tech]
    end

    subgraph "API Gateway"
        B[Nginx Reverse Proxy<br/>SSL/TLS Termination]
    end

    subgraph "Application Layer"
        C[Express Server<br/>api.crmint.tech:8080]
        D[Auth Middleware<br/>JWT Verification]
        E[Validation Middleware<br/>Zod Schema]
        F[Rate Limiter<br/>200 req/15min]
    end

    subgraph "Business Logic"
        G[Auth Controller<br/>Login/Register/Logout]
        H[Task Controller<br/>CRUD + Search]
    end

    subgraph "Data Layer"
        I[Mongoose ODM]
        J[(MongoDB Atlas<br/>Cloud Database)]
    end

    subgraph "External Services"
        K[JWT Token Service<br/>Access & Refresh]
    end

    A -->|HTTPS| B
    B -->|HTTP| C
    C --> D
    C --> E
    C --> F
    D --> G
    D --> H
    E --> G
    E --> H
    G --> K
    G --> I
    H --> I
    I --> J

    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style C fill:#68a063,stroke:#333,stroke-width:2px
    style J fill:#47a248,stroke:#333,stroke-width:2px
```

### Request Flow Diagram

```mermaid
sequenceDiagram
    participant Client as 🌐 Frontend
    participant Nginx as 🔒 Nginx
    participant Express as ⚡ Express
    participant Auth as 🔐 Auth MW
    participant Valid as ✅ Validation
    participant Controller as 🎯 Controller
    participant DB as 🗄️ MongoDB

    Client->>Nginx: HTTPS Request
    Nginx->>Express: Forward to :8080
    Express->>Auth: Check JWT Cookie
    
    alt Invalid Token
        Auth-->>Client: 401 Unauthorized
    else Valid Token
        Auth->>Valid: Validate Request Body
        
        alt Validation Error
            Valid-->>Client: 400 Bad Request
        else Valid Data
            Valid->>Controller: Process Request
            Controller->>DB: Query/Update
            DB-->>Controller: Response
            Controller-->>Client: 200 Success + Data
        end
    end
```

### Database Schema

```mermaid
erDiagram
    USER ||--o{ TASK : creates
    
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string refreshToken
        date createdAt
        date updatedAt
    }
    
    TASK {
        ObjectId _id PK
        ObjectId userId FK
        string title
        string description
        enum priority
        enum status
        date dueDate
        date createdAt
        date updatedAt
    }
```

## 📚 API Documentation

### Base URL
```
https://api.crmint.tech/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 201 Created
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
Set-Cookie: accessToken=...; HttpOnly; Secure; SameSite=None
Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=None

{
  "status": "success",
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Get Current User
```http
GET /auth/me
Cookie: accessToken=...

Response: 200 OK
{
  "status": "success",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Refresh Token
```http
POST /auth/refresh
Cookie: refreshToken=...

Response: 200 OK
Set-Cookie: accessToken=...; HttpOnly; Secure; SameSite=None

{
  "status": "success",
  "message": "Token refreshed successfully"
}
```

#### Logout
```http
POST /auth/logout
Cookie: accessToken=...

Response: 200 OK
{
  "status": "success",
  "message": "User logged out successfully"
}
```

### Task Endpoints

#### Get All Tasks
```http
GET /tasks?priority=high&status=To Do&search=meeting
Cookie: accessToken=...

Response: 200 OK
{
  "status": "success",
  "data": {
    "tasks": [
      {
        "_id": "...",
        "title": "Team Meeting",
        "description": "Discuss Q4 goals",
        "priority": "high",
        "status": "To Do",
        "dueDate": "2024-12-15T00:00:00.000Z",
        "userId": "...",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
}
```

#### Create Task
```http
POST /tasks
Cookie: accessToken=...
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the API documentation",
  "priority": "high",
  "status": "In Progress",
  "dueDate": "2024-12-20"
}

Response: 201 Created
{
  "status": "success",
  "data": {
    "task": { ... }
  }
}
```

#### Update Task
```http
PATCH /tasks/:id
Cookie: accessToken=...
Content-Type: application/json

{
  "status": "Done"
}

Response: 200 OK
{
  "status": "success",
  "data": {
    "task": { ... }
  }
}
```

#### Delete Task
```http
DELETE /tasks/:id
Cookie: accessToken=...

Response: 200 OK
{
  "status": "success",
  "message": "Task deleted successfully"
}
```

### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `priority` | enum | Filter by priority | `low`, `medium`, `high` |
| `status` | enum | Filter by status | `To Do`, `In Progress`, `Done` |
| `search` | string | Full-text search | `meeting notes` |
| `sort` | string | Sort field | `-createdAt` (desc) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 7.0+ (local or Atlas)
- npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/ImKartikey27/brew.git
cd brew/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

Server runs at `http://localhost:8080`

### Build for Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build image
docker build -t brew-backend .

# Run container
docker run -d \
  --name brew-api \
  -p 8080:8080 \
  --env-file .env \
  brew-backend
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=8080
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/brew

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
REFRESH_TOKEN_SECRET=your-refresh-token-secret-min-32-chars

# CORS
CORS_ORIGIN=https://www.crmint.tech,https://crmint.tech

# Token Expiry
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

### Environment Variable Details

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `NODE_ENV` | Environment | `production` or `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for access tokens | Random 32+ chars |
| `REFRESH_TOKEN_SECRET` | Secret for refresh tokens | Random 32+ chars |
| `CORS_ORIGIN` | Allowed frontend origins | `https://www.crmint.tech` |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime | `15m` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime | `7d` |

## 🗂️ Project Structure

```
backend/
├── controller/              # Request handlers
│   ├── auth.controller.ts  # Auth logic (login, register, etc.)
│   └── task.controller.ts  # Task CRUD operations
├── database/               # Database configuration
│   └── index.ts           # MongoDB connection
├── middlewares/            # Express middlewares
│   ├── asyncHandler.ts    # Async error wrapper
│   ├── auth.middleware.ts # JWT verification
│   ├── errorHandler.ts    # Global error handler
│   └── validation.middleware.ts # Zod validation
├── models/                 # Mongoose schemas
│   ├── user.model.ts      # User schema
│   └── task.model.ts      # Task schema
├── routes/                 # API routes
│   ├── auth.routes.ts     # /api/v1/auth/*
│   └── task.routes.ts     # /api/v1/tasks/*
├── utils/                  # Helper functions
│   └── token.ts           # JWT utilities
├── validation/             # Zod schemas
│   ├── auth.validation.ts # Auth request schemas
│   └── task.validation.ts # Task request schemas
├── app.ts                  # Express app setup
├── index.ts               # Server entry point
├── Dockerfile             # Docker configuration
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies
```

## 🔒 Security

### Implemented Security Measures

1. **JWT Authentication**
   - Access tokens (15 min expiry)
   - Refresh tokens (7 day expiry)
   - HttpOnly cookies (XSS protection)

2. **Password Security**
   - bcrypt hashing with 10 salt rounds
   - Minimum 6 characters required

3. **Rate Limiting**
   - 200 requests per 15 minutes per IP
   - Prevents brute force attacks

4. **CORS Protection**
   - Whitelist specific origins
   - Credentials mode enabled

5. **Security Headers**
   - Helmet.js for HTTP headers
   - Content Security Policy
   - XSS Protection

6. **Request Validation**
   - Zod schema validation
   - Type-safe request bodies
   - Sanitized inputs

7. **MongoDB Security**
   - Connection string in env vars
   - Mongoose schema validation
   - Query injection prevention

## 📊 Performance Optimizations

- **Database Indexes** - On userId, priority, status fields
- **Text Search Index** - Full-text search on title and description
- **Connection Pooling** - MongoDB connection reuse
- **Async/Await** - Non-blocking operations
- **Error Handling** - Centralized with stack traces in dev

## 🐳 Deployment

### VM Deployment with Nginx

1. **Set up Nginx reverse proxy**
```nginx
server {
    listen 80;
    server_name api.crmint.tech;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

2. **Get SSL certificate**
```bash
sudo certbot --nginx -d api.crmint.tech
```

3. **Start with PM2**
```bash
npm run build
pm2 start dist/index.js --name brew-backend
pm2 save
pm2 startup
```

### Docker Deployment

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 📜 Available Scripts

```bash
npm run dev          # Start dev server with auto-reload
npm run build        # Build TypeScript to dist/
npm run start        # Start production server
npm run clean        # Remove dist/ directory
```

## 🧪 API Testing

### Using curl

```bash
# Register
curl -X POST https://api.crmint.tech/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST https://api.crmint.tech/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -c cookies.txt

# Get tasks
curl https://api.crmint.tech/api/v1/tasks \
  -b cookies.txt
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🔗 Links

- **API:** [https://api.crmint.tech](https://api.crmint.tech)
- **Frontend:** [https://www.crmint.tech](https://www.crmint.tech)
- **Frontend Repo:** [https://github.com/ImKartikey27/brew_frontend](https://github.com/ImKartikey27/brew_frontend)

## 📧 Contact

**Author:** ImKartikey27  
**Repository:** [https://github.com/ImKartikey27/brew](https://github.com/ImKartikey27/brew)

---

**Built with 💪 using Node.js, Express, TypeScript & MongoDB**
