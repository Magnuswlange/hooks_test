# Hooks Test

## Introduction

This repo was initially set up for me to learn to use the most common React hooks. It eventually turned out to be a frontend, backend and Postgres database todo list app. However, I still practiced using the useRef and useOptimistic hooks. Additionally, I send HTTP requests to the backend via raw JS without the use of e.g. Axios. Later on, I plan to re-do the project using a simpler architecture, namely: React frontend and Supabase as BaaS.

## Architecture

Frontend -> backend -> Postgres DB

## Endpoints

The REST API exposes the following endpoints:

| Method | Path                |                       | Purpose                   | Success                    | Errors        |
| ------ | ------------------- | --------------------- | ------------------------- | -------------------------- | ------------- |
| GET    | /todos or todos/:id | Fetch todo item(s)    | None                      | 200 OK + todo JSON         | 404, 500      |
| POST   | /todos              | Create a todo         | {"content":"msg"}         | 201 Created + created todo | 400, 500      |
| PATCH  | /todos/:id          | Update checked status | { "is_checked": boolean } | 200 OK + updated todo      | 400, 404, 500 |
| DELETE | /todos/:id          | Delete a todo         | None                      | 204 No Content             | 404, 500      |
