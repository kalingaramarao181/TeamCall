import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    // Navigate to dashboard with name in state
    navigate("/dashboard", { state: { username: name } });
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

export default Register;
