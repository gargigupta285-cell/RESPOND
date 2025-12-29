-- RESPOND Database Schema
-- SQLite with better-sqlite3

-- Volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    skills TEXT, -- JSON array e.g. '["Medical","First Aid"]'
    experience TEXT, -- JSON object e.g. '{"Medical": 5}'
    license_number TEXT,
    max_distance INTEGER DEFAULT 10,
    selected_days TEXT, -- JSON array e.g. '["Monday","Tuesday"]'
    selected_emergencies TEXT, -- JSON array
    notifications TEXT, -- JSON object e.g. '{"sms":true,"email":true}'
    status TEXT DEFAULT 'pending', -- pending | verified | rejected
    rating REAL DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    hours_served INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Requests (Emergency) table
CREATE TABLE IF NOT EXISTS requests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    skills TEXT NOT NULL, -- JSON array e.g. '["Medical","Setup"]'
    urgency TEXT DEFAULT 'medium', -- high | medium | low
    status TEXT DEFAULT 'active', -- active | completed | scheduled | cancelled
    volunteers_needed INTEGER DEFAULT 1,
    organization_id TEXT,
    organization_name TEXT,
    posted_time TEXT, -- Human-readable like '3 hours ago'
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Assignments table (links volunteers to requests)
CREATE TABLE IF NOT EXISTS assignments (
    id TEXT PRIMARY KEY,
    request_id TEXT NOT NULL,
    volunteer_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending | accepted | arrived | completed | declined
    assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
    accepted_at TEXT,
    completed_at TEXT,
    FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE,
    UNIQUE(request_id, volunteer_id)
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_urgency ON requests(urgency);
CREATE INDEX IF NOT EXISTS idx_assignments_request ON assignments(request_id);
CREATE INDEX IF NOT EXISTS idx_assignments_volunteer ON assignments(volunteer_id);
