# MediConnect Portal - Setup Guide

## Quick Start

Follow these steps to get the MediConnect Patient Portal running on your local machine.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: >= 18.0.0 ([Download](https://nodejs.org/))
- **pnpm**: >= 8.0.0 ([Installation](https://pnpm.io/installation))
- **PostgreSQL**: >= 14 ([Download](https://www.postgresql.org/download/))
- **Git**: For version control

### Installing pnpm

```bash
npm install -g pnpm
```

---

## Step 1: Clone the Repository

```bash
cd /home/durga
cd mediconnect-portal
```

---

## Step 2: Install Dependencies

```bash
pnpm install
```

This will install all the required packages including:
- Next.js 14
- React 18
- Prisma ORM
- TypeScript
- Tailwind CSS
- bcryptjs, jsonwebtoken, zod

---

## Step 3: Set Up PostgreSQL Database

### Option A: Using Local PostgreSQL

1. **Start PostgreSQL service**:

```bash
sudo service postgresql start
```

2. **Create database**:

```bash
sudo -u postgres psql
```

Then in the PostgreSQL prompt:

```sql
CREATE DATABASE mediconnect;
CREATE USER mediconnect_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mediconnect TO mediconnect_user;
\q
```

3. **Update `.env` file**:

The `.env` file has been created. Update the `DATABASE_URL`:

```env
DATABASE_URL="postgresql://mediconnect_user:your_password@localhost:5432/mediconnect?schema=public"
```

### Option B: Using Supabase (Recommended for Easy Setup)

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Copy the database connection string
4. Update `.env` file with your Supabase URL

### Option C: Using Railway

1. Go to [https://railway.app](https://railway.app)
2. Create new PostgreSQL database
3. Copy the DATABASE_URL
4. Update `.env` file

---

## Step 4: Generate Prisma Client & Push Schema

```bash
pnpm db:generate
pnpm db:push
```

This will:
- Generate the Prisma client
- Create all database tables based on the schema

---

## Step 5: Seed the Database

```bash
pnpm db:seed
```

This will create demo accounts:

**Patient Account:**
- Email: `patient@demo.com`
- Password: `Patient@123`

**Doctor Account:**
- Email: `doctor@demo.com`
- Password: `Doctor@123`

**Additional Accounts:**
- Patient: `jane@demo.com` / `Patient@123`
- Doctor: `drjones@demo.com` / `Doctor@123`

---

## Step 6: Run Development Server

```bash
pnpm dev
```

The application will start at: **http://localhost:3000**

---

## Step 7: Test the Application

1. Open browser: `http://localhost:3000`
2. You'll be redirected to `/login`
3. Use demo credentials to log in
4. Explore the dashboard

### Patient Login
- Email: `patient@demo.com`
- Password: `Patient@123`
- You'll see: Dashboard, Appointments, Medical Records, Prescriptions

### Doctor Login
- Email: `doctor@demo.com`
- Password: `Doctor@123`
- You'll see: Dashboard, Patients, Appointments, Medical Records, Prescriptions

---

## Additional Scripts

### Database Management

```bash
pnpm db:studio
```
Opens Prisma Studio to view/edit database data in a GUI at `http://localhost:5555`

```bash
pnpm db:migrate
```
Create and run database migrations

### Code Quality

```bash
pnpm lint
```
Run ESLint to check code quality

### Build for Production

```bash
pnpm build
pnpm start
```
Build and run the production version

---

## Project Structure

```
mediconnect-portal/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (patient)/         # Patient pages
│   │   │   └── patient/
│   │   │       ├── dashboard/
│   │   │       ├── appointments/
│   │   │       ├── medical-records/
│   │   │       └── prescriptions/
│   │   ├── (doctor)/          # Doctor pages
│   │   │   └── doctor/
│   │   │       ├── dashboard/
│   │   │       ├── patients/
│   │   │       ├── appointments/
│   │   │       ├── medical-records/
│   │   │       └── prescriptions/
│   │   ├── api/               # API Routes
│   │   │   ├── auth/
│   │   │   ├── appointments/
│   │   │   ├── medical-records/
│   │   │   └── prescriptions/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/            # Reusable components
│   │   ├── PatientLayout.tsx
│   │   └── DoctorLayout.tsx
│   ├── lib/                   # Core logic
│   │   ├── services/          # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── appointment.service.ts
│   │   │   ├── medical-record.service.ts
│   │   │   └── prescription.service.ts
│   │   ├── validations/       # Zod schemas
│   │   │   ├── auth.ts
│   │   │   ├── appointment.ts
│   │   │   ├── medical-record.ts
│   │   │   └── prescription.ts
│   │   ├── utils/             # Utilities
│   │   │   ├── auth.ts
│   │   │   ├── session.ts
│   │   │   └── cn.ts
│   │   └── prisma.ts
│   └── types/                 # TypeScript types
│       └── index.ts
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── docs/                      # Documentation
│   ├── security-requirements.md
│   └── threat-modeling.md
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── .env                       # Environment variables
├── .env.example
├── .gitignore
├── README.md
└── SETUP.md
```

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution**: 
- Check if PostgreSQL is running: `sudo service postgresql status`
- Verify DATABASE_URL in `.env` file
- Ensure database exists and user has permissions

### Issue: "Module not found" errors

**Solution**:
```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Issue: "Prisma Client not generated"

**Solution**:
```bash
pnpm db:generate
```

### Issue: "Port 3000 already in use"

**Solution**:
```bash
lsof -ti:3000 | xargs kill -9
```
Or run on different port:
```bash
PORT=3001 pnpm dev
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT tokens | Random 256-bit string |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |
| `NODE_ENV` | Environment | `development` or `production` |

**⚠️ Important**: Never commit `.env` file to Git. Use `.env.example` as template.

---

## Next Steps

1. **Explore the Application**: Log in as both patient and doctor to see different views
2. **Review Documentation**: Check `docs/` folder for security requirements and threat modeling
3. **Understand the Code**: Review the architecture and implementation
4. **Test Security Features**: Try the security test cases
5. **Customize**: Modify as needed for your use case

---

## Production Deployment

### Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Database Options for Production

- **Supabase**: Free PostgreSQL hosting
- **Railway**: Easy PostgreSQL deployment
- **Neon**: Serverless PostgreSQL
- **AWS RDS**: Enterprise-grade PostgreSQL

---

## Getting Help

- Check the README.md for project overview
- Review docs/ folder for detailed documentation
- Check GitHub issues (if repository is public)

---

## Security Note

This application is designed for educational purposes to demonstrate secure web development practices. Before deploying to production:

1. Change all default passwords
2. Use a strong JWT_SECRET
3. Enable HTTPS
4. Implement rate limiting
5. Add security headers
6. Enable audit logging
7. Conduct security testing

---

**Happy Coding! 🚀**

