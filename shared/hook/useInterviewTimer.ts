import { useEffect, useRef, useState } from "react"

type UseTimeProps = {
    endTimeIso?: string | null | undefined;
    durationMinutes?: number | null | undefined;
    onExpire: () => void;
};

export const useInterviewTimer = ({ endTimeIso, durationMinutes, onExpire }: UseTimeProps) => {
    const fallbackSeconds = (durationMinutes && durationMinutes > 0 ? durationMinutes : 20) * 60;
    const [secondsLeft, setSecondsLeft] = useState<number>(fallbackSeconds);
    const hasExpiredRef = useRef(false);
    const onExpireRef = useRef(onExpire);
    onExpireRef.current = onExpire;

    useEffect(() => {
        let initialRemaining = fallbackSeconds;

        if (endTimeIso) {
            const targetTime = new Date(endTimeIso).getTime();
            if (!isNaN(targetTime)) {
                const now = Date.now();
                const diff = Math.floor((targetTime - now) / 1000);
                if (diff > 0) {
                    initialRemaining = diff;
                }
            }
        }

        setSecondsLeft(initialRemaining);
        hasExpiredRef.current = false;

        const intervalId = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalId);
                    if (!hasExpiredRef.current) {
                        hasExpiredRef.current = true;
                        onExpireRef.current();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [endTimeIso, fallbackSeconds]);

    const formatTime = (totalSeconds: number) => {
        const safeSeconds = Math.max(0, totalSeconds);
        const minutes = Math.floor(safeSeconds / 60);
        const seconds = safeSeconds % 60;
        const paddedMinutes = String(minutes).padStart(2, "0");
        const paddedSeconds = String(seconds).padStart(2, "0");
        return `${paddedMinutes} : ${paddedSeconds}`;
    };

    return {
        formattedTime: formatTime(secondsLeft),
        secondsLeft,
        isExpired: secondsLeft <= 0,
    };
};
