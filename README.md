# Playgorithm - Gamified Algorithm Learning Platform

## 🎮 Project Overview
**Playgorithm** is a full-stack web application that transforms algorithm learning into an engaging gaming experience. Built with Spring Boot backend and React frontend, it provides an interactive platform for developers to master algorithms through competitive coding challenges.

## ✨ Features

### 🔐 Authentication & User Management
- **JWT-based Authentication** - Secure login and registration
- **User Profiles** - Track progress, XP, level, and achievements
- **Session Management** - Persistent authentication across sessions

### 🎯 Interactive Coding Games
- **Multiple Game Categories**:
  - Sorting Algorithms
  - Graph Traversal
  - Dynamic Programming
  - Binary Search
  - Code Golf (shortest code challenge)
  - Speed Typing (code accuracy)

- **Real-time Code Editor** - Monaco Editor integration with syntax highlighting
- **Test Case Validation** - Immediate feedback on code submissions
- **Time-limited Challenges** - Adds competitive pressure
- **Multiple Language Support** - JavaScript, Python, Java

### 🏆 Gamification
- **XP & Leveling System** - Earn experience points for completing challenges
- **Global Leaderboard** - Compete with players worldwide
- **Game-specific Leaderboards** - Track performance per challenge
- **Achievements System** - Unlock badges and rewards
- **Win Rate Tracking** - Monitor your success metrics

### 🎨 Modern UI/UX
- **Animated Landing Page** - Eye-catching hero section with particles
- **Custom Cursor** - Gaming-themed target cursor
- **Responsive Design** - Works on all devices
- **Dark Gaming Theme** - Optimized for long coding sessions
- **Smooth Animations** - Framer Motion powered transitions

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.5.6** - Main framework
- **MongoDB** - NoSQL database for flexible data storage
- **Spring Security** - Authentication and authorization
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Maven** - Dependency management
- **Lombok** - Reduce boilerplate code

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Monaco Editor** - Code editor component
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **Bootstrap 5** - CSS framework

## 📁 Project Structure

```
Playgorithm/
├── Backend/
│   ├── src/main/java/com/super30/Playgorithm/
│   │   ├── config/          # Security, CORS, Data initialization
│   │   ├── controller/      # REST API endpoints
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── model/          # MongoDB entities
│   │   ├── repository/     # Data access layer
│   │   ├── security/       # JWT utilities, filters
│   │   └── service/        # Business logic
│   └── src/main/resources/
│       └── application.properties
│
└── Frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── context/        # React context (Auth)
    │   ├── pages/          # Main page components
    │   ├── services/       # API service layer
    │   └── assets/         # Images, fonts, etc.
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **Node.js 18** or higher
- **MongoDB** (local or Atlas)
- **Maven** (included via wrapper)

### Backend Setup

1. **Navigate to Backend directory**:
   ```bash
   cd Backend
   ```

2. **Configure MongoDB** in `application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/playgorithm
   ```

3. **Run the Spring Boot application**:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to Frontend directory**:
   ```bash
   cd Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   
   Frontend will start on `http://localhost:5173`

### First Time Setup

1. **MongoDB** will auto-initialize with sample games on first run
2. **Create an account** through the signup page
3. **Start playing games** from the dashboard!

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Games
- `GET /api/games` - Get all games
- `GET /api/games/{id}` - Get game by ID
- `GET /api/games/category/{category}` - Filter by category
- `POST /api/games/{gameId}/start` - Start a game session
- `POST /api/games/submit` - Submit code solution

### User
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile

### Leaderboard
- `GET /api/leaderboard/global` - Global leaderboard
- `GET /api/leaderboard/game/{gameId}` - Game-specific leaderboard

## 🎮 How to Play

1. **Sign Up / Login** - Create your account
2. **Browse Games** - Choose from various algorithm challenges
3. **Select Difficulty** - Easy, Medium, or Hard
4. **Code Solution** - Use the integrated Monaco editor
5. **Run Tests** - Validate your solution against test cases
6. **Submit** - Earn XP and climb the leaderboard!

## 📊 Game Categories

| Category | Description | Difficulty Range |
|----------|-------------|------------------|
| **Sorting** | Implement various sorting algorithms | Easy - Medium |
| **Searching** | Binary search, linear search challenges | Easy |
| **Graph** | BFS, DFS, shortest path problems | Medium - Hard |
| **Dynamic Programming** | Optimization challenges | Hard |
| **Code Golf** | Shortest code wins | Easy - Hard |
| **Speed Typing** | Type code accurately and fast | Easy |

## 🔧 Configuration

### Backend Configuration (`application.properties`)
```properties
# Server
server.port=8080

# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/playgorithm

# JWT
jwt.secret=your-secret-key-here
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:5173
```

### Frontend Configuration
Update API base URL in `src/services/api.js` if needed:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 🤖 Gemini Copilot Assistant

Playgorithm now bundles an on-site assistant powered by Google Gemini 2.0 Flash. The bot can watch routing and gameplay telemetry, stream real-time answers, and describe which backend APIs it would call before taking action.

### Backend setup
1. Create a Gemini API key and export it before launching Spring Boot:
   ```bash
   export GEMINI_API_KEY="your-key"
   ./mvnw spring-boot:run
   ```
2. (Optional) Override the model via `gemini.model` inside `Backend/src/main/resources/application.properties`.
3. New endpoints:
   - `POST /api/copilot/session` – bootstrap session (no auth required)
   - `POST /api/copilot/event` – push telemetry (JWT required)
   - `POST /api/copilot/chat` – NDJSON stream of response deltas (JWT required)

### Frontend setup
1. No additional env vars are needed; the widget reuses the API base URL.
2. The floating widget supports compact, comfort, and immersive sizes. Use the dropdown or expand button to resize.
3. Telemetry auto-publishes route/visibility changes. Inside any game, call `const { publishEvent } = useCopilot();` to share richer context like score, timer, or frustration signals.
4. When Gemini is unavailable, the backend falls back to an offline script so the UI keeps working.

## 🎨 Customization

### Adding New Games
Edit `Backend/src/main/java/com/super30/Playgorithm/config/DataInitializer.java`:
```java
createGame(
    "Your Game Name",
    "Description",
    "CATEGORY",
    "DIFFICULTY",
    xpReward,
    timeLimit,
    "Problem Statement",
    "Starter Code",
    testCases
)
```

### Modifying Themes
Update colors in respective CSS files:
- Main theme: `Frontend/src/App.css`
- Components: Individual component CSS files

## 🐛 Known Issues
- Code execution is currently simulated (not running actual code)
- Multiplayer features planned for future release
- Achievement unlock logic needs refinement

## 🚀 Future Enhancements
- [ ] Real code execution engine (Docker sandbox)
- [ ] WebSocket-based multiplayer battles
- [ ] More game categories
- [ ] Social features (friends, chat)
- [ ] Mobile app version
- [ ] AI-powered hints system
- [ ] Code quality metrics

## 👥 Contributors
- **SUPER-30 Team** - SEM-2 PROJECT

## 📝 License
This project is created for educational purposes.

## 🙏 Acknowledgments
- Monaco Editor by Microsoft
- Spring Boot framework
- React community
- MongoDB Atlas

## 📞 Support
For issues or questions, please open an issue on the GitHub repository.

---

**Happy Coding! 🎮💻**
