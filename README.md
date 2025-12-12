# MediConnect - Secure Patient Portal

## 📋 Project Title and Overview
**MediConnect** is a secure, enterprise-level healthcare web application designed to facilitate communication between doctors and patients. It allows patients to manage their medical records, appointments, and prescriptions, while enabling doctors to provide care and manage patient information securely.

**Main Security Focus:** The application is built with a "Security First" approach, implementing robust authentication, role-based access control (RBAC), data encryption, and input validation to protect sensitive medical data (PHI).

## 🚀 Features and Security Objectives

### Core Functionalities
- **User Authentication:** Secure login and registration for patients.
- **Role-Based Dashboards:** Distinct interfaces and capabilities for Doctors and Patients.
- **Medical Records Management:** Doctors can create/edit records; Patients can view them.
- **Prescription Management:** Digital prescription creation and tracking.
- **File Management:** Secure uploading and downloading of medical reports/documents.
- **PDF Generation:** Patients can download official records as formatted PDFs.
- **Profile Management:** Secure password changing and profile updates.

### Key Security Improvements
1. **Authentication & Authorization:**
   - **Bcrypt Hashing:** Passwords are never stored in plain text.
   - **JWT Sessions:** Secure, HTTP-only cookies for session management (prevents XSS).
   - **RBAC:** Strict middleware checks ensure Patients cannot access Doctor routes and vice-versa.

2. **Data Protection:**
   - **Input Validation:** All user inputs are validated using `Zod` schemas to prevent malformed data and injection attacks.
   - **SQL Injection Prevention:** Uses Prisma ORM which parameterizes queries by default.
   - **XSS Protection:** React's automatic escaping prevents Cross-Site Scripting.

3. **Secure Configuration:**
   - Environment variables for sensitive secrets (Database URLs, JWT Secrets).
   - Protected API endpoints that verify session and role before execution.

## 📂 Project Structure

```
/src
  /app              # Next.js App Router (Pages & API Routes)
    /(auth)         # Public auth pages (Login/Register)
    /(doctor)       # Protected Doctor Dashboard & Features
    /(patient)      # Protected Patient Dashboard & Features
    /api            # Backend API Endpoints (Secure)
  /components       # Reusable UI Components (Forms, Cards, Modals)
  /lib
    /prisma.ts      # Database Client
    /services       # Business Logic Layer (Separation of Concerns)
    /utils          # Helper functions (Auth, Session, PDF, File)
    /validations    # Zod Security Schemas (Input Validation)
  /types            # TypeScript Definitions
/prisma             # Database Schema & Migrations
/public             # Static assets & Secure File Storage
```

## 🛠 Setup and Installation Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Cloud like Neon/Supabase)

### Installation Steps
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mediconnect-portal
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # OR
   pnpm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/mediconnect"
   JWT_SECRET="your-super-secure-secret-key-min-32-chars"
   ```

4. **Setup Database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed  # Creates initial admin/doctor accounts
   ```

5. **Run the Application**
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:3000`

## 📖 Usage Guidelines

### 1. Doctor Access
- **Login:** Use the seeded doctor credentials (e.g., `doctor@demo.com` / `Doctor@123`).
- **Dashboard:** Create new patients, view appointments, and manage medical records.
- **Creating Records:** Go to "Medical Records" -> "Create". You can upload PDF/Image files.
- **Admin:** Doctors can create new Doctor/Patient accounts via the Dashboard action buttons.

### 2. Patient Access
- **Register:** Use the public registration page (Note: Only Patient registration is public).
- **Dashboard:** View your own medical history, upcoming appointments, and prescriptions.
- **Downloads:** Click the "Download PDF" button on any record to get a copy.

## 🧪 Testing Process
The application underwent rigorous testing including:
- **Unit Testing:** Jest tests for utility functions and validations.
- **Security Testing:** Verified RBAC by attempting to access Doctor routes as a Patient (blocked).
- **Input Fuzzing:** Tested forms with invalid data to ensure Zod validation catches errors.
- **Manual QA:** End-to-end testing of the Patient-Doctor workflow.

## 📚 Contributions and References
- **Framework:** Next.js 14
- **Database:** PostgreSQL & Prisma ORM
- **Styling:** Tailwind CSS
- **Security:** Bcrypt, Jose (JWT), Zod
- **Utils:** jsPDF (PDF Generation)
# medi-connect
