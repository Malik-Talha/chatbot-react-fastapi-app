# Full-Stack Chatbot Application

A modern, production-ready chatbot application built with FastAPI, React, and Socket.IO, demonstrating real-time communication, authentication, and database management. This project serves as a complete foundation that can be easily extended with actual AI/LLM integrations like LangChain, LangGraph, or any other conversational AI framework.

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 🎯 Project Purpose

This project was created as a **learning and portfolio showcase** to demonstrate proficiency in:

- Building **real-time web applications** with WebSocket/Socket.IO
- Implementing **RESTful APIs** with FastAPI
- **JWT-based authentication** and user management
- **Database design and ORM** usage with SQLAlchemy
- **Modern React patterns** with hooks and component composition
- **Docker containerization** for development and deployment
- **Full-stack integration** between backend and frontend

The chatbot responses are currently **mocked** to focus on the architecture and communication patterns. The codebase is structured to easily integrate real AI models (OpenAI, Anthropic, LangChain, LangGraph, etc.) without major refactoring.

---

## ✨ Features

### 🔐 Authentication & User Management
- **Email/Password registration and login**
- **JWT token-based authentication**
- Secure password hashing with bcrypt
- Protected API endpoints and Socket.IO connections

### 💬 Real-Time Chat
- **Bi-directional real-time communication** using Socket.IO
- **Multiple chat sessions** per user
- **Chat history persistence** in PostgreSQL
- **Message streaming support** for AI responses
- Toggle between **complete** and **streamed** AI responses

### 🏗️ Architecture & Design
- **Clean separation of concerns** (models, schemas, CRUD operations)
- **RESTful API design** following best practices
- **Database relationships** properly modeled (User → Chat → Messages)
- **Type hints and Pydantic schemas** for data validation
- **DRY principles** in both backend and frontend code

### 🐳 DevOps & Deployment
- **Docker Compose** for one-command startup
- **Separate containers** for database, backend, and frontend
- **Hot-reload** enabled for development
- **Health checks** for database readiness
- **Volume mounting** for live code updates

### 🎨 User Interface
- **Clean, modern UI** with Tailwind CSS
- **Responsive design** for mobile and desktop
- **Real-time typing indicators** during streaming
- **Auto-scrolling chat window**
- **Chat sidebar** with conversation history

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Socket.IO** - Real-time bidirectional communication
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Pydantic** - Data validation using Python type hints
- **uv** - Fast Python package installer

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Next-generation frontend build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - WebSocket client
- **Fetch API** - HTTP requests

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **PostgreSQL 15** - Database server

---

## 📋 Prerequisites

- **Docker** and **Docker Compose** installed
- **Node.js 18+** and **npm** (for local frontend development)
- **Git** for cloning the repository

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/chatbot-app.git
cd chatbot-app
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
npm install socket.io-client
cd ..
```

### 3. Start the Application

From the root directory:
```bash
docker-compose up --build
```

This command will:
- ✅ Start PostgreSQL database on port `5432`
- ✅ Start FastAPI backend on port `8000`
- ✅ Start React frontend on port `5173`
- ✅ Create database tables automatically
- ✅ Enable hot-reload for both backend and frontend

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

**Backend API Documentation:**
```
http://localhost:8000/docs
```

---

## 📖 Usage Guide

### First Time Setup

1. **Register a new account** with email and password
2. **Login** with your credentials
3. Click **"+ New Chat"** to create your first conversation
4. Start chatting!

### Features to Try

- **Toggle Streaming Mode**: Switch between complete responses and word-by-word streaming
- **Multiple Chats**: Create different chat sessions and switch between them
- **Persistent History**: Messages are saved and loaded when you return
- **Real-time Updates**: See AI responses appear in real-time

---

## 🏗️ Project Structure
```
chatbot-app/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app & routes
│   │   ├── database.py          # Database connection
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── auth.py              # JWT authentication
│   │   ├── crud.py              # Database operations
│   │   └── socketio_handler.py  # Socket.IO events
│   ├── pyproject.toml           # Python dependencies
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ChatList.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   └── MessageInput.jsx
│   │   ├── services/
│   │   │   ├── api.js           # REST API client
│   │   │   └── socket.js        # Socket.IO client
│   │   ├── App.jsx              # Main component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Tailwind styles
│   └── Dockerfile
│
├── docker-compose.yml           # Docker services configuration
├── .env                         # Environment variables
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Chats
- `POST /api/chats` - Create new chat
- `GET /api/chats` - Get all user chats
- `GET /api/chats/{chat_id}` - Get chat with messages

### Socket.IO Events

**Client → Server:**
- `send_message` - Send a new message
- `join_chat` - Join a chat room

**Server → Client:**
- `message_saved` - Message saved to database
- `ai_stream_start` - AI starts streaming response
- `ai_stream_chunk` - Chunk of AI response
- `ai_stream_end` - AI finished streaming
- `error` - Error occurred

---

## 📝 Future Enhancements

-  Integrate actual LLM (OpenAI, Claude, etc.)
-  Add message editing and deletion
-  Implement chat title auto-generation
-  Add file upload support
-  Implement RAG (Retrieval Augmented Generation)
-  Add user preferences and settings
-  Implement chat sharing functionality
-  Add markdown rendering for messages
-  Create admin dashboard
-  Add rate limiting and usage tracking

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author

**Your Name**
- GitHub: [@Malik-Talha](https://github.com/Malik-Talha)
- LinkedIn: [Talha Murtaza](https://www.linkedin.com/in/talha-murtaza-a393891b0/)

---

## 🙏 Acknowledgments

- FastAPI for the excellent async framework
- Socket.IO for real-time capabilities
- The React team for the amazing frontend library
- Tailwind CSS for utility-first styling

---

## 📧 Contact

For questions or feedback, please open an issue or reach out via realmaliktalha@gmail.com

---

**⭐ If you find this project helpful, please consider giving it a star!**