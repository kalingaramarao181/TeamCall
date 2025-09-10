const IncomingCallModal = ({ incomingCall, onAnswer, onReject }) => {
  if (!incomingCall) return null;

  const getInitials = (name) => {
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

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
            {getInitials(incomingCall.from)}
          </div>
        </div>
        <p className="vc-modal-text">
          Incoming Voice Call from <strong>{incomingCall.from}</strong>
        </p>
        <div className="vc-actions">
          <button onClick={handleAnswer} className="vc-action vc-answer">
            Accept
          </button>
          <button onClick={handleReject} className="vc-action vc-reject">
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
