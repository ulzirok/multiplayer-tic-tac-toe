import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms } from "../api/getRooms.api";
import { createSession } from "../api/createSession.api";
import { getUserStats } from "../api/getUserStats.api";
import "../styles/RoomsPage.scss";
import { toast } from "react-toastify";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [roomsData, statsData] = await Promise.all([
        getRooms(),
        getUserStats(),
      ]);

      setRooms(roomsData);
      setUserStats(statsData);
    } catch (err) {
      toast.error(
        err.message || "The server is unavailable. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleCreate = async () => {
    try {
      const data = await createSession(userName);
      navigate(`/lobby/${data.roomId}`);
    } catch (err) {
      toast.error(
        err.message || "The server is unavailable. Please try again later.",
      );
    }
  };

  return (
    <div className="rooms-container">
      <div className="rooms-card">
        <h2>Hello, {userName}!</h2>

        <button className="create-btn" onClick={handleCreate}>
          + Create New Game
        </button>

        <div className="list-header">Available Rooms:</div>

        <div className="rooms-list">
          {loading && <p>Loading...</p>}

          {!loading && rooms.length === 0 && (
            <p className="empty">There are no available rooms yet...</p>
          )}

          {rooms.map((room) => (
            <div key={room.id} className="room-item">
              <span>{room.status}</span>

              <button
                disabled={
                  room.playersCount >= 2 ||
                  room.status.toLowerCase() === "playing"
                }
                onClick={() => navigate(`/lobby/${room.id}`)}
              >
                Join
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="users-stats">
        <h3>User Statistics</h3>

        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Draws</th>
            </tr>
          </thead>
          <tbody>
            {userStats.map((user) => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>{user.wins}</td>
                <td>{user.losses}</td>
                <td>{user.draws}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
