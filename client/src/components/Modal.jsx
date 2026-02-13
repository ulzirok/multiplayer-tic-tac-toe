import "../styles/Modal.scss";

export default function Modal({ winner, isDraw, isOpponentGone, onRestart, onExit }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Game over!</h2>
        <div className="result-text">
          {isDraw ? "Draw!" : `Winner: ${winner}`}
        </div>
        <div className="modal-buttons">
          {!isOpponentGone && (
            <button className="btn-restart" onClick={onRestart}>
              Play again
            </button>
          )}
          <button className="btn-exit" onClick={onExit}>
            Come back to statistics page
          </button>
        </div>
      </div>
    </div>
  );
}
