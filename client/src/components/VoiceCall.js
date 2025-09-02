import React, { useState, useRef, useEffect } from "react";
import { useWebRTC } from "../utils/useWebRTC";
import CallControls from "./CallControls";
import IncomingCallModal from "./IncomingCallModal";
import CallTimer from "./CallTimer";
import "./VoiceCall.css";

const VoiceCall = () => {
  const [username, setUsername] = useState("");
  const [peerName, setPeerName] = useState("");
  const [registered, setRegistered] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isRinging, setIsRinging] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const timerRef = useRef(null);

  // start timer when call starts
  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => setCallTime((t) => t + 1), 1000);
  };

  // stop timer when call ends
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCallTime(0);
  };

  const { startCall, answerCall, rejectCall, endCall } = useWebRTC(
    username,
    setIncomingCall,
    setInCall,
    setIsRinging,
    startTimer,
    stopTimer
  );

  // close modal automatically when call ends
  useEffect(() => {
    if (!inCall) {
      setIncomingCall(null);
      stopTimer();
    }
  }, [inCall]);

  const handleAnswer = (callData) => {
    answerCall(callData);
    setIncomingCall(null); // close modal after answering
    setInCall(true);
  };

  const handleReject = (callData) => {
    rejectCall(callData);
    setIncomingCall(null); // close modal after rejecting
    setInCall(false);
  };

  return (
    <div className="vc-container">
      <h2 className="vc-title">Voice Call Demo</h2>

      {!registered ? (
        <div className="vc-box">
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="vc-input"
          />
          <button
            onClick={() => setRegistered(true)}
            className="vc-btn vc-btn-primary"
            disabled={!username.trim()}
          >
            Register
          </button>
        </div>
      ) : (
        <CallControls
          isRinging={isRinging}
          inCall={inCall}
          peerName={{ value: peerName, set: setPeerName }}
          startCall={() => startCall(peerName)}
          endCall={() => {
            endCall();
            setInCall(false);
            stopTimer();
          }}
        />
      )}

      {/* Incoming call modal */}
      {incomingCall && !inCall && (
        <IncomingCallModal
          incomingCall={incomingCall}
          onAnswer={() => handleAnswer(incomingCall)}
          onReject={() => handleReject(incomingCall)}
        />
      )}

      {/* In-call status */}
      {inCall && (
        <div className="vc-call-status">
          <CallTimer callTime={callTime} />
          <audio id="remoteAudio" autoPlay></audio>
        </div>
      )}
    </div>
  );
};

export default VoiceCall;
