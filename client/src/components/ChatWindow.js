import React, { useState, useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import { FiSmile, FiPaperclip, FiSend } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import "./styles/ChatWindow.css";

// Dummy chats for different users
const dummyMessages = [
  { id: 1, userId: 1, sender: "them", text: "Hello! How are you?" },
  { id: 2, userId: 1, sender: "me", text: "I’m good, thanks! How about you?" },
  { id: 3, userId: 1, sender: "them", text: "Doing great, working on a project." },
  { id: 4, userId: 1, sender: "me", text: "Nice! Let’s discuss it tomorrow." },

  { id: 5, userId: 2, sender: "them", text: "Hey! Are you free today?" },
  { id: 6, userId: 2, sender: "me", text: "Not really, packed schedule 😅" },
  { id: 7, userId: 2, sender: "them", text: "Okay, let’s catch up later then!" },

  { id: 8, userId: 3, sender: "them", text: "Project updates done." },
  { id: 9, userId: 3, sender: "me", text: "Awesome! I’ll review them tonight." },
  { id: 10, userId: 3, sender: "them", text: "Cool, thanks 👍" },
];

function ChatWindow({ user, setIsMobileSidebarOpen, onStartCall }) {
  const [messages, setMessages] = useState(dummyMessages);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  // Filter messages only for the selected user
  const userMessages = messages.filter((msg) => msg.userId === user.id);

  // Auto-scroll to bottom when new messages come
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMessages]);

  // Send message
  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), userId: user.id, sender: "me", text: input },
    ]);
    setInput("");
    setShowEmojiPicker(false);
  };

  // Handle emoji click
  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          userId: user.id,
          sender: "me",
          text: `📎 Sent file: ${file.name}`,
        },
      ]);
    });
  };

  return (
    <div className="chat-window">
      <ChatHeader user={user} setIsMobileSidebarOpen={setIsMobileSidebarOpen} onCall={onStartCall} />

      {/* Messages */}
      <div className="messages">
        {userMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="emoji-picker-container">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {/* Input Area */}
      <div className="chat-input">
        {/* Emoji button */}
        <button
          className="chat-icon-btn"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <FiSmile />
        </button>

        {/* File Upload */}
        <label className="chat-icon-btn">
          <FiPaperclip />
          <input
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>

        {/* Text Input */}
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        {/* Send Button */}
        <button className="send-btn" onClick={sendMessage}>
          <FiSend />
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
