let socket = null;

export const connectSocket = () => {
    if (!socket) {
        socket = new WebSocket("ws://localhost:5000/api/lobby");
    }
    return socket;
};

export const getSocket = () => socket;
