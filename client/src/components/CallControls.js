const CallControls = ({ isRinging, inCall, peerName, startCall, endCall }) => (
  <div className="vc-box">
    <h3 className="vc-title">Voice Call to <span className="vc-title-username">{peerName.value}</span></h3>
    {!inCall ? (
      <button onClick={startCall} className="vc-btn vc-btn-success">Call</button>
    ) : (
      <button onClick={endCall} className="vc-btn vc-btn-danger">🔴 End Call</button>
    )}
    {isRinging && <p className="vc-status">📞 Calling {peerName.value}...</p>}
  </div>
);

export default CallControls;
