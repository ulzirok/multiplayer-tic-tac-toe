import { getSocket } from "../ws/webSocket";
import { METHODS } from "../constants.js";
import "../styles/Board.scss";

export default function Board({ board, roomId, mySymbol, turn }) {
  const handleSquareClick = (index) => {
    const socket = getSocket();
    if (board[index] || turn !== mySymbol) return;
    socket.send(
      JSON.stringify({
        method: METHODS.MAKE_MOVE,
        roomId: roomId,
        index: index,
        symbol: mySymbol,
      }),
    );
  };

  return (
    <div className="board">
      {board.map((square, i) => (
        <button
          key={i}
          onClick={() => handleSquareClick(i)}
          disabled={board[i] || turn !== mySymbol}
        >
          {square}
        </button>
      ))}
    </div>
  );
}
