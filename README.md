# Eyego Backend Internship Task – Event-Driven Logging Microservice

Hey there!

This is a project of event-driven logging microservice built with Node.js, Kafka, and MongoDB, using Domain-Driven Design principles and containerized with Docker.

---

## What This Project Does

This microservice captures **user activity events** (like login, logout, and page views), processes them in real-time via Kafka, stores them in MongoDB, and provides a REST API to query them with pagination and filters.

It’s designed to be scalable, modular, and easy to deploy — both locally and on cloud infrastructure.

---

## Tech Stack

- **Node.js** (Kafka producer, consumer, and API)
- **Apache Kafka** for real-time event streaming
- **MongoDB Atlas** for log storage
- **Express.js** for API layer
- **Docker & Docker Compose** for containerization
- **Domain-Driven Design (DDD)** for code structure

---

## Project Structure (DDD-Based)

```bash
src/
├── api/
│   ├── controllers/
│   └── routes/
|__config/
|    |__db.js
├── application/
├── domain/
│   ├── events/
├── infrastructure/
│   ├── kafka/
```

---

## How to Run Locally (Docker Compose)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/eyego-event-logger.git
cd eyego-event-logger
```

### 2. Create `.env` file

Create a `.env` file in the root with your MongoDB URI:

```env
MONGODB_URI=mongodb+srv://<your-user>:<your-pass>@cluster0.mongodb.net/activity_logs?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
KAFKAJS_NO_PARTITIONER_WARNING=1
```

### 3. Start services

```bash
docker-compose build
docker-compose up
```

This starts:

- Kafka broker + Zookeeper
- MongoDB (or uses Atlas)
- Producer and consumer services
- The API server at [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

### `GET /api/logs`

Query activity logs with:

| Query Param  | Description                      |
| ------------ | -------------------------------- |
| `page`       | Page number (default: 1)         |
| `pageSize`   | Logs per page (default: 10)      |
| `userId`     | Filter by user ID                |
| `eventType`  | Filter by login/logout/page_view |
| `from`, `to` | Date range (ISO timestamp)       |

Example:

```
GET /api/logs?userId=user-1&eventType=login&page=1&pageSize=5
```

---

## Architecture Explanation

### Why Event-Driven Architecture?

This microservice follows an **event-driven architecture** using Apache Kafka as the message broker. Here's why:

1. **Decoupling**: Producers and consumers are completely independent. The API can generate events without knowing who processes them.
2. **Scalability**: Multiple consumers can process events in parallel. As load increases, we can add more consumer instances.
3. **Reliability**: Kafka persists messages, ensuring no data loss even if consumers are temporarily down.
4. **Real-time Processing**: Events are processed as they occur, enabling real-time analytics and monitoring.

### Domain-Driven Design (DDD) Structure

The project follows DDD principles to maintain clean, maintainable code:

```
src/
├── domain/
│   ├── activityEvent.js
│   └── events/
│
├── application/
│   └── logQueryService.js
│
├── infrastructure/
│   ├── kafka/
│   │   ├── producer.js
│   │   ├── consumer.js
│   │   └── kafkaClient.js
│   └── config/
│       └── db.js
│
└── api/
    ├── controllers/
    │   └── logController.js
    └── routes/
        └── logRoutes.js
```

**Key DDD Concepts Applied:**

- **Domain Layer**: Contains `ActivityEvent` entity with business rules and proper MongoDB indexes for query optimization
- **Application Layer**: `logQueryService` orchestrates business workflows without knowing HTTP or infrastructure details
- **Infrastructure Layer**: Handles technical concerns (Kafka, MongoDB) isolated from business logic
- **API Layer**: Thin layer translating HTTP requests to application service calls

### Event Flow

```
1. Producer → Generates user activity events → Publishes to Kafka topic "user-activity"
2. Kafka → Stores events in distributed log → Ensures durability and ordering
3. Consumer → Subscribes to "user-activity" topic → Processes events → Stores in MongoDB
4. REST API → Queries MongoDB → Returns filtered/paginated results to clients
```

### MongoDB Indexing Strategy

Optimized indexes for common query patterns:

- **Compound Index** `{ userId: 1, timestamp: -1 }`: Fast lookups for user-specific logs sorted by time
- **Compound Index** `{ eventType: 1, timestamp: -1 }`: Filter by event type with time sorting
- **Compound Index** `{ userId: 1, eventType: 1, timestamp: -1 }`: Combined filters with sorting
- **Single Index** `{ timestamp: -1 }`: Date range queries and general time-based sorting

These indexes dramatically improve query performance, especially with large datasets.

### Technology Choices

- **Node.js + Express**: Lightweight, perfect for I/O-heavy operations and Kafka integration
- **Apache Kafka**: Industry-standard for event streaming with high throughput and fault tolerance
- **MongoDB**: Document database ideal for flexible log schemas and fast writes
- **Docker & Kubernetes**: Containerization ensures consistent deployments across environments

---
