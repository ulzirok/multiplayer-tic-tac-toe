import GamePage from "./pages/GamePage";
import LoginPage from "./pages/LoginPage";
import LobbyPage from "./pages/LobbyPage";
import RoomsPage from "./pages/RoomsPage";
import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/lobby/:roomId" element={<LobbyPage />} />
          <Route path="/game/:roomId" element={<GamePage />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" theme="dark" autoClose={3000} />
    </BrowserRouter>
  );
}
