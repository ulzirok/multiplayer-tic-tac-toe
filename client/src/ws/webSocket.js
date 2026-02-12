let socket = null;

export const connectSocket = () => {
    if (!socket) {
        socket = new WebSocket("wss://://multiplayer-tic-tac-toe-ii7a.onrender.com/api/lobby");
    }
    return socket;
};

export const getSocket = () => socket;
