import { useEffect, useState } from "react";

type props = {
    time : number;
    action : (value : boolean) => void;
}

export const useTimerLeft = ({time , action} : props) => {
    const [timeLeft , setTimeLeft] = useState<number>(time);

    useEffect(() => {
        if(timeLeft === 0) {
            action(false);
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime -1);
        }, 1000);

        return () => clearInterval(timerId)
    }, [timeLeft])

    return timeLeft;
}
