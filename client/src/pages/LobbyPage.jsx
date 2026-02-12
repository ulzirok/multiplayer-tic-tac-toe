import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { connectSocket, getSocket } from "../ws/webSocket.js";
import { METHODS } from "../constants.js";
import "../styles/LobbyPage.scss";
import { toast } from "react-toastify";

export default function LobbyPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [players, setPlayers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const socket = connectSocket();

    const handleMessage = (e) => {
      const data = JSON.parse(e.data);

      switch (data.method) {
        case METHODS.ERROR:
          toast.error(data.message);
          if (data.message === "Room is unavailable") {
            navigate("/rooms");
          }
          break;

        case METHODS.UPDATE_PLAYERS:
          setPlayers(data.players || []);
          setIsCreator(data.players?.[0] === localStorage.getItem("userName"));
          break;

        case METHODS.START_GAME:
          localStorage.setItem("symbol", data.symbol);
          navigate(`/game/${roomId}`);
          break;

        default:
          break;
      }
    };

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          method: METHODS.JOIN_ROOM,
          roomId,
          userName: localStorage.getItem("userName"),
        }),
      );
    };

    socket.onmessage = handleMessage;

    return () => {
      socket.onmessage = null;
    };
  }, [roomId, navigate]);

  const handleStart = () => {
    const socket = getSocket();
    if (!socket) return;

    socket.send(
      JSON.stringify({
        method: METHODS.START_GAME,
        roomId,
      }),
    );
  };

  const renderContent = () => {
    if (!isCreator)
      return <p>Connected. Waiting for the host to start the game...</p>;

    if (players.length !== 2) return <p>Waiting for opponent...</p>;

    return <button onClick={handleStart}>Start game</button>;
  };

  return (
    <div className="lobby">
      <h1>Lobby: {roomId}</h1>

      <h3>Players in room:</h3>
      <ul>
        {players.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      {renderContent()}
    </div>
  );
}
