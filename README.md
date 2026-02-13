# Real-Time Tic-Tac-Toe (Itransition Task 6)

A real-time multiplayer Tic-Tac-Toe game built with WebSocket and PostgreSQL.

**Deploy:** [https://cozy-douhua-c88ba3.netlify.app/](https://cozy-douhua-c88ba3.netlify.app/)

## Tech Stack
- **Frontend:** React
- **Backend:** Node.js, Express, WebSocket (ws), PostgreSQL

##  Features
- Real-time gameplay via WebSocket
- Lobby with available rooms
- Create and join game sessions
- Turn-based logic
- Win, Loss, Draw tracking
- Persistent user statistics (PostgreSQL)

## Database Structure
```
CREATE TABLE tictactoe_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Backend cold start
Бэкенд данного проекта задеплоен на бесплатном тарифе и может находиться в спящем режиме. При первом обращении к серверу после простоя запуск может занять до 30–60 секунд. Если приложение не отвечает сразу — пожалуйста, подождите немного и обновите страницу.

## Screenshots
![Login Page](./Screenshots/login.jpg)

![Room Page](./Screenshots/room.jpg)

![Start](./Screenshots/start.jpg)

![Board](./Screenshots/board.jpg)

![Result](./Screenshots/result.jpg)




