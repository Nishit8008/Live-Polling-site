import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const SOCKET_URL = BACKEND_URL;

let socketInstance: Socket | null = null;

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(socketInstance);
    const [isConnected, setIsConnected] = useState<boolean>(socketInstance?.connected || false);

    useEffect(() => {
        if (!socketInstance) {
            socketInstance = io(SOCKET_URL, {
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            socketInstance.on('connect', () => setIsConnected(true));
            socketInstance.on('disconnect', () => setIsConnected(false));
        }

        setSocket(socketInstance);

        return () => {
            // We don't disconnect on unmount so the user stays connected across page transitions.
        };
    }, []);

    return { socket, isConnected };
};
