import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import VoiceCall from "../components/VoiceCall";
import io from "socket.io-client";
import "./ChatPage.css";

const socket = io("http://localhost:5000");

// Demo users
const dummyUsers = [
  { id: 1, name: "Mestulo", lastMessage: "Hey, how are you?", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: 2, name: "Moit", lastMessage: "Let’s catch up later!", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: 3, name: "Tont", lastMessage: "Project updates done.", avatar: "https://i.pravatar.cc/40?img=3" },
];

function ChatPage({ currentUser }) {
  const location = useLocation();
  const registeredUser = location.state?.username || currentUser?.name || "You";

  const [users, setUsers] = useState(dummyUsers); // demo users
  const [selectedUser, setSelectedUser] = useState(dummyUsers[0]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [callUser, setCallUser] = useState(null);

  // Add logged-in user to sidebar (optional, self)
  const usersWithLoggedIn = useMemo(() => {
    return [
      {
        id: 0,
        name: registeredUser,
        lastMessage: "This is your account",
        avatar: "https://i.pravatar.cc/40?img=11"
      },
      ...dummyUsers,
    ];
  }, [registeredUser]);

  useEffect(() => {
    if (!registeredUser) return;

    // Register current user on server
    socket.emit("register", registeredUser);

    // Listen for updated user list from server
    socket.on("userList", (list) => {
      const filtered = list.filter((u) => u !== registeredUser);

      const backendUsers = filtered.map((name, idx) => ({
        id: 1000 + idx,
        name,
        avatar: `https://i.pravatar.cc/150?u=${name}`,
        lastMessage: "",
      }));

      // Merge demo + backend users without duplicates
      const mergedUsers = [...dummyUsers];
      backendUsers.forEach((u) => {
        if (!mergedUsers.some((du) => du.name === u.name)) mergedUsers.push(u);
      });

      setUsers(mergedUsers);
    });

    return () => socket.off("userList");
  }, [registeredUser]);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar
        users={users}
        onSelect={setSelectedUser}
        selectedUser={selectedUser}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      {/* Chat Window */}
      <ChatWindow
        user={selectedUser}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        onStartCall={(peerName) => setCallUser(peerName)}
      />

      {/* Voice Call Overlay */}
      {callUser && (
        <div className="voice-call-overlay">
          <VoiceCall
            caller={registeredUser}
            callee={callUser}
            onClose={() => setCallUser(null)}
          />
        </div>
      )}
    </div>
  );
}

export default ChatPage;
