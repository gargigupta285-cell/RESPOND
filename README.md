
# RESPOND Landing Page Mockup

This is a code bundle for RESPOND Landing Page Mockup. The original project is available at https://www.figma.com/design/8rGee1P3XJcxbjno88zLQA/RESPOND-Landing-Page-Mockup.

## Running the Frontend

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Backend

The backend is a Node.js + Express + TypeScript API server that handles form submissions and volunteer registrations.

### Running the Backend

```bash
cd backend
npm install
npm run dev
```

The backend will be available at `http://localhost:4000`.

### API Endpoints

#### Health Check
```bash
curl http://localhost:4000/api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-28T15:50:00.000Z",
  "uptime": 123.456
}
```

---

#### Contact Form Submission
```bash
curl -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I have a question about volunteering."
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "contact_1735400000000_abc123def",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I have a question about volunteering.",
    "createdAt": "2025-12-28T15:50:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Name is required, Email is required"
}
```

---

#### Volunteer Registration
```bash
curl -X POST http://localhost:4000/api/volunteer/register \
  -H "Content-Type: application/json" \
  -d '{
    "personalInfo": {
      "fullName": "Dr. Priya Sharma",
      "email": "priya@example.com",
      "phone": "+91 98765 43210",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "skills": {
      "selectedSkills": ["Doctor", "First Aid"],
      "experience": { "Doctor": 5, "First Aid": 10 }
    },
    "verification": {},
    "availability": {
      "maxDistance": 15,
      "selectedDays": ["Mon", "Tue", "Wed"],
      "selectedEmergencies": ["Medical Emergencies"],
      "notifications": { "sms": true, "email": true }
    }
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "vol_1735400000000_xyz789abc",
    "fullName": "Dr. Priya Sharma",
    "email": "priya@example.com",
    "status": "pending",
    "createdAt": "2025-12-28T15:50:00.000Z"
  },
  "message": "Volunteer registration submitted successfully. Your application is pending verification."
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Full name is required, At least one skill must be selected"
}
```

---

### Development

**Frontend and Backend together:**

1. Terminal 1 (Frontend):
   ```bash
   npm run dev
   ```

2. Terminal 2 (Backend):
   ```bash
   cd backend
   npm run dev
   ```

**Build for production:**
```bash
cd backend
npm run build
npm start
```