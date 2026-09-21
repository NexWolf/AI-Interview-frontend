import { useEffect, useRef } from "react";
import { useMediaStream } from "../components/provider/MediaStermProvider";
import { AxiosAPI } from "../lib/AxiosAPI";
import axios from "axios";

type IntegrityEvent = {
    type : "camera_off" | "camera_muted" | "mic_off" | "mic_muted" | "mic_restored";
    timestamp: string;
}

type MonitorProps = {
    interviewId : string | null,
    onViolation : (event : IntegrityEvent) => void;
}

export const useIntegrityMonitor = ({interviewId , onViolation} : MonitorProps) => {
    const {videoStatus , audioStatus} = useMediaStream();
    const prevVideoStatus = useRef<string>("loading");
    const prevAudioStatus = useRef<string>("loading");


    /* Send to backend the event */
    const logEvent = async (event : IntegrityEvent) => {
        // try {
        //     AxiosAPI.post("/api/v1/streamStatus/", event)
        // }catch(e) {
        //     if(axios.isAxiosError(e)) {
        //         console.log(e);
        //     }
        // }
    }

    useEffect(() => {
        if(prevAudioStatus.current === "ready" && audioStatus !== "ready") {
             const event : IntegrityEvent = {
                type : audioStatus === "muted" ? "mic_muted" : "mic_off",
                timestamp : new Date().toISOString()
            }

            onViolation(event);
            logEvent(event);
        }

        if(prevAudioStatus.current !== "ready" && audioStatus === "ready" && prevVideoStatus.current !== "loading") {
            const event : IntegrityEvent = {
                type : "mic_restored",
                timestamp : new Date().toISOString(),
            }

            onViolation(event);
            logEvent(event);
        }

        prevAudioStatus.current = audioStatus;
    }, [audioStatus])

    useEffect(() => {
        if(prevVideoStatus.current !== "ready" && videoStatus === "ready" ){
            const event : IntegrityEvent = {
                type : "camera_off", // camera back
                timestamp : new Date().toISOString()
            }

            onViolation(event);
            logEvent(event);
        }

        if(prevVideoStatus.current === "ready" && videoStatus !== "ready") {
            const event : IntegrityEvent = {
                type : videoStatus === "muted" ? "camera_muted" : "camera_off",
                timestamp : new Date().toISOString() 
            }

            onViolation(event);
            logEvent(event);
        }

        prevVideoStatus.current = videoStatus;
        
    },[videoStatus])



}