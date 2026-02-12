import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSocket } from "../ws/webSocket.js";
import { METHODS } from "../constants.js";
import Board from "../components/Board";
import "../styles/GamePage.scss";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function GamePage() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [mySymbol, setMySymbol] = useState(
    () => localStorage.getItem("symbol") || "",
  );
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleMessage = (e) => {
      const data = JSON.parse(e.data);

      switch (data.method) {
        case METHODS.ERROR:
          toast.error(data.message);
          break;

        case METHODS.OPPONENT_LEFT:
          toast.info(
            "Your opponent has left. You will be redirected to the Statistics page.",
          );
          navigate("/rooms");
          break;

        case METHODS.START_GAME:
          setMySymbol(data.symbol);
          setBoard(data.board);
          setTurn(data.currentTurn);
          break;

        case METHODS.UPDATE_GAME:
          setBoard(data.board);
          setTurn(data.currentTurn);
          setWinner(data.winner);
          setIsDraw(data.isDraw);
          break;

        default:
          break;
      }
    };

    socket.onmessage = handleMessage;

    return () => {
      socket.onmessage = null;
    };
  }, [navigate]);

  const handleRestart = () => {
    const socket = getSocket();
    if (!socket) return;

    socket.send(
      JSON.stringify({
        method: METHODS.RESTART_GAME,
        roomId,
      }),
    );

    setWinner(null);
    setIsDraw(false);
  };
  
  return (
    <div className="game-page">
      <div className="top">
        <h3>
          Your symbol: <span>{mySymbol}</span>
        </h3>
        <h3>
          Turn: <span>{turn}</span>
        </h3>
      </div>

      {winner && <div className="winner">Winner: {winner}</div>}

      <div className="status">
        {winner
          ? "Finished"
          : turn === mySymbol
            ? "Your turn!"
            : "Opponent's turn..."}
      </div>

      <Board board={board} roomId={roomId} mySymbol={mySymbol} turn={turn} />

      <button onClick={handleRestart}>Restart</button>

      {(winner || isDraw) && (
        <Modal
          winner={winner}
          isDraw={isDraw}
          onRestart={handleRestart}
          onExit={() => navigate("/rooms")}
        />
      )}
    </div>
  );
}
