import { useState, useEffect } from 'react';

export function usePollTimer(startTime: string | Date | null, duration: number) {
    const [remainingTime, setRemainingTime] = useState<number>(0);

    useEffect(() => {
        if (!startTime || duration <= 0) {
            setRemainingTime(0);
            return;
        }

        const startMs = new Date(startTime).getTime();

        const updateTimer = () => {
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - startMs) / 1000);
            const remaining = duration - elapsedSeconds;

            if (remaining <= 0) {
                setRemainingTime(0);
            } else {
                setRemainingTime(remaining);
            }
        };

        updateTimer(); // Initial call
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [startTime, duration]);

    return remainingTime;
}
