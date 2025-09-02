const CallControls = ({ isRinging, inCall, peerName, startCall, endCall }) => (
  <div className="vc-box">
    <input
      type="text"
      placeholder="Enter peer name"
      value={peerName.value}
      onChange={(e) => peerName.set(e.target.value)}
      className="vc-input"
    />
    {!inCall ? (
      <button onClick={startCall} className="vc-btn vc-btn-success">Call</button>
    ) : (
      <button onClick={endCall} className="vc-btn vc-btn-danger">🔴 End Call</button>
    )}
    {isRinging && <p className="vc-status">📞 Calling {peerName.value}...</p>}
  </div>
);

export default CallControls;
