# Job Application Tracker

A simple, secure CRUD application for tracking job applications built with Next.js 16, TypeScript, PostgreSQL, and AI-powered features.

## 🎯 Project Overview

This is a straightforward job application tracking system that demonstrates basic CRUD operations with AI-powered features. Users can create, read, update, and delete job application records with essential information like company details, position, application status, and notes. The application includes AI-generated interview preparation tips to help users prepare for their job interviews.

## 🚀 Technology Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Database**: Supabase PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication with bcryptjs password hashing
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives (Card, Badge, Input, etc.)
- **AI Integration**: Cohere API for interview preparation tips
- **State Management**: React Hooks with custom hooks (useAuth, useJobs)

## ✨ Key Features

### Core CRUD Operations
- **User Authentication**: Simple JWT-based registration and login system
- **Create**: Add new job applications with company, position, and status
- **Read**: View all job applications in a dashboard with filtering by status
- **Update**: Edit job application details including status and notes
- **Delete**: Remove job applications from the system

### AI-Powered Features
- **Interview Preparation**: AI-generated interview tips based on job description and requirements
- **Smart Insights**: Context-aware preparation suggestions using Cohere API
- **Optional Feature**: Works without AI key for basic functionality

### Basic Data Fields
- Company name and position
- Application status (applied, interviewing, offered, rejected, closed)
- Applied date and interview date
- Salary range and location
- Job description and requirements
- Personal notes

### User Interface
- **Simple Dashboard**: Clean interface for managing job applications
- **Responsive Design**: Works on desktop and mobile devices
- **Status-based Organization**: Color-coded status badges for easy identification
- **Form Validation**: Basic input validation for data integrity
- **Footer with Profile Information**: Includes name, GitHub, and LinkedIn links

### Accessibility Features
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Optimized for accessibility tools
- **Semantic HTML**: Proper heading structure and semantic elements
- **Focus Management**: Logical focus order and visual indicators

### Testing Suite
- **Unit Tests**: Authentication utilities and helper functions
- **Integration Tests**: API endpoint testing
- **End-to-End Tests**: Comprehensive user flow testing

## 🛠️ Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Token-based authentication with expiration
- **HTTP-Only Cookies**: Basic protection against XSS attacks
- **Input Validation**: Server-side validation to prevent injection attacks
- **SQL Injection Prevention**: Prisma ORM with parameterized queries

## 📁 Project Structure

```
job-tracker/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints (login, register, logout, me)
│   │   └── jobs/          # Job application CRUD endpoints
│   ├── dashboard/         # Main dashboard and job management pages
│   ├── login/            # User login page
│   └── register/         # User registration page
├── components/
│   ├── dashboard/        # Dashboard-specific components
│   ├── jobs/            # Job-related components
│   └── ui/              # Reusable UI components (card, badge, input, etc.)
├── hooks/
│   ├── use-auth.ts      # Authentication state management
│   └── use-jobs.ts      # Job data management with API calls
├── lib/
│   ├── auth.ts          # JWT authentication utilities
│   └── db.ts            # Prisma client configuration
├── prisma/
│   └── schema.prisma    # Database schema definition
└── public/              # Static assets
```

## 🗄️ Database Schema

The application uses Supabase PostgreSQL with the following schema:

**User Model:**
- id, email (unique), name, passwordHash
- Timestamps: createdAt, updatedAt
- One-to-many relationship with JobApplication

**JobApplication Model:**
- Basic info: company, position, status (applied, interviewing, offered, rejected, closed)
- Details: description, requirements, salary, location
- Dates: appliedDate, interviewDate
- Notes: personal notes field
- Belongs to User with cascade delete

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- PostgreSQL database
- npm or another package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd job-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file with the following variables:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/job_tracker
JWT_SECRET=your-secret-key-change-this-in-production
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

### Running the Application

**Development mode:**
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

**Production build:**
```bash
npm run build
npm start
```

## 🎨 User Interface

### Pages
- **Home Page**: Redirects to login or dashboard based on authentication
- **Login**: User authentication with email and password
- **Register**: User registration with email, name, and password
- **Dashboard**: Main interface showing all job applications
- **Job Detail/Edit**: View and edit individual job applications
- **New Application**: Add new job application

### Components
- **Dashboard Header**: User info, logout, and add application button
- **Jobs List**: Card-based grid display of job applications with status badges
- **Job Detail**: Comprehensive job information with edit functionality
- **UI Components**: Reusable components (Card, Badge, Input, Spinner, Empty states)

## 🔒 Authentication & Authorization

- **JWT-based Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Protected Routes**: API routes protected by authentication middleware
- **User Isolation**: Users can only access their own job applications
- **Cookie Security**: HTTP-only cookies for token storage

## 🧪 Testing

Basic testing setup for authentication utilities and helper functions.

## 🚀 Deployment

The application is deployed to Netlify.

### Manual Deployment
The application was manually deployed to Netlify using the Next.js Runtime. The deployment process involved:
1. Connecting the GitHub repository to Netlify
2. Configuring environment variables (DATABASE_URL, JWT_SECRET, COHERE_API_KEY)
3. Setting up the Supabase PostgreSQL database connection
4. Running database migrations with Prisma

### CI/CD Configuration
A GitHub Actions workflow is configured in `.github/workflows/deploy.yml` but is not actively used since deployment is handled manually. The workflow includes:
- Automated testing before deployment
- Build process with environment variables
- Netlify deployment integration
- Pull request deployment previews

### Environment Variables
The following environment variables are configured in Netlify:
- `DATABASE_URL`: Supabase PostgreSQL connection string
- `DIRECT_URL`: Direct database connection for migrations
- `JWT_SECRET`: Secret key for JWT authentication
- `COHERE_API_KEY`: API key for Cohere AI integration

### CI/CD Features (Configured but Not Active)
- Automated testing before deployment
- Build optimization and error handling
- Deployment status notifications
- Environment-specific configurations
- Pull request deployment previews

## 🛡️ Security Considerations

- **Input Validation**: Server-side validation on all API endpoints
- **SQL Injection Prevention**: Parameterized queries with Prisma ORM
- **Password Security**: Password hashing with bcryptjs
- **Token Security**: JWT with expiration and secure storage
## 📝 Conclusion

This Job Application Tracker demonstrates a simple, secure CRUD application built with modern web technologies. It focuses on basic job application management functionality with user authentication and essential data tracking features.
│   │   │   ├── input.test.tsx        # Input component tests
│   │   │   └── badge.test.tsx        # Badge component tests
│   │   └── providers/
│   │       └── toast-provider.test.tsx # Toast provider tests
│   └── api/
│       ├── auth/
│       │   ├── login.test.ts         # Login API tests
│       │   └── register.test.ts      # Register API tests
│       └── jobs/
│           └── crud.test.ts          # Jobs CRUD API tests
├── jest.config.js                     # Jest configuration
└── jest.setup.js                      # Jest setup with mocks
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage
- **Authentication**: JWT token generation/verification, user registration/login
- **Job Management**: CRUD operations, data validation, user authorization
- **UI Components**: Button, Card, Input, Badge, Toast notifications
- **API Routes**: Authentication endpoints, job management endpoints
- **Hooks**: useAuth, useJobs custom hooks with toast integration

### Testing Best Practices Implemented
- **Isolation**: Each test is independent with proper cleanup
- **Mocking**: External dependencies (database, API calls) are mocked
- **Async Testing**: Proper handling of asynchronous operations
- **Error Cases**: Testing both success and failure scenarios
- **User Interactions**: Testing user actions with user-event library
- **Component Behavior**: Testing component rendering and user interactions

### Test Configuration
- **Jest Environment**: jsdom for DOM testing
- **Module Mocking**: Next.js router, Image component, and database mocked
- **Setup Files**: Global test utilities and mock configurations
- **Coverage Collection**: Configured to track test coverage

### Future Testing Enhancements
- **E2E Testing**: Playwright tests for complete user flows
- **API Testing**: More comprehensive API endpoint testing
- **Performance Testing**: Load testing for production readiness
- **Accessibility Testing**: Automated accessibility testing

## ⚠️ Missing Features (Future Enhancements)

### Immediate Additions
- **Footer with Profile Information**: Add name, GitHub, and LinkedIn links in footer
- **Accessibility Improvements**: ARIA labels, keyboard navigation, screen reader support
- **Testing Suite**: Unit, integration, and end-to-end tests

### Planned Features
- **Email Notifications**: Application status updates
- **File Uploads**: Resume and document management
- **Advanced Filtering**: Filter applications by status, date, company
- **Export Functionality**: Export applications to CSV/PDF
- **Search**: Full-text search across applications
- **Calendar View**: Visual timeline of applications and interviews
- **Statistics Dashboard**: Charts and analytics about job search progress


## 🤝 Contributing

This is a demonstration project, but contributions are welcome:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is created for educational purposes for the House of Edtech assignment.

---

**Built with ❤️ using Next.js 16, TypeScript, PostgreSQL, and AI technologies**
