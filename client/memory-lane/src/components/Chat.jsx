import React, { useState } from "react";

function Chat() {
  const [messages, setMessages] = useState([{ text: "First message" }, { text: "Second message" }]);
  const [input, setInput] = useState("");

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
        setMessages((prev) => [...prev, { id: data.id, text: data.message }]);
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key == "Enter" && input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.text}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Share your story..."
      />
    </>
  );
}

export default Chat;
