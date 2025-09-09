import VoiceCall from "./components/VoiceCall";
import ChatPage from "./pages/ChatPage";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Register from "./pages/Register";

function DashboardWrapper() {
  const location = useLocation(); // ✅ Now inside a Router context
  return <ChatPage currentUser={{ name: location.state?.username }} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/dashboard/*" element={<DashboardWrapper />} />
        <Route path="/voice" element={<VoiceCall />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
