# TaskFlow

TaskFlow is a full-stack task management application built with React, Flask, and MongoDB.

It allows users to create an account, log in securely using JWT authentication, and manage their personal tasks.

## Features

- User registration and login
- JWT-based authentication
- Protected dashboard
- Create tasks
- Edit tasks
- Delete tasks
- Change task status between Pending and Completed
- Task priorities: Low, Medium, and High
- MongoDB database
- Responsive frontend
- RESTful API

## Tech Stack

### Frontend
- React
- Vite
- React Router
- JavaScript
- CSS

### Backend
- Python
- Flask
- Flask-CORS
- PyJWT
- Werkzeug

### Database
- MongoDB
- PyMongo

## Project Structure

```text
todo/
│
├── backend/
│   ├── models/
│   │   ├── task.py
│   │   └── user.py
│   │
│   ├── routes/
│   │   ├── auth.py
│   │   └── tasks.py
│   │
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and receive JWT token
Tasks
Method	Endpoint	Description
GET	/api/tasks/	Get user's tasks
POST	/api/tasks/	Create a task
PUT	/api/tasks/<task_id>	Update a task
DELETE	/api/tasks/<task_id>	Delete a task

Task endpoints require a valid JWT token.

Getting Started
1. Clone the repository
git clone https://github.com/shreyash07-25/todo.git
cd todo
Backend Setup

Open a terminal in the project root.

cd backend

Create a virtual environment:

python -m venv .venv

Activate it on Windows:

.venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt
Environment Variables

Create a .env file inside the backend folder:

MONGO_URI=mongodb://localhost:27017/
JWT_SECRET=your_secret_key

Make sure MongoDB is running locally.

Start the Flask server:

python app.py

The backend will run at:

http://localhost:5000
Frontend Setup

Open another terminal:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will normally run at:

http://localhost:5173
Authentication Flow
User
 │
 ▼
React Frontend
 │
 ├── Register ──► Flask API ──► MongoDB
 │
 └── Login ─────► Flask API
                    │
                    ▼
                  JWT Token
                    │
                    ▼
              Browser localStorage
                    │
                    ▼
              Protected APIs
Task Management Flow
Create Task
     │
     ▼
React Frontend
     │
     ▼
Flask REST API
     │
     ▼
MongoDB
     │
     ▼
Task displayed on Dashboard
Security
Passwords are hashed before being stored.
Protected task routes require JWT authentication.
User tasks are associated with the authenticated user.
Environment variables are stored in .env.
.env is excluded from Git using .gitignore.
Future Improvements
Task search and filtering
Task due dates
Task categories
Pagination
Better form validation
Deployment
Automated testing
Author

Shreyash Sinha

B.Tech Computer Science
Indian Institute of Information Technology Bhagalpur