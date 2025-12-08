# MediConnect Patient Portal

A secure healthcare patient portal web application built with Next.js and PostgreSQL.

## 🏥 Project Overview

MediConnect is a healthcare patient portal that allows patients to manage their medical records, appointments, and prescriptions, while enabling doctors to provide care and manage patient information securely.

## 🎯 Features

### Patient Features
- View and manage appointments
- Access medical records and history
- View prescriptions
- View test results
- Update profile information

### Doctor Features
- View assigned patients
- Manage patient medical records
- Create and manage prescriptions
- Upload test results
- Schedule and manage appointments
- Add medical notes

## 🔒 Security Improvements

This application implements comprehensive security measures including:

1. **Authentication & Authorization**
   - Secure password hashing using bcrypt
   - JWT-based session management
   - Role-based access control (RBAC)

2. **Input Validation & Sanitization**
   - Server-side validation using Zod
   - XSS prevention through input sanitization
   - SQL injection prevention via Prisma ORM

3. **Data Protection**
   - Encrypted sensitive data
   - HTTPS enforcement
   - Secure session handling

4. **Access Control**
   - Patients can only access their own data
   - Doctors can only access assigned patients
   - IDOR prevention mechanisms

5. **Session Management**
   - Secure JWT tokens
   - Session timeout implementation
   - CSRF protection

6. **Audit Logging**
   - Comprehensive logging of sensitive operations
   - IP tracking and user agent logging
   - Timestamp tracking for all activities

7. **Error Handling**
   - Secure error messages (no sensitive info leakage)
   - Rate limiting on authentication endpoints
   - Proper error logging

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT, bcrypt
- **Validation**: Zod

## 📁 Project Structure

```
mediconnect-portal/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (patient)/         # Patient dashboard pages
│   │   ├── (doctor)/          # Doctor dashboard pages
│   │   └── api/               # API routes
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utilities and services
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Data access layer
│   │   ├── validations/       # Zod schemas
│   │   └── utils/             # Helper functions
│   └── types/                 # TypeScript type definitions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding
├── tests/                     # Test files
└── docs/                      # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 14

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mediconnect-portal
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure your database connection and JWT secret.

4. Set up the database:
```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

### Running Tests
```bash
pnpm test
```

### Running Tests in Watch Mode
```bash
pnpm test:watch
```

### Security Testing

This project includes:
- **Functional Testing**: Testing core features and workflows
- **SAST (Static Application Security Testing)**: Code analysis for vulnerabilities
- **Manual Security Testing**: SQL injection, XSS, CSRF, IDOR testing

Detailed testing documentation can be found in `/docs/testing.md`.

## 📊 Database Schema

The application uses the following main entities:
- **Users**: Authentication and role management
- **Patients**: Patient profiles and information
- **Doctors**: Doctor profiles and specializations
- **Appointments**: Scheduling and appointment management
- **Medical_Records**: Patient medical history
- **Prescriptions**: Medication prescriptions
- **Test_Results**: Lab and diagnostic results
- **Audit_Logs**: Security audit trail

## 🔐 Security Features Implementation

### Phase 1: Intentionally Vulnerable (Base Code)
The initial implementation contains deliberate security vulnerabilities including:
- Weak authentication
- Missing input validation
- SQL injection vulnerabilities
- No CSRF protection
- Weak session management

### Phase 2: Security Hardening (Current State)
All identified vulnerabilities have been addressed with:
- Secure authentication and authorization
- Comprehensive input validation
- Protection against common web vulnerabilities
- Audit logging and monitoring
- Secure session management

See `/docs/security-improvements.md` for detailed documentation.

## 📝 Default Credentials (Development Only)

### Patient Account
- Email: `patient@demo.com`
- Password: `Patient@123`

### Doctor Account
- Email: `doctor@demo.com`
- Password: `Doctor@123`

**⚠️ Change these credentials in production!**

## 🤝 Contributing

This is an individual academic project. Contributions are not accepted.

## 📄 License

This project is created for educational purposes as part of a university assignment.

## 👨‍💻 Author

[Your Name]  
Student ID: [Your Student ID]  
Institution: [Your Institution]

## 🔗 Links

- **GitHub Repository**: [Repository URL]
- **Video Presentation**: [YouTube URL]
- **Live Demo**: [Deployment URL]

## 📚 References

1. OWASP Top 10 Web Application Security Risks
2. Next.js Security Best Practices
3. HIPAA Security Guidelines
4. Prisma Security Documentation

---

**Note**: This application is developed as part of an academic project focusing on secure web application development. It demonstrates the implementation of security best practices throughout the software development lifecycle.

