import { useEffect, useState } from "react";

let recognition;
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";
}

const useSpeechRecognition = () => {
  const [text, setText] = useState("");
  const [isListining, setIsListining] = useState(false);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      console.log("event result: ", event);
      setText(event.results[0][0].transcript)
      recognition.stop();
      setIsListining(false);
    };
  }, []);

  const startListening = () => {
    setText("");
    setIsListining(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListining(false);
    recognition.stop();
  };

  return {
    text,
    isListining,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognition,
  }
};

export default useSpeechRecognition;
