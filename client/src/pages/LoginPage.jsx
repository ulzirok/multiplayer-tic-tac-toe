import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.scss";


export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!userName) return;
    localStorage.setItem("userName", userName);
    navigate("/rooms");
  };

  return (
    <div className="login">
      <h1>Tic Tac Toe</h1>
      <p>
        The winner is the first one to line up three symbols (either X or O)
        vertically, horizontally, or diagonally.
      </p>
      <input
        placeholder="Enter your name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        required
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

