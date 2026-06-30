# Affordmed Campus Hiring Assessment — 2303051050988

This repository contains the complete submission for the Affordmed backend + frontend assessment.

---

## Repository Structure

```
.
├── notification_system_design.md   # System Design Document (Stages 1–7)
├── stage6_priority_inbox.js        # Stage 6: Priority Inbox Algorithm (JavaScript)
├── stage6_output.png               # Stage 6: Screenshot of Priority Inbox output
├── consume_api.js                  # Utility: API client for the evaluation service
└── notification-app-fe/            # Stage 7: React Frontend Application
    ├── src/
    │   ├── api/                    # API client with fallback mock
    │   ├── components/             # Navbar, NotificationCard
    │   ├── context/                # Read/Unread state via React Context
    │   ├── pages/                  # AllNotifications, PriorityInbox
    │   └── utils/                  # Logging Middleware
    ├── package.json
    └── vite.config.js
```

---

## Stage Overview

| Stage | Description |
|-------|-------------|
| **Stage 1** | REST API Design — Endpoints, JSON schemas, SSE real-time mechanism |
| **Stage 2** | Database Choice (PostgreSQL), Schema, Scaling Problems & Solutions |
| **Stage 3** | Query Optimization, Index Strategy, Slow Query Analysis |
| **Stage 4** | Caching Strategy — Redis, SSE push model, Read Replicas |
| **Stage 5** | Bulk Notification Reliability — Message Queues, Retry logic, DLQ |
| **Stage 6** | Priority Inbox Algorithm — Min-Heap, O(log N) insert, Top-N ranking |
| **Stage 7** | Frontend React App — MUI, Logging Middleware, All Notifications & Priority Inbox pages |

Full details are in [`notification_system_design.md`](./notification_system_design.md).

---

## Running the Frontend (Stage 7)

The React application **must run on `http://localhost:3000`**.

```bash
cd notification-app-fe
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Pages
- **`/`** — All Notifications (paginated, read/unread tracking)
- **`/priority`** — Priority Inbox (Top N, filter by type, sorted by weight + recency)

---

## Running Stage 6 (Priority Inbox Algorithm)

```bash
node stage6_priority_inbox.js
```

This demonstrates the min-heap based priority inbox with 20 sample notifications and live streaming updates.

---

## API

The notifications API endpoint used:

```
GET http://4.224.186.213/evaluation-service/notifications
```

Query Parameters: `limit`, `page`, `notification_type`

The frontend includes a fallback to mock data if the API is unreachable.
