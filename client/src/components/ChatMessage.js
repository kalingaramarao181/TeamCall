// src/components/ChatMessage.jsx
import React from "react";
import "./styles/ChatMessage.css";

export default function ChatMessage({ message }) {
  const isMe = message.sender === "me";

  return (
    <div className={`chat-message ${isMe ? "me" : "them"}`}>
      <div className="bubble">
        <div className="text">{message.text}</div>
        <div className="meta">{isMe ? "You" : "Them"}</div>
      </div>
    </div>
  );
}
