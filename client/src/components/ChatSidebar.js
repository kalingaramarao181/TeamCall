import React from "react";
import "./styles/ChatSidebar.css";
import { useLocation } from "react-router-dom";

function ChatSidebar({ users, onSelect, selectedUser, isMobileSidebarOpen, setIsMobileSidebarOpen }) {
    const location = useLocation();
  const username = location.state?.username || "Guest";
  return (
    <div className={`sidebar ${isMobileSidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>Chats</h2>
      </div>
      <ul className="user-list">
        {users.map((user) => (
          <li 
            key={user.id} 
            className={`user-item ${selectedUser.id === user.id ? "active" : ""}`}
            onClick={() => {
              onSelect(user);
              setIsMobileSidebarOpen(false);
            }}
          >
            <img src={user.avatar} alt={user.name} className="avatar"/>
            <div className="user-info">
              <p className="name">{user.name}</p>
              <span className="last-message">{user.lastMessage}</span>
            </div>
          </li>
        ))}
      </ul>
      <h1 className="chater-username">{username}</h1>
    </div>
  );
}

export default ChatSidebar;
