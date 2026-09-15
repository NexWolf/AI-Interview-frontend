import { useEffect, useRef, useState } from "react"

type UseTimeProps = {
    endTimeIso : string | null | undefined,
    onExpire : () => void
}

export const useInterviewTimer = ({endTimeIso , onExpire} : UseTimeProps) => {
    const [secondsLeft , setSecondsLeft] = useState<number>(0);
    const hasExpiredRef  = useRef(false);
    const onExpireRef = useRef(onExpire);
    onExpireRef.current = onExpire;

    useEffect(() => {
        if(!endTimeIso)return;

        hasExpiredRef.current = false;

        const calculateRemainingSeconds = () => {
            const targetTime = new Date(endTimeIso).getTime();
            const now = new Date().getTime();
            const differenceInSeconds = Math.floor((targetTime - now) / 1000);
            return differenceInSeconds > 0 ? differenceInSeconds : 0;
        }

        const initialSeconds = calculateRemainingSeconds();
        setSecondsLeft(initialSeconds);

        if(initialSeconds <= 0 && !hasExpiredRef.current) {
            hasExpiredRef.current  = true;
            onExpireRef.current();
            return;
        }

        const intervalId = setInterval(() => {
            const remaining = calculateRemainingSeconds();
            setSecondsLeft(remaining);

            if(remaining <= 0) {
                clearInterval(intervalId);
                if(!hasExpiredRef.current) {
                    hasExpiredRef.current = true;
                    onExpireRef.current();
                }
            }
        },1000)

        return () => clearInterval(intervalId);
    },[endTimeIso])

    const formateTime = (totalSeconds : number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const paddedMinutes = String(minutes).padStart(2 , "0");
        const paddedSeconds = String(seconds).padStart(2 , "0");
        return `${paddedMinutes} : ${paddedSeconds}`
    }

    return {
        formattedTime : formateTime(secondsLeft),
        isExpired : secondsLeft <= 0,
    }

}
