# Hooks Test

## Overview

This repo was initially set up for me to learn the most common React hooks. It eventually turned out to be a frontend, backend and Postgres database todo list app. I learned to use the useRef and useOptimistic hooks. Additionally, I started to better understand the async, await pattern when I had to send POST HTTP requests to the backend.

## Stack

- React
- Express
- PostgreSQL

## Endpoints

### TodoItem shape

The backend API responses use the snake_case naming convention. The frontend keeps the same variable names for consistency.

```ts
type TodoItem = {
  id: number;
  content: string;
  is_checked: boolean;
  created_at: string; // ISO 8601 timestamp
};
```

Example:

```json
{
  "id": 1,
  "content": "Buy milk",
  "is_checked": false,
  "created_at": "2026-05-08T14:32:00.000Z"
}
```

### Base URL

```txt
/api/todos
```

### REST API

| Method | Path | Purpose               | Success                           | Errors        |
| ------ | ---- | --------------------- | --------------------------------- | ------------- |
| GET    | /    | Fetch all todo items  | 200 OK + array of todo objects    | 500           |
| GET    | /:id | Fetch todo item       | 200 OK + todo object              | 404, 500      |
| POST   | /    | Create a todo         | 201 Created + created todo object | 400, 500      |
| PATCH  | /:id | Update checked status | 204 No Content                    | 400, 404, 500 |
| DELETE | /:id | Delete a todo         | 204 No Content                    | 404, 500      |

### API examples

#### PATCH /todos/:id

Updates the checked state of a todo item.

Path parameters:

| Field | Type   | Required |
| ----- | ------ | -------- |
| id    | number | Yes      |

Request body:

| Field      | Type    | Required |
| ---------- | ------- | -------- |
| is_checked | boolean | Yes      |

Success response:

```txt
Status: 204 No Content
```

Errors:

- 400 Bad Request - invalid "id" or "is_checked"
- 404 Not Found - todo item not found
- 500 Internal Server Error - database error

## Folder structure

```txt
hook_test/
├── backend/
│   ├── routes/
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   ├── index.html
│   └── package.json
└── README.md
```

## Setup

### Prerequisites

- Git
- Node.js
- npm
- PostgreSQL

### Install

Clone repo

```bash
git clone https://github.com/Magnuswlange/hooks_test.git
cd hooks_test/
```

Install backend dependencies

```bash
cd ./backend/
npm i
```

Install frontend dependencies

```bash
cd ../frontend/
npm i
```

## Environment variables

Create a ".env" file in backend/ using the following example:

```env
PORT=3000
PG_PORT=5432
PG_HOST=your_postgres_hostname
PG_USER=your_postgres_username
PG_PASS=your_postgres_password
PG_DB=your_database_name
```

## Run

Start the backend:

```bash
cd ../backend/
npm run devStart
```

Start the frontend:

```bash
cd ../frontend/
npm run dev
```

Frontend runs on http://localhost:5173 and backend on http://localhost:3000 by default.

## Future improvements

- Use the Axios framework for sending POST requests.

- Re-do the project using a simpler architecture, namely: React frontend and Supabase as BaaS.
