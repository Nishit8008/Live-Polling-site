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

## Deployment Guide

Deploying this project requires three steps: setting up the database, hosting the backend, and hosting the frontend.

### 1. Database Deployment (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account/cluster.
2. In your cluster cluster setup, click **Network Access** and add IP address `0.0.0.0/0` (Allow access from anywhere).
3. Click **Database Access** and create a database user with a password.
4. Click **Database** -> **Connect** -> **Connect your application**.
5. Copy the connection string provided. It will look something like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/live-polling-system?retryWrites=true&w=majority`
6. Keep this string handy. Remember to replace `<password>` with the password you just created!

### 2. Backend Deployment (Render)
1. Push your code to a GitHub repository.
2. Go to [Render](https://render.com/) and sign in with GitHub.
3. Click **New +** and select **Web Service**.
4. Connect the GitHub repository containing your project.
5. In the settings, configure the following:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
6. Scroll down to **Environment Variables** and add:
   - `MONGO_URI` = *(Paste the MongoDB Atlas connection string from step 1)*
   - `PORT` = `3000`
   - `FRONTEND_URL` = *(We will update this later once Vercel is set up! For now you can leave it blank)*
7. Click **Create Web Service**. Wait for the deployment to finish and copy your new backend URL (e.g., `https://live-polling-backend.onrender.com`).

### 3. Frontend Deployment (Vercel)
1. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
2. Click **Add New** -> **Project**.
3. Import the same GitHub repository.
4. Configure the project:
   - **Root Directory**: Select `frontend` (Click Edit and choose the frontend folder).
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Open **Environment Variables** and add:
   - `VITE_BACKEND_URL` = *(Paste your Render backend URL, e.g., `https://live-polling-backend.onrender.com/api`)*
6. Click **Deploy**. Vercel will give you a live URL for your frontend interface!

### 4. Final Hookup
1. Copy the frontend URL Vercel gave you (e.g., `https://live-polling-frontend.vercel.app`).
2. Go back to your Render Dashboard -> Backend Web Service -> **Environment**.
3. Add/Update the `FRONTEND_URL` variable with the exact Vercel URL.
4. Click **Save Changes** (Render will restart your server).

You are done! Your Live Polling System is now live on the internet!
