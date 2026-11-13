
import { io } from "socket.io-client";

let socket;

export const connectSocket = () => {
    if (!socket) {
        socket = io("http://localhost:3000", {
            withCredentials: true,
            autoConnect: false
        });
    }

    if (!socket.connected) {
        socket.connect();
    }

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
