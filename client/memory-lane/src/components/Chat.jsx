import React, { useState } from "react";
import useSpeechRecognition from "../hooks/speechRecognitionHook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";

function Chat({ onEnd }) {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "Hi there! Welcome to memory lane's reminiscence therapy. We’ll discuss moments from your life—like favourite memories or places—to help you feel better and connected. What's one of your favourite memories or a special place that brings you joy?",
    },
  ]);
  const {
    text,
    startListening,
    stopListening,
    isListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  const API_URL = "https://memory-lane-a4e9.onrender.com/text-to-speech";

  function makeid(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const sendMessage = async (message) => {
    try {
      const randomized_URL = API_URL + "?" + makeid(10);
      const response = await fetch(randomized_URL, {
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
        const audioUrl = "https://memory-lane-a4e9.onrender.com/get-audio" + "?" + makeid(10);
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
              <div className="relative h-50 w-50">
                {isListening && (
                  <div
                    className="animate-spin blur-lg rounded-full bg-gradient-to-bl from-violet-500 to-fuchsia-500 w-50 h-50 absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"
                  ></div>
                )}
                <button
                  className="rounded-full bg-black w-40 h-40 relative z-10 inset-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  onClick={startListening}
                >
                  <FontAwesomeIcon
                    className="text-white text-5xl"
                    icon={faMicrophone}
                  />
                </button>
              </div>

              {isListening ? (
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
                  
                  <button
                    className="p-3 w-[150px] bg-black text-white rounded"
                    onClick={(e) => {
                      e.preventDefault();
                      onEnd();
                    }}
                  >
                    End Session
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
