let socket = null;

export const connectSocket = () => {
    if (!socket || socket.readyState >= 2) {
        socket = new WebSocket("wss://multiplayer-tic-tac-toe-ii7a.onrender.com/api/lobby");
        // socket = new WebSocket("ws://localhost:5000/api/lobby");

        socket.onclose = () => {
            socket = null;
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            socket = null;
        };
    }
    return socket;
};

export const getSocket = () => socket;
