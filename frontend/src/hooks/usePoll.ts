import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';

export interface Option {
    id: string;
    text: string;
    isCorrect?: boolean;
    voteCount: number;
}

export interface Poll {
    _id: string;
    question: string;
    options: Option[];
    duration: number;
    startTime: string;
    status: 'waiting' | 'active' | 'closed';
}

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

export const usePoll = () => {
    const { socket } = useSocket();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch active poll on mount (handles refresh resilience)
    useEffect(() => {
        const fetchActivePoll = async () => {
            try {
                const res = await fetch(`${API_URL}/poll/active`);
                if (res.ok) {
                    const data = await res.json();
                    setPoll(data);
                } else {
                    setPoll(null);
                }
            } catch (err) {
                console.error('Failed to fetch active poll', err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivePoll();
    }, []);

    // Listen to socket events
    useEffect(() => {
        if (!socket) return;

        const handleStarted = (newPoll: Poll) => setPoll(newPoll);
        const handleUpdated = (updatedPoll: Poll) => setPoll(updatedPoll);
        const handleClosed = (closedPoll: Poll) => setPoll(closedPoll);

        socket.on('poll:started', handleStarted);
        socket.on('poll:updated', handleUpdated);
        socket.on('poll:closed', handleClosed);

        return () => {
            socket.off('poll:started', handleStarted);
            socket.off('poll:updated', handleUpdated);
            socket.off('poll:closed', handleClosed);
        };
    }, [socket]);

    return { poll, loading };
};
