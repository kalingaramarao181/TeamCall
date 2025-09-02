const CallTimer = ({ callTime }) => {
  const mins = Math.floor(callTime / 60);
  const secs = callTime % 60;
  return <p className="vc-timer">⏱ {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</p>;
};

export default CallTimer;
