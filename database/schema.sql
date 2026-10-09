-- ==========================================================
-- ONLINE EVENT MANAGEMENT SYSTEM (EVENTSPHERE) DDL SCHEMA
-- Normalized 3NF Relational Database Definition
-- Target DBMS: PostgreSQL / MySQL
-- ==========================================================

CREATE DATABASE eventsphere_db;
\c eventsphere_db;

-- 1. Users Table (Supports Admin, Organizer, Attendee)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'organizer', 'attendee')),
    phone VARCHAR(30),
    organization VARCHAR(150),
    avatar_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Events Table
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(20) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    is_virtual BOOLEAN DEFAULT FALSE,
    virtual_link VARCHAR(500),
    banner_url VARCHAR(500),
    organizer_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'completed')),
    rejection_reason TEXT,
    capacity INT NOT NULL CHECK (capacity > 0),
    registered_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Ticket Tiers Table
CREATE TABLE ticket_tiers (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    sold INT DEFAULT 0 CHECK (sold <= quantity),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. Registrations & Ticket Purchases Table
CREATE TABLE registrations (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    ticket_tier_id VARCHAR(36) NOT NULL REFERENCES ticket_tiers(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_amount NUMERIC(10,2) NOT NULL,
    booking_code VARCHAR(50) UNIQUE NOT NULL,
    qr_code_seed VARCHAR(255) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended')),
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Announcements & Communication Broadcasts Table
CREATE TABLE announcements (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    organizer_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('normal', 'important', 'urgent')),
    recipient_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. System Audit Logs Table
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    actor_id VARCHAR(36) NOT NULL,
    actor_name VARCHAR(100) NOT NULL,
    actor_role VARCHAR(20) NOT NULL,
    action VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Query Optimization
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_regs_user ON registrations(user_id);
CREATE INDEX idx_regs_event ON registrations(event_id);
