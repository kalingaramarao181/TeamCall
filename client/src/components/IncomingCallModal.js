const IncomingCallModal = ({ incomingCall, onAnswer, onReject }) => {
  if (!incomingCall) return null;

  const handleAnswer = () => {
    onAnswer(incomingCall); // pass caller info
  };

  const handleReject = () => {
    onReject(incomingCall);
  };

  return (
    <div className="vc-overlay">
      <div className="vc-modal">
        <div className="vc-avatar-ring">
          <div className="vc-avatar">
            {incomingCall.from.charAt(0).toUpperCase()}
          </div>
        </div>
        <p className="vc-modal-text">
          Incoming call from <strong>{incomingCall.from}</strong>
        </p>
        <div className="vc-actions">
          <button onClick={handleAnswer} className="vc-action vc-answer">
            ✅
          </button>
          <button onClick={handleReject} className="vc-action vc-reject">
            ❌
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
