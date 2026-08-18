/* THIS HOOK USE TO GET MICROPHONEAND MEDIASTREAM AND RECORD THE VOICE*/

import { useEffect, useRef, useState } from "react";

/* HERE WE STORE THE CHUNKS IN ARRAY => NOTE : VOICE LIKE A ALOT OF CHUNKS WE MUST STORED IN ARRAY  */
    const audioChunks: Blob[] = []
    /* THE TIME OF SILENCE 2 SECOUNDS */
    const  SILENCE_DURATION = 2000;

export function useAudioRecorder() {
    /* STREAM REF USED TO CONNECTED IN MICROPHONE */
    const streamRef = useRef<MediaStream | null>(null);
    /* RECORDER REF USED TO RECORD THE AUDIO */
    const recordRef = useRef<MediaRecorder | null>(null);
    /* SAVE THE THERSOLD ITS A RATE OF AUDIO WHEN SILENT =< 10 AND WHEN TAKE >= 11 */
    const silenceStartRef = useRef<number | null>(null);



    const [isListening, setIsListening] = useState<boolean>(false);
    

const stopListening = () => {
            recordRef.current?.stop();
            setIsListening(false)
        }





    const startListening = async () => {
        /* STREAM HERE IS THE CONNECTION IN MICROPHONE */
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        })
        streamRef.current = stream;


        /* RECORDER HERE IS THE TOOLS USED TO RECORED AUDIO AND CONNECT WITH STREAM "MIC CONNECT WITH RECORD TOOL" */
        const recorder = new MediaRecorder(stream);
        recordRef.current = recorder;

        /* START RECORD USER AUDIO */
        recorder.start();
        setIsListening(true);


        /* DATAAVAILABLE IS CUT THE VOICE TO ALOT OF CHUNCKS */
        recorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        }

        /* WHEN STOP WE STORE THE CHUNCKS IN BLOB */
        recorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, {
                type: recorder.mimeType,
            })
            console.log(audioBlob)
        }

        const audioContext = new AudioContext();

        /* TAKE THE SOUND FROM STREAM AND CONVERT IT TO SOURCE TO ANALYZE IT */
        const source = audioContext.createMediaStreamSource(stream);

        /* HERE WE CHECK THE SOUND IS HIGH OR LOW , THERE IS SOUND OR NO?  */
        const analyzer = audioContext.createAnalyser();
        source.connect(analyzer);

        /* HERE WE PUT THE SOUND DATA IN SPACIAL ARRAY */
        const dataArray = new Uint8Array(analyzer.frequencyBinCount);

        const checkAudio = () => {
            /* HERE WE GET THE DATA */
        analyzer.getByteFrequencyData(dataArray);
        
        /* GET THE AVARAGE OF NUMBER IN THE ARRAY */
            const average = dataArray.reduce((sum , value) => sum + value , 0) / dataArray.length;

            if(average <= 10) {
                if(silenceStartRef.current === null) {
                    silenceStartRef.current = Date.now();
                }

                const silenceDuration = Date.now() - silenceStartRef.current;

                if(silenceDuration >= SILENCE_DURATION) {
                    stopListening();
                    return;
                }
            }else {
                silenceStartRef.current = null;
            }
        requestAnimationFrame(checkAudio)
        }

        checkAudio()
    }

    return {
        isListening, startListening, stopListening,
    }
}