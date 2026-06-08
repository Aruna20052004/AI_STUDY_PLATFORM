# 📚 AI Study Platform

An AI-powered study companion designed to help students manage notes, organize tasks, and improve productivity through intelligent assistance.

🌐 **Live Demo:** https://ai-study-platform-sandy.vercel.app

---

## 🚀 Overview

AI Study Platform is a full-stack web application that combines note-taking, task management, and AI-powered academic assistance into a single platform. It helps students stay organized, track their study progress, and receive instant support from an integrated AI assistant.

The platform provides a personalized dashboard where users can create notes, manage daily tasks, and interact with an AI chatbot for learning support, explanations, and study guidance.

---

## ✨ Features

### 🔐 User Authentication
- Secure user registration and login
- Session management
- Protected dashboard access

### 📝 Notes Management
- Create new notes
- Edit existing notes
- Delete notes
- Organize study materials efficiently

### ✅ Task Management
- Add study tasks
- Mark tasks as completed
- Delete tasks
- Track daily learning goals

### 🤖 AI Study Assistant
- Ask academic questions
- Get concept explanations
- Receive study guidance
- AI-powered learning support

### 📱 Responsive Design
- Mobile-friendly interface
- Clean and modern UI
- Easy navigation across devices

---

## 🏗️ System Architecture

```text
Frontend (React)
       │
       ▼
Node.js + Express Backend
       │
       ▼
MongoDB Database
       │
       ▼
AI Assistant Integration
```

---

## 🛠️ Tech Stack

### Frontend
- React.js
- CSS
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### Authentication
- JWT Authentication

### AI Integration
- Generative AI API

### Deployment
- Vercel (Frontend)
- Render/Node Server (Backend)

---

## 📂 Project Structure

```text
AI-Study-Platform/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/AI-Study-Platform.git
cd AI-Study-Platform
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

### Configure Environment Variables

Create a `.env` file inside the server folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
AI_API_KEY=your_api_key
```

### Run Backend

```bash
npm start
```

### Run Frontend

```bash
cd client
npm start
```

---

## 📸 Core Functionalities

### Notes Dashboard
- Create and manage study notes.
- Edit and delete notes anytime.

### Task Dashboard
- Organize assignments and study goals.
- Track task completion status.

### AI Assistant
- Interactive chat interface.
- Provides educational support and explanations.

---

## 🎯 Project Objectives

- Improve student productivity.
- Centralize study resources.
- Simplify task management.
- Provide instant AI-powered academic assistance.
- Create an efficient digital learning environment.

---

## 🔮 Future Enhancements

- File and PDF uploads
- AI-generated study summaries
- Flashcard generation
- Quiz generation from notes
- Study streak tracking
- Calendar integration
- Dark mode support
- Collaborative study groups

---

## 👨‍💻 Developed By

**Aruna D H**

Information Science and Engineering  
SJB Institute of Technology, Bengaluru

---

## 📄 License

This project is developed for educational and learning purposes.

---

### ⭐ If you found this project useful, consider giving it a star on GitHub!
