import React from "react";
import { FiArrowLeft, FiPhone, FiVideo, FiMoreVertical } from "react-icons/fi";
import "./styles/ChatHeader.css";

function ChatHeader({ user, setIsMobileSidebarOpen, onCall }) {
  return (
    <div className="chat-header">
      {/* Back button (only for mobile) */}
      <button className="back-btn" onClick={() => setIsMobileSidebarOpen(true)}>
        <FiArrowLeft />
      </button>

      {/* Avatar + Name */}
      <div className="chat-user">
        <img src={user.avatar} alt={user.name} className="avatar" />
        <h3>{user.name}</h3>
      </div>

      {/* Action buttons */}
      <div className="chat-actions">
        <button className="icon-btn" onClick={() => onCall(user.name)}>
          <FiPhone />
        </button>
        <button className="icon-btn">
          <FiVideo />
        </button>
        <button className="icon-btn">
          <FiMoreVertical />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
