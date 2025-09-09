// src/utils/useWebRTC.js
import { useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("https://teamcall-api.bedatatech.com"); 

export function useWebRTC(
  username,
  setIncomingCall,
  setInCall,
  setIsRinging,
  startTimer,
  stopTimer
) {
  const pcRef = useRef(null);

  useEffect(() => {
    if (username) socket.emit("register", username);

    socket.on("incoming-call", async ({ from, offer }) => {
      setIncomingCall({ from, offer });
      setIsRinging(true);
    });

    socket.on("call-answered", async ({ from, answer }) => {
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(answer);
        setIsRinging(false);
        setInCall(true);
        startTimer();
      }
    });

    socket.on("call-rejected", ({ from }) => {
      alert(`Call rejected by ${from}`);
      cleanup();
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        if (pcRef.current) {
          await pcRef.current.addIceCandidate(candidate);
        }
      } catch (err) {
        console.error("Error adding ICE:", err);
      }
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-answered");
      socket.off("call-rejected");
      socket.off("ice-candidate");
    };
  }, [username]);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection();

    // Send ICE candidates to remote
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          from: username,
          to: pc.remoteUsername,
          candidate: event.candidate,
        });
      }
    };

    // Receive remote stream
    pc.ontrack = (event) => {
      console.log("Remote track received:", event.streams);
      let audio = document.getElementById("remoteAudio");
      if (!audio) {
        audio = document.createElement("audio");
        audio.id = "remoteAudio";
        audio.autoplay = true;
        document.body.appendChild(audio);
      }
      audio.srcObject = event.streams[0];
    };

    return pc;
  };

  const startCall = async (to) => {
    pcRef.current = createPeerConnection();
    pcRef.current.remoteUsername = to;

    // ✅ Add local audio
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) =>
      pcRef.current.addTrack(track, stream)
    );

    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);

    socket.emit("call-user", { from: username, to, offer });
    setIsRinging(true);
  };

  const answerCall = async (incomingCall) => {
    const { from, offer } = incomingCall;
    pcRef.current = createPeerConnection();
    pcRef.current.remoteUsername = from;

    // ✅ Add local audio
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) =>
      pcRef.current.addTrack(track, stream)
    );

    await pcRef.current.setRemoteDescription(offer);

    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);

    socket.emit("answer-call", { from: username, to: from, answer });
    setIsRinging(false);
    setInCall(true);
    startTimer();
  };

  const rejectCall = (incomingCall) => {
    if (incomingCall) {
      socket.emit("call-rejected", {
        from: username,
        to: incomingCall.from,
      });
    }
    cleanup();
  };

  const endCall = () => {
    cleanup();
    alert("Call ended");
  };

  const cleanup = () => {
    stopTimer();
    setIsRinging(false);
    setInCall(false);
    setIncomingCall(null);

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
  };

  return { startCall, answerCall, rejectCall, endCall };
}
