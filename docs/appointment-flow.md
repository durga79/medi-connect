# Appointment Flow Documentation

## 📋 How the Appointment System Works

### **Complete Workflow**

```
┌─────────────┐
│   PATIENT   │
└──────┬──────┘
       │
       │ 1. Clicks "Book Appointment"
       │
       ▼
┌─────────────────────────────┐
│  Select Doctor              │
│  - View all doctors         │
│  - See specializations      │
│  - See departments          │
└──────┬──────────────────────┘
       │
       │ 2. Choose doctor
       │
       ▼
┌─────────────────────────────┐
│  Select Date & Time         │
│  - Pick appointment date    │
│  - Choose time slot         │
│  - Provide reason           │
│  - Add notes (optional)     │
└──────┬──────────────────────┘
       │
       │ 3. Submit booking
       │
       ▼
┌─────────────────────────────┐
│  Appointment Created        │
│  Status: SCHEDULED          │
│  - Saved to database        │
│  - Visible to both parties  │
└──────┬──────────────────────┘
       │
       ├──────────────┬─────────────┐
       │              │             │
       ▼              ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Patient  │  │  Doctor  │  │ Database │
│ Sees it  │  │ Sees it  │  │  Stored  │
└──────────┘  └──────────┘  └──────────┘
```

---

## 🔄 Patient Journey

### **Step 1: Access Booking**
Patient can book an appointment from:
1. **Dashboard** - "Book Appointment" button (top right)
2. **Appointments Page** - "Book Appointment" button

### **Step 2: Select Doctor**
- Patient sees a list of ALL available doctors
- Displayed information:
  - Doctor's full name
  - Specialization (e.g., Cardiologist, General Practitioner)
  - Department (e.g., Cardiology, General Medicine)
- Patient selects the doctor they want to see

### **Step 3: Choose Date & Time**
- **Date**: Can pick any future date (minimum: today)
- **Time**: Pre-defined time slots:
  - Morning: 9:00 AM - 12:00 PM
  - Afternoon: 2:00 PM - 5:00 PM
  - 30-minute intervals

### **Step 4: Provide Details**
- **Reason for Visit** (required): Describe symptoms/concerns
- **Additional Notes** (optional): Extra information

### **Step 5: Submit**
- Click "Book Appointment"
- Appointment is created with status: `SCHEDULED`
- Patient is redirected to "My Appointments"

---

## 👨‍⚕️ Doctor Journey

### **Doctor Views Appointments**
1. Doctor logs in
2. Goes to "Appointments" page
3. Sees appointments in two sections:
   - **Upcoming Appointments**: Future appointments
   - **Past Appointments**: Completed/historical

### **Information Displayed to Doctor**
For each appointment:
- Patient's full name
- Patient's phone number
- Appointment date and time
- Reason for visit
- Any notes from patient
- Status badge (SCHEDULED, COMPLETED, etc.)

---

## 🔍 Current System Type

### **Direct Booking System** ✅
- **Patient books directly** - Chooses doctor, date, and time
- **Appointment is immediately SCHEDULED** - No approval needed
- **Doctor sees it in their list** - Can view all appointments
- **Simpler workflow** - Faster for patients

### **NOT Using Request/Approval System** ❌
We're NOT using:
- Patient "requests" an appointment
- Doctor "approves" or "modifies" the request
- Status changes from PENDING → APPROVED

---

## 🏥 Doctor Selection

### **How Patients Choose Doctors**

#### **Option: Patient Selects from ALL Doctors**
✅ **Current Implementation**

- Patient sees complete list of ALL registered doctors
- Patient can choose ANY doctor
- **Not assigned** - Patient has freedom to choose
- Good for:
  - Seeking second opinions
  - Choosing specialists
  - Patient preference

**Advantages:**
- Patient autonomy
- Can see multiple doctors for different issues
- Better patient experience

**Example:**
```
Patient "Durga" wants cardiologist
→ Sees list: Dr. Sarah (Cardiologist), Dr. Jones (Cardiologist)
→ Selects Dr. Sarah
→ Books appointment with Dr. Sarah
```

---

## 📊 Database Structure

### **Appointment Record**
```javascript
{
  id: "uuid",
  patientId: "patient-uuid",     // Who is the patient
  doctorId: "doctor-uuid",       // Which doctor they chose
  appointmentDate: "2024-12-20", // When
  appointmentTime: "10:00 AM",   // What time
  status: "SCHEDULED",           // Current status
  reason: "Chest pain",          // Why
  notes: "Started yesterday",    // Additional info
  createdAt: "2024-12-08",       // When booked
}
```

### **Appointment Statuses**
```typescript
enum AppointmentStatus {
  SCHEDULED   // Booked and confirmed
  COMPLETED   // Patient visited
  CANCELLED   // Cancelled by patient/doctor
  NO_SHOW     // Patient didn't show up
}
```

---

## 🎯 Key Features

### **For Patients:**
1. ✅ Browse all available doctors
2. ✅ See doctor specializations
3. ✅ Choose preferred date and time
4. ✅ Provide reason for visit
5. ✅ View upcoming appointments
6. ✅ View past appointments
7. ❌ Cancel appointments (not yet implemented)
8. ❌ Reschedule appointments (not yet implemented)

### **For Doctors:**
1. ✅ View all their appointments
2. ✅ See patient details
3. ✅ See upcoming vs past appointments
4. ✅ View appointment reason
5. ❌ Update appointment status (not yet implemented)
6. ❌ Add notes to appointments (not yet implemented)

---

## 🔐 Security Checks

### **Authorization Rules:**
1. **Only authenticated users** can book appointments
2. **Only PATIENTS** can book appointments (doctors cannot)
3. **Patients see only THEIR appointments**
4. **Doctors see only appointments WITH THEM**
5. **Data isolation** - No cross-patient viewing

### **Validation:**
1. ✅ Doctor ID must be valid
2. ✅ Date must be in the future
3. ✅ Time must be selected
4. ✅ Reason must be provided
5. ✅ Email and phone validation

---

## 📱 User Interface Flow

### **Patient Booking Flow:**
```
Dashboard → "Book Appointment" Button
    ↓
Book Appointment Page
    ↓
1. Select Doctor (dropdown)
    ↓
2. Choose Date (calendar picker)
    ↓
3. Select Time (dropdown with slots)
    ↓
4. Enter Reason (text area)
    ↓
5. Add Notes (optional text area)
    ↓
6. Click "Book Appointment"
    ↓
Redirect to "My Appointments"
    ↓
See booked appointment in "Upcoming" section
```

---

## 🚀 Future Enhancements (Not Implemented Yet)

### **Could Add:**
1. **Approval Workflow**
   - Doctor reviews requests
   - Can accept/reject/modify time

2. **Availability Management**
   - Doctors set available hours
   - Only show available slots

3. **Email Notifications**
   - Confirmation emails
   - Reminder emails (24h before)

4. **Appointment Management**
   - Cancel appointments
   - Reschedule appointments
   - Add doctor notes

5. **Calendar Integration**
   - Google Calendar sync
   - iCal export

6. **Video Consultations**
   - Virtual appointments
   - Video call links

---

## 💡 Summary

**Current System:**
- Patients choose ANY doctor from the list
- Patients pick date and time
- Appointment is immediately SCHEDULED
- Both patient and doctor can view it
- Simple, direct booking process

**No assignment/restriction** - Patients have full choice of which doctor to see!

---

## 🔗 Navigation

**Patient Side:**
- `/patient/dashboard` → "Book Appointment" button
- `/patient/appointments` → "Book Appointment" button
- `/patient/appointments/book` → Booking form

**Doctor Side:**
- `/doctor/appointments` → View all appointments
- `/doctor/patients` → View all patients

