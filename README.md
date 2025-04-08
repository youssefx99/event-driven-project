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
├── api/                # HTTP layer (Express routes and controllers)
│   ├── controllers/
│   └── routes/
|__config/
|    |__db.js           # database connection
├── application/        # Services orchestrating business logic
├── domain/             # Entities, value objects, and event types
│   ├── events/
├── infrastructure/     # Kafka setup and DB connection
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
```

### 3. Start services

```bash
docker-compose up --build
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

## Demo Recording

I’ve included a short recorded demo in the repo showing:

- Services spinning up
- Kafka logs flowing
- API calls returning real data

---

## Why I Chose This Architecture

- **Event-Driven Design** with Kafka gives clean separation between producers and consumers, making it scalable and easy to extend.
- **DDD Principles** help keep logic isolated and testable.
- **Docker & Compose** makes it super easy to spin everything up locally or in CI.
- I chose MongoDB Atlas for a reliable cloud DB without needing to manage state.
