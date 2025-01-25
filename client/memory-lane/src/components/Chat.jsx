import React, { useState } from "react";
import useSpeechRecognition from "../hooks/speechRecognitionHook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

function Chat() {
  const [messages, setMessages] = useState([]);
  const {
    text,
    startListening,
    stopListening,
    isListining,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  const API_URL = "http://127.0.0.1:5000/text-to-speech";

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
        console.log("Data from backend: ", data);

        // Play the audio automatically
        const audioUrl = "http://127.0.0.1:5000/get-audio";
        const audio = new Audio(audioUrl);
        audio.play();

        // Append to messages
        setMessages((prev) => [
          ...prev,
          { role: "user", content: message },
          { role: "system", content: data.reply },
        ]);
      } else {
        console.error("Failed to send message", response);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      {hasRecognitionSupport ? (
        <>
          <div className="flex flex-row gap-10 w-full justify-center items-center">
            <div className="flex flex-col gap-10 justify-center items-center w-1/2">
              <button
                className="rounded-full bg-black w-40 h-40"
                onClick={startListening}
              >
                <FontAwesomeIcon
                  className="text-white text-5xl"
                  icon={faMicrophone}
                />
              </button>
              {isListining ? (
                <p className="bg-gray-100 p-3 w-[300px] rounded text-center">
                  The app is using your micmic❗️
                </p>
              ) : null}

              {text ? (
                <p className="flex gap-10 p-3 items-center bg-gray-100 rounded">
                  {text}
                  <button
                    className="p-3 w-[100px] bg-black text-white rounded"
                    onClick={() => sendMessage(text)}
                  >
                    Send
                  </button>
                </p>
              ) : null}
            </div>
            <div className="w-1/2">
              <div className="flex flex-col gap-10 bg-gray-100 p-10 rounded-xl max-h-100 overflow-y-auto">
                {messages.map((message, index) => {
                  return (
                    <p
                      key={index}
                      className={`p-3 rounded-lg w-4/5 ${
                        message.role === "user"
                          ? "bg-green-100 text-left self-start"
                          : "bg-gray-200 text-right self-end"
                      }`}
                    >
                      {message.content}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      ) : (
        <h1>No microphone support on this browser sorry</h1>
      )}
    </>
  );
}

export default Chat;
