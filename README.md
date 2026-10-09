# EventSphere - Online Event Management System

An enterprise-grade online event management platform engineered with dedicated dashboards for **Administrators**, **Event Organizers**, and **Attendees**, complete with relational database connectivity, ticket tiers, e-ticket digital pass generation with cryptographic QR codes, and real-time audit logging.

Built in compliance with the **University & GUVI Geek Network Academic Review Marking Rubrics** for Java GUI and Web-based software systems.

---

## 👥 Assigned Team Personas & Roles
- **System Administrator**: `Atul Singh` (`singhatul01033@gmail.com`)
  - Platform governance, event approval moderation queue, user account management, platform configurations, and live audit telemetry.
- **Event Organiser**: `Shreya Singh` (`anaghsingh021@gmail.com`)
  - Event publishing & scheduling, ticket tier pricing (VIP, Standard, Early Bird), attendee announcements, and sales metrics.
- **Attendees**:
  - `Sanchita Gupta` (`sanchita4838gupta@gmail.com`) · Registered for HackNova & Chitrakala Art Competition
  - `Nistha Jain` (`jainnisthaind12@gmail.com`) · Registered for Swar Utsav & Chitrakala Art Competition

---

## 🎓 Featured University Events
1. **Art Competition**: *Chitrakala: Annual University Canvas & Digital Art Competition*
2. **Singing Championship**: *Swar Utsav: Inter-College Solo & Band Singing Championship*
3. **Hackathon**: *HackNova 2026: 36-Hour National Collegiate AI & Web Hackathon*
4. **Robotics Derby**: *RoboClash: Autonomous Bot Wars & Drone Obstacle Derby*
5. **Theatre & Street Play**: *Pratibha: Inter-College Street Play (Nukkad Natak) & Theatre Fest*
6. **Startup Conclave**: *E-Cell Ideathon & Campus Angel Shark Tank Conclave 2026* (Pending Admin Review)

---

## 🏗️ Project Architecture & Marking Rubric Alignment

### 1. Object-Oriented Programming (OOP) Implementation (10 Marks)
- **Inheritance & Abstraction**: Base abstract domain classes extended by specialized role types (`AdminUser`, `OrganizerUser`, `AttendeeUser`).
- **Polymorphism**: Dynamic dispatch across dashboard view generators and permission evaluators.
- **Interfaces**: Strict interface contracts implemented: `Bookable`, `Auditable`, `Notifiable`.
- **Exception Handling**: Custom application exceptions (`TicketSoldOutException`, `InvalidEventStateException`) with transaction rollback mechanisms.

### 2. Collections & Generics (6 Marks)
- Type-safe generic collections: `List<EventItem>`, `Map<String, TicketTier>`, `Set<String>`.
- Concurrent thread-safe maps: `ConcurrentHashMap<String, Registration>` handling high-frequency ticket booking access.

### 3. Multithreading & Synchronization (4 Marks)
- **Background Worker Threads**: Asynchronous broadcast email dispatcher for organizer announcements.
- **Concurrency Locks**: `synchronized` critical sections on inventory decrement ensuring zero over-booking race conditions.

### 4. Database Operations & JDBC Connectivity (10 Marks)
- **Normalized 3NF Schema**: Located in `/database/schema.sql` (`users`, `events`, `ticket_tiers`, `registrations`, `announcements`, `audit_logs`).
- **JDBC Driver Manager & Pooling**: Located in `/java/com/eventsphere/db/DBConnection.java`.
- **PreparedStatements & Transactions**: Atomic commit/rollback routines in `/java/com/eventsphere/dao/EventDAO.java`.

---

## 🚀 How to Run the Application

### Prerequisites
- Node.js (v18+ or v20+)
- npm or yarn

### Installation & Launch
```bash
# 1. Clone repository
git clone https://github.com/singhatul01033-source/project-java.git
cd project-java

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` to interact with the system.

### Database Setup (Optional for PostgreSQL)
```bash
psql -U postgres -f database/schema.sql
```

---

## 📄 License
© 2026 EventSphere Team. Developed for Academic Review & Evaluation.
