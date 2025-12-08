# Threat Modeling

## Overview
This document presents the threat model for the MediConnect Patient Portal using Data Flow Diagrams (DFDs) and identifies potential security threats using the STRIDE methodology.

---

## Data Flow Diagram (DFD) - Level 0

### Context Diagram

```
┌──────────────┐                                      ┌──────────────┐
│              │                                      │              │
│   Patient    │◄────────────────────────────────────►│   Browser    │
│   (User)     │     View Medical Data, Book Appts   │              │
│              │                                      │              │
└──────────────┘                                      └──────┬───────┘
                                                             │
                                                             │ HTTPS
                                                             │
┌──────────────┐                                      ┌──────▼───────┐
│              │                                      │              │
│   Doctor     │◄────────────────────────────────────►│  MediConnect │
│   (User)     │    Manage Patients, Create Records  │    Portal    │
│              │                                      │ (Next.js App)│
└──────────────┘                                      └──────┬───────┘
                                                             │
                                                             │
                                                             │
                                                      ┌──────▼───────┐
                                                      │              │
                                                      │  PostgreSQL  │
                                                      │   Database   │
                                                      │              │
                                                      └──────────────┘
```

---

## Data Flow Diagram (DFD) - Level 1

### Patient Workflow

```
┌─────────┐         Login Request          ┌──────────────────┐
│ Patient │──────────────────────────────►  │ Authentication   │
└────┬────┘                                 │     Service      │
     │                                      └────────┬─────────┘
     │            JWT Token                          │
     │◄──────────────────────────────────────────────┘
     │                                               │
     │                                               │ Verify Password
     │                                               │ (bcrypt)
     │                                               ▼
     │                                      ┌──────────────────┐
     │                                      │   User Table     │
     │      View Appointments               │   Patient Table  │
     ├──────────────────────────────────►   └────────┬─────────┘
     │                                               │
     │                                               │
     │      Appointment Data                         │
     │◄──────────────────────────────────────────────┘
     │                                               │
     │      Book Appointment                         │
     ├──────────────────────────────────►            │
     │                                               │
     │                                               ▼
     │                                      ┌──────────────────┐
     │      View Medical Records            │  Appointments    │
     ├──────────────────────────────────►   │  Medical Records │
     │                                      │  Prescriptions   │
     │      Medical Data                    │  Test Results    │
     │◄──────────────────────────────────   └──────────────────┘
     │
     │      Logout
     └──────────────────────────────────►
```

### Doctor Workflow

```
┌─────────┐         Login Request          ┌──────────────────┐
│ Doctor  │──────────────────────────────►  │ Authentication   │
└────┬────┘                                 │     Service      │
     │                                      └────────┬─────────┘
     │            JWT Token                          │
     │◄──────────────────────────────────────────────┘
     │                                               │
     │      View Patients                            ▼
     ├──────────────────────────────────►   ┌──────────────────┐
     │                                      │   Patient Data   │
     │      Patient List                    │                  │
     │◄──────────────────────────────────   └────────┬─────────┘
     │                                               │
     │      Create Medical Record                    │
     ├──────────────────────────────────►            │
     │                                               │
     │      Create Prescription                      ▼
     ├──────────────────────────────────►   ┌──────────────────┐
     │                                      │  Medical Records │
     │      Upload Test Results             │  Prescriptions   │
     ├──────────────────────────────────►   │  Test Results    │
     │                                      └────────┬─────────┘
     │                                               │
     │                                               │
     │                                               ▼
     │                                      ┌──────────────────┐
     │                                      │   Audit Logs     │
     │                                      │  (All Actions)   │
     │                                      └──────────────────┘
     │
     │      Logout
     └──────────────────────────────────►
```

---

## Trust Boundaries

### Identified Trust Boundaries

1. **User ↔ Browser**: User trusts their browser
2. **Browser ↔ Web Server**: HTTPS encryption boundary
3. **Web Server ↔ Database**: Internal network boundary
4. **Authenticated ↔ Unauthenticated**: Session/token validation
5. **Patient Role ↔ Doctor Role**: Authorization boundary

---

## STRIDE Threat Analysis

### 1. Spoofing Identity

| Threat | Description | Attack Vector | Mitigation |
|--------|-------------|---------------|------------|
| T-1.1 | Attacker impersonates a patient | Stolen credentials, phishing | Strong password policy, JWT tokens, HttpOnly cookies |
| T-1.2 | Attacker impersonates a doctor | Credential theft | Password hashing (bcrypt), session management |
| T-1.3 | Session hijacking | Stolen JWT token | Secure cookies, HTTPS, short token expiration |

### 2. Tampering with Data

| Threat | Description | Attack Vector | Mitigation |
|--------|-------------|---------------|------------|
| T-2.1 | SQL Injection | Malicious SQL in input fields | Prisma ORM with parameterized queries |
| T-2.2 | Modify medical records | Unauthorized API calls | Authorization checks, role verification |
| T-2.3 | Modify prescriptions | Direct API manipulation | Doctor-only access, audit logging |
| T-2.4 | Parameter tampering | Modify request parameters | Server-side validation with Zod |

### 3. Repudiation

| Threat | Description | Attack Vector | Mitigation |
|--------|-------------|---------------|------------|
| T-3.1 | Doctor denies creating record | No proof of action | Audit logging with timestamps |
| T-3.2 | User denies accessing data | No access logs | Comprehensive audit trail |
| T-3.3 | Admin denies modifications | No change tracking | Immutable audit logs |

### 4. Information Disclosure

| Threat | Description | Attack Vector | Mitigation |
|--------|-------------|---------------|------------|
| T-4.1 | Unauthorized access to medical records | IDOR vulnerability | Authorization checks, UUID-based IDs |
| T-4.2 | Patient accesses other patient data | Direct object reference | Filter by patient ID, ownership verification |
| T-4.3 | Doctor accesses unassigned patients | Missing authorization | Verify doctor-patient relationship |
| T-4.4 | Sensitive data in error messages | Verbose errors | Generic user-facing errors |
| T-4.5 | Password exposure | Plain text storage | bcrypt hashing |

### 5. Denial of Service

| Threat | Description | Attack Vector | Mitigation |
|--------|-------------|---------------|------------|
| T-5.1 | Brute force login attempts | Automated password guessing | Rate limiting, account lockout |
| T-5.2 | API flooding | Mass requests to endpoints | Rate limiting per IP |
| T-5.3 | Database resource exhaustion | Complex queries | Query optimization, connection pooling |

### 6. Elevation of Privilege

| Threat | Description | Attack Vector | Mitigation |
|--------|-------------|---------------|------------|
| T-6.1 | Patient gains doctor privileges | Role manipulation | Server-side role verification |
| T-6.2 | Access control bypass | URL manipulation | Authorization middleware |
| T-6.3 | API privilege escalation | Modified request headers | Role-based access control (RBAC) |

---

## Abuse Cases

### Abuse Case 1: Unauthorized Medical Record Access

**Scenario**: A patient attempts to access another patient's medical records.

**Attack Steps**:
1. Patient logs into the system
2. Obtains valid session token
3. Modifies API request to include another patient's ID
4. Attempts to retrieve medical records

**Mitigation**:
- Authorization checks in service layer
- Verify patient ID matches session user
- Return 403 Forbidden for unauthorized access
- Log access attempts for audit

**Test Case**: See `TC-SEC-001` in testing.md

---

### Abuse Case 2: SQL Injection Attack

**Scenario**: Attacker attempts to inject SQL code through input fields.

**Attack Steps**:
1. Navigate to login page
2. Enter malicious SQL in email field: `admin' OR '1'='1`
3. Submit login form
4. Attempt to bypass authentication

**Mitigation**:
- Use Prisma ORM (no raw SQL)
- Parameterized queries
- Input validation with Zod
- Type checking with TypeScript

**Test Case**: See `TC-SEC-002` in testing.md

---

### Abuse Case 3: Cross-Site Scripting (XSS)

**Scenario**: Attacker injects malicious script to steal session tokens.

**Attack Steps**:
1. Doctor creates medical record
2. Injects script in notes field: `<script>alert(document.cookie)</script>`
3. Patient views medical record
4. Script executes in patient's browser

**Mitigation**:
- React auto-escapes output
- Content Security Policy
- No `dangerouslySetInnerHTML`
- Input sanitization

**Test Case**: See `TC-SEC-003` in testing.md

---

### Abuse Case 4: Insecure Direct Object Reference (IDOR)

**Scenario**: Patient modifies URL to access another patient's appointment.

**Attack Steps**:
1. Patient books an appointment (ID: abc-123)
2. Views appointment details at `/patient/appointments/abc-123`
3. Modifies URL to `/patient/appointments/xyz-789`
4. Attempts to view another patient's appointment

**Mitigation**:
- Verify ownership in service layer
- Check patient ID matches session user
- Use UUIDs instead of sequential IDs
- Return 404 or 403 for unauthorized access

**Test Case**: See `TC-SEC-004` in testing.md

---

### Abuse Case 5: Session Hijacking

**Scenario**: Attacker steals session token to impersonate user.

**Attack Steps**:
1. Intercept network traffic (man-in-the-middle)
2. Extract JWT token from HTTP headers
3. Use token to make authenticated requests
4. Access victim's medical records

**Mitigation**:
- HTTPS encryption (TLS 1.2+)
- HttpOnly cookies (prevent JS access)
- Secure flag on cookies
- SameSite attribute
- Token expiration (7 days)

**Test Case**: See `TC-SEC-005` in testing.md

---

## Misuse Cases

### Misuse Case 1: Doctor Accessing Unassigned Patient

**Legitimate Use**: Doctor accesses assigned patient's records  
**Misuse**: Doctor attempts to access patients not assigned to them

**Prevention**:
- Verify doctor-patient relationship
- Check appointment or medical record association
- Audit log all access attempts

---

### Misuse Case 2: Brute Force Password Attack

**Legitimate Use**: User logs in with correct credentials  
**Misuse**: Attacker tries multiple passwords to gain access

**Prevention**:
- Rate limiting (5 attempts/minute)
- Account lockout after 10 failed attempts
- CAPTCHA after 3 failed attempts
- Alert user of suspicious activity

---

### Misuse Case 3: Privilege Escalation

**Legitimate Use**: Patient accesses patient dashboard  
**Misuse**: Patient modifies role to access doctor features

**Prevention**:
- Server-side role verification
- Immutable role in JWT token
- Role stored in database (source of truth)
- No client-side role checks

---

## Security Controls Summary

| Control | Purpose | Implementation Status |
|---------|---------|----------------------|
| Authentication | Verify user identity | ✅ Implemented |
| Authorization | Control resource access | ✅ Implemented |
| Encryption | Protect data in transit | ✅ Implemented |
| Input Validation | Prevent injection attacks | ✅ Implemented |
| Session Management | Secure user sessions | ✅ Implemented |
| Audit Logging | Track security events | ⏳ Partial |
| Rate Limiting | Prevent brute force | ❌ Not implemented |
| CSRF Protection | Prevent cross-site attacks | ✅ Implemented |

---

## References

1. Microsoft STRIDE Threat Modeling
2. OWASP Threat Modeling Guide
3. OWASP Application Threat Modeling Cheat Sheet
4. "Threat Modeling: Designing for Security" by Adam Shostack

