# 📚 Library Management System

A comprehensive library management system built with NestJS, TypeORM, and PostgreSQL. This system provides a complete solution for managing books, users, and borrowing processes with advanced features like pagination, CSV export, rate limiting, and JWT authentication.

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- PostgreSQL (if running locally without Docker)

### 🐳 Running with Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd library-system
   ```

2. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

3. **Start the database infrastructure**

   ```bash
   docker compose -f docker-compose.infra.yml up -d
   ```

4. **Start the application**

   ```bash
   docker compose up -d
   ```

5. **Access the application**
   - API Base URL: `http://localhost:3000`
   - Database: PostgreSQL on `localhost:5433`

### 🖥️ Running Locally (Without Docker)

If you have PostgreSQL running locally and prefer not to use Docker:

1. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

2. **Update database configuration in `.env`**

   ```env
   DATABASE_HOST=localhost  # Change from 'blog-postgres' to 'localhost'
   DATABASE_PORT=5432       # Your local PostgreSQL port
   ```

3. **Install dependencies**

   ```bash
   yarn install
   ```

4. **Start the application**

```bash
   yarn start:dev
```

## 📋 Environment Configuration

### `.env` File Structure

```env
# Application Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DATABASE_HOST=blog-postgres  # Use 'localhost' for local PostgreSQL
DATABASE_PORT=5432
DATABASE_NAME=library
DATABASE_USER=library_user
DATABASE_PASSWORD=library_pass

# JWT Configuration
JWT_SECRET=ameenreda-library

# Pagination Configuration
PAGINATION_DEFAULT_LIMIT=10
PAGINATION_MAX_LIMIT=100
```

### 🔧 Docker Configuration Notes

- **With Docker**: Use `DATABASE_HOST=blog-postgres` (service name)
- **Without Docker**: Use `DATABASE_HOST=localhost`
- The PostgreSQL container exposes port `5433` externally but uses `5432` internally

## 🏗️ Project Architecture

### 📁 Module Structure

```
src/
├── auth/           # Authentication & Authorization
├── users/          # User Management
├── books/          # Book Management
├── borrowing-process/  # Borrowing Operations
├── common/         # Shared utilities, decorators, guards
└── config/         # Application configuration
```

### 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin and User roles
- **Rate Limiting**: Protects login endpoints (5 attempts per minute)
- **Password Hashing**: bcryptjs for secure password storage
- **Route Guards**: Protected endpoints based on user roles

### 📊 Advanced Features

- **Pagination**: All list endpoints support pagination with `nestjs-paginate`
- **CSV Export**: Monthly borrowing reports in CSV format
- **Data Validation**: Class-validator for DTO validation
- **Database Relations**: TypeORM with proper entity relationships
- **Error Handling**: Comprehensive error responses

## 🔗 API Documentation

### Base URL

```
http://localhost:3000
```

### 🔐 Authentication Endpoints

#### 1. User Signup

```http
POST /auth/signup
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "ameenreda",
  "email": "ameen2@gmail.com",
  "password": "ameenreda123",
  "type": "BORROWER"
}
```

**Response:**

```json
{
  "name": "ameenreda",
  "email": "ameen2@gmail.com",
  "type": "BORROWER",
  "id": 1,
  "created_at": "2025-09-18T22:28:15.985Z",
  "updated_at": "2025-09-18T22:28:15.985Z",
  "deleted_at": null
}
```

**User Types:**

- `BORROWER` - Regular library user
- `ADMIN` - Administrator with full access

#### 2. User Login

```http
POST /auth/login
Content-Type: application/json
```

**🚨 Rate Limited**: 5 attempts per minute (60 seconds)

**Request Body:**

```json
{
  "email": "ameen2@gmail.com",
  "password": "ameenreda123"
}
```

**Response:**

```json
{
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": 1,
      "created_at": "2025-09-18T22:28:15.985Z",
      "updated_at": "2025-09-18T22:28:30.540Z",
      "deleted_at": null,
      "name": "lol",
      "email": "ameen2@gmail.com",
      "type": "BORROWER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlclR5cGUiOiJCT1JST1dFUiIsImlhdCI6MTc1ODIzNDUxMywiZXhwIjoxNzU4MzIwOTEzfQ.7QA9PHZV1XV0Gpc1icK7vsiXG9qzzKi_58EhpnQB0-s"
  }
}
```

**⚠️ Important:** Save the `token` from the response - you'll need it for authenticated requests.

#### 3. Update Profile (Update Me)

```http
PATCH /auth/me
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (example - updating name only):**

```json
{
  "name": "test"
}
```

**Response:**

```json
{
  "id": 1,
  "created_at": "2025-09-18T22:28:15.985Z",
  "updated_at": "2025-09-18T22:28:30.540Z",
  "deleted_at": null,
  "name": "test",
  "email": "ameen2@gmail.com",
  "password": "$2b$10$Po3s6LmreNQBkKlGSxjyyuPy6A7FN7exMRpMdHBqvXsIvGUeWRcQ.",
  "type": "BORROWER"
}
```

**Available Fields to Update:**

- `name` - User's display name
- `email` - User's email address
- `password` - User's password (will be hashed automatically)

### 👥 User Management (Admin Only)

#### 1. Create User

```http
POST /users
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "userType": "ADMIN"
}
```

#### 2. Get All Users (Paginated)

```http
GET /users?page=1&limit=10&search=john
Authorization: Bearer <admin-token>
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `search`: Search in name/email fields

#### 3. Get User by ID

```http
GET /users/1
Authorization: Bearer <admin-token>
```

#### 4. Update User

```http
PATCH /users/1
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Updated Name",
  "userType": "ADMIN"
}
```

#### 5. Delete User

```http
DELETE /users/1
Authorization: Bearer <admin-token>
```

### 📚 Book Management

#### 1. Create Book (Admin Only)

```http
POST /books
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "ISBN": 9780743273565,
  "quantity": 5,
  "shelfLocation": "A-101"
}
```

#### 2. Get All Books (Public, Paginated)

```http
GET /books?page=1&limit=10&search=gatsby
```

**Query Parameters:**

- `page`: Page number
- `limit`: Items per page
- `search`: Search in title/author
- `filter.quantity`: Filter by quantity (e.g., `filter.quantity=$gt:0` for available books)

#### 3. Get Book by ID (Public)

```http
GET /books/1
```

#### 4. Update Book (Admin Only)

```http
PATCH /books/1
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "quantity": 3,
  "shelfLocation": "B-205"
}
```

### 📖 Borrowing Process (Admin Only)

#### 1. Create Borrowing Process

```http
POST /borrowing-process
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "user_id": 1,
  "book_id": 1,
  "due_date": "2025-12-31"
}
```

**Note**: `due_date` must be in ISO 8601 format (YYYY-MM-DD)

#### 2. Get All Borrowing Processes (Paginated)

```http
GET /borrowing-process?page=1&limit=10
Authorization: Bearer <admin-token>
```

**Query Parameters:**

- `page`: Page number
- `limit`: Items per page
- `search`: Search borrower name or book title
- `filter.isReturned`: Filter by return status (`true`/`false`)
- `filter.due_date`: Filter by due date with operators (`$lt`, `$gt`, `$gte`, `$lte`)
- `filter.borrowed_at`: Filter by borrowing date
- `filter.returned_at`: Filter by return date

**📋 Common Use Cases:**

**Get All Active Borrowings:**

```http
GET /borrowing-process?filter.isReturned=false
Authorization: Bearer <admin-token>
```

**Get All Returned Books:**

```http
GET /borrowing-process?filter.isReturned=true
Authorization: Bearer <admin-token>
```

**🚨 Get Overdue Books:**
To get all overdue books that haven't been returned yet:

```http
GET /borrowing-process?filter.isReturned=false&filter.due_date=$lt:2025-01-19
Authorization: Bearer <admin-token>
```

**💡 Pro Tip:** Replace `2025-01-19` with today's date in `YYYY-MM-DD` format to get current overdue books.

**Get Books Due Soon (next 7 days):**

```http
GET /borrowing-process?filter.isReturned=false&filter.due_date=$lt:2025-01-26&filter.due_date=$gte:2025-01-19
Authorization: Bearer <admin-token>
```

**Search Specific User's Borrowings:**

```http
GET /borrowing-process?search=john&filter.isReturned=false
Authorization: Bearer <admin-token>
```

#### 3. Get Borrowing Process by ID

```http
GET /borrowing-process/1
Authorization: Bearer <admin-token>
```

#### 4. Return Book

```http
PATCH /borrowing-process/return/1
Authorization: Bearer <admin-token>
```

#### 5. Update Borrowing Process

```http
PATCH /borrowing-process/1
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "due_date": "2025-01-15"
}
```

#### 6. Export Last Month's Data (CSV)

```http
GET /borrowing-process/export/last-month
Authorization: Bearer <admin-token>
```

**Rate Limited**: 1 request per 5 seconds

**Response**: Downloads a CSV file with borrowing data from the last month

#### 7. Delete Borrowing Process

```http
DELETE /borrowing-process/1
Authorization: Bearer <admin-token>
```

## 📊 Response Format

### Standard Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Paginated Response

```json
{
  "message": "Data fetched successfully",
  "data": [
    // Array of items
  ],
  "meta": {
    "currentPage": 1,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalItems": 50,
    "totalPages": 5
  },
  "links": {
    "first": "http://localhost:3000/endpoint?limit=10",
    "previous": null,
    "current": "http://localhost:3000/endpoint?page=1&limit=10",
    "next": "http://localhost:3000/endpoint?page=2&limit=10",
    "last": "http://localhost:3000/endpoint?page=5&limit=10"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "statusCode": 400
}
```

## 🛠️ Development

### Available Scripts

```bash
# Development
yarn start:dev          # Start with watch mode
yarn start:debug        # Start with debug mode

# Production
yarn build              # Build for production
yarn start:prod         # Start production server

# Testing
yarn test               # Run unit tests
yarn test:watch         # Run tests in watch mode
yarn test:cov           # Run tests with coverage
yarn test:e2e           # Run end-to-end tests

# Code Quality
yarn lint               # Run ESLint
yarn format             # Format code with Prettier
```

### 🧪 Testing

Run the test suite:

```bash
yarn test
```

Run tests with coverage:

```bash
yarn test:cov
```

### 📝 Database Schema

The system uses the following main entities:

- **User**: Stores user information and authentication data
- **Book**: Manages book inventory and details
- **BorrowingProcess**: Tracks book borrowing and return processes

Relations:

- User → BorrowingProcess (One-to-Many)
- Book → BorrowingProcess (One-to-Many)

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check `DATABASE_HOST` in `.env` file
   - For Docker: Use `blog-postgres`
   - For local: Use `localhost`

2. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Or stop the process using port 3000

3. **Authentication Issues**
   - Ensure JWT_SECRET is set in `.env`
   - Check if token is included in Authorization header

4. **Docker Issues**
   - Run `docker compose down -v` to reset containers and volumes
   - Ensure Docker is running and has sufficient resources

## 📝 License

This project is licensed under the UNLICENSED License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

For more information or support, please contact the development team.
