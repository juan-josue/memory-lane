import React, { useState } from "react";
import useSpeechRecognition from "../hooks/speechRecognitionHook";

function Chat() {
  const {
    text,
    startListening,
    stopListening,
    isListining,
    hasRecognitionSupport
  } = useSpeechRecognition();


  const API_URL = "https://example.com/api/messages";

  const sendMessage = async (message) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Data from backend: ", data)
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };


  return (
    <>
      { hasRecognitionSupport ? (
        <>
          <div>
            <button onClick={startListening}>Start listening</button>
            {isListining ? <p>The app is currently using your mic</p> : null}
            <p>{text}</p>
            { text ? <button onClick={sendMessage(text)}>Send message?</button> : null }
          </div>
        </>
      ) : <h1>No microphone support on this browser sorry</h1>}
    </>
  );
}

export default Chat;
