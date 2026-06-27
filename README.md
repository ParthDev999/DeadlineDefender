# Deadline Defender — AI Productivity Companion

Deadline Defender is an AI-powered productivity web app that helps users manage tasks, deadlines, priorities, and estimated work hours. It uses Gemini API to generate personalized productivity plans so users can complete important tasks before deadlines.

## Live Demo

**Live App:** https://deadline-defender-nine.vercel.app

## Problem Statement

This project is built for the problem statement **“The Last-Minute Life Saver”**.
The goal is to create an AI productivity companion that helps users plan, prioritize, and complete their tasks before deadlines.

## Features

* User signup and login
* Secure authentication using JWT
* Password hashing using bcrypt
* Add new tasks with title, description, deadline, priority, and estimated hours
* View all saved tasks
* Edit task details
* Mark tasks as completed
* Delete tasks
* Filter tasks by status and priority
* AI-generated productivity plan using Gemini API
* User-specific task storage using MongoDB
* Responsive and clean dashboard UI

## Tech Stack

### Frontend

* React.js
* Vite
* Axios
* React Router DOM
* React Markdown
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt.js
* CORS
* dotenv

### AI and Cloud

* Gemini API
* Google Cloud Run
* MongoDB Atlas
* Vercel

## Google Technologies Used

* **Gemini API:** Used to generate AI-based productivity plans from the user's saved tasks.
* **Google Cloud Run:** Used to deploy the backend API.

## Project Flow

1. User creates an account or logs in.
2. JWT token is generated and stored on the frontend.
3. User adds tasks with deadline, priority, and estimated hours.
4. Tasks are stored in MongoDB Atlas with the logged-in user's ID.
5. User can edit, delete, complete, and filter tasks.
6. Gemini API analyzes the saved tasks and generates a personalized productivity plan.

## Folder Structure

```txt
DeadlineDefender/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── aiRoutes.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
└── README.md
```

## API Endpoints

### Auth Routes

```txt
POST /api/auth/signup
POST /api/auth/login
```

### Task Routes

```txt
POST /api/tasks
GET /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

### AI Routes

```txt
POST /api/ai/plan
```

## Future Improvements

* Email verification using OTP
* Google Calendar integration
* Reminder notifications
* Voice-based task creation
* More advanced AI scheduling
* Task categories and tags
* Dark/light theme toggle

## Author

**Parth Sawaria**
GitHub: ParthDev999
