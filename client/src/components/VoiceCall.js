import React, { useState, useRef, useEffect } from "react";
import { useWebRTC } from "../utils/useWebRTC";
import CallControls from "./CallControls";
import IncomingCallModal from "./IncomingCallModal";
import CallTimer from "./CallTimer";
import "./VoiceCall.css";

const VoiceCall = ({ caller, callee }) => {
  const [username] = useState(caller);
  const [peerName, setPeerName] = useState(callee);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isRinging, setIsRinging] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => setCallTime((t) => t + 1), 1000);
  };

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

  useEffect(() => {
    if (!inCall) {
      setIncomingCall(null);
      stopTimer();
    }
  }, [inCall]);

  const handleAnswer = (callData) => {
    answerCall(callData);
    setIncomingCall(null);
    setInCall(true);
  };

  const handleReject = (callData) => {
    rejectCall(callData);
    setIncomingCall(null);
    setInCall(false);
  };

  const handleStartCall = () => {
    if (peerName) startCall(peerName);
  };

  return (
    <div className="vc-container">
      <div className="vc-main-box">
        <CallControls
          isRinging={isRinging}
          inCall={inCall}
          peerName={{ value: peerName, set: setPeerName }}
          startCall={handleStartCall}
          endCall={() => {
            endCall();
            setInCall(false);
            stopTimer();
          }}
        />

        {incomingCall && !inCall && (
          <IncomingCallModal
            incomingCall={incomingCall}
            onAnswer={() => handleAnswer(incomingCall)}
            onReject={() => handleReject(incomingCall)}
          />
        )}

        {inCall && (
          <div className="vc-call-status">
            <CallTimer callTime={callTime} />
            {/* 🔹 Local (muted) + Remote audio */}
            <audio id="localAudio" autoPlay muted></audio>
            <audio id="remoteAudio" autoPlay></audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceCall;
