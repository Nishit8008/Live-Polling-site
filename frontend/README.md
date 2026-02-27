# Live Polling System

A real-time live polling application where teachers can ask questions and students can answer them instantly. Built with a React frontend and Node.js backend.

## Architecture

This project consists of two main parts:
1.  **Frontend**: A React application built with Vite and TypeScript.
2.  **Backend**: A Node.js and Express server with Socket.io for real-time WebSocket communication and MongoDB for the database.

## Features

-   **Teacher Dashboard**: Create live polls, set the duration, mark the correct option, and track student answers in real time.
-   **Student Dashboard**: Join active polls, submit answers, and see immediate feedback (Correct/Incorrect) upon answering.
-   **Real-time Synchronization**: Uses Socket.io so polls synchronize instantly across all connected screens.

## Prerequisites

Before running this project, ensure you have the following installed on your system:
-   Node.js (v16 or higher recommended)
-   npm (Node Package Manager)
-   MongoDB (Running locally on the default port 27017, or you can supply a custom connection string)

## Getting Started

You will need to run the backend server and the frontend application simultaneously in separate terminal windows.

### 1. Running the Backend Server

Open a terminal and navigate to the backend folder:
```bash
cd backend
```

Install the required dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The backend server will start running, typically on `http://localhost:3000`. It will connect to the local MongoDB database.

### 2. Running the Frontend Application

Open a **new** terminal window and navigate to the frontend folder:
```bash
cd frontend
```

Install the required dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The React frontend will start running. Usually, Vite starts the application on `http://localhost:5173`. Open this URL in your web browser to use the application.

## Usage Guide

1.  Open the application in two different browsers or windows.
2.  On one screen, log in as a **Teacher** to go to the Teacher Dashboard.
3.  On the other screen, enter your name and join as a **Student**.
4.  From the Teacher Dashboard, create a new poll, provide options, designate the correct option, and start it.
5.  Watch the poll instantly appear on the Student screen. Submit an answer as a student and observe the interface update automatically.
