
interface SpeechRecognition {
    start();
    stop();
    lang  : string,
    continuous : boolean;
    interimResults : boolean,
    onresult : ((event : SpeechRecognitionEvent) => void) | null,
    onerror : ((event : SpeechRecognitionErrorEvent) => void) | null,
    onend : (()=> void) | null;
    onstart : (() => void) | null;
}

interface SpeechRecognitionConstructor {
    new () : SpeechRecognition,
}


interface Window {
    webkitSpeechRecognition : SpeechRecognitionConstructor,
    SpeechRecognition : SpeechRecognitionConstructor
}