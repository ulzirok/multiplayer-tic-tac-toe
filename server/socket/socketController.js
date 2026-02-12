const pool = require('../db');
const Game = require('../models/game');
const broadcast = require('../utils/broadcast');
const { METHODS, PLAYER_SYMBOLS, USER_STATS } = require('../constants');
const sessions = require('../state/state');

const handleJoin = (ws, data, aWss, sessions) => {
    const { roomId, userName } = data;
    ws.roomId = roomId;
    const session = sessions[roomId];
    if (!session) return ws.send(JSON.stringify({ method: METHODS.ERROR, message: "Room not found" }));
    if (session.players.length >= 2) return ws.send(JSON.stringify({ method: METHODS.ERROR, message: "Room is unavailable" }));
    if (!session.players.find(p => p.name === userName)) session.players.push({ name: userName, socket: ws });

    broadcast(aWss, roomId, {
        method: METHODS.UPDATE_PLAYERS,
        players: session.players.map(p => p.name)
    });
};

const handleStart = (data, aWss, sessions) => {
    const { roomId } = data;
    const session = sessions[roomId];

    if (!session) return;
    if (session.players.length !== 2) return;
    if (session.started) return;

    session.started = true;
    session.game = new Game();

    session.players[0].symbol = PLAYER_SYMBOLS.X;
    session.players[1].symbol = PLAYER_SYMBOLS.O;

    session.players.forEach(player => {
        player.socket.send(JSON.stringify({
            method: METHODS.START_GAME,
            symbol: player.symbol,
            board: session.game.board,
            currentTurn: session.game.currentTurn
        }));
    });
};

const updateStats = async (name, result) => {
    const stats = result === USER_STATS.WIN ? 'wins' : (result === USER_STATS.LOSS ? 'losses' : 'draws');

    const query = `
        INSERT INTO users (username, ${stats}) 
        VALUES ($1, 1) 
        ON CONFLICT (username) 
        DO UPDATE SET ${stats} = users.${stats} + 1;
    `;

    try {
        await pool.query(query, [name]);
    } catch (err) {
        console.error(err.message);
    }
};

const validateMove = (session, ws, symbol) => {
    if (!session || !session.started) return false;

    const player = session.players.find(p => p.socket === ws);
    if (!player) return false;

    if (player.symbol !== symbol) return false;

    return player;
};

const applyMove = (session, index, symbol) => {
    return session.game.makeMove(index, symbol);
};

const broadcastGameUpdate = (aWss, roomId, game) => {
    broadcast(aWss, roomId, {
        method: METHODS.UPDATE_GAME,
        board: game.board,
        currentTurn: game.currentTurn,
        winner: game.winner,
        isDraw: game.isDraw
    });
};

const handleGameResult = async (session) => {
    const game = session.game;

    if (game.statsUpdated) return;

    if (game.winner) {
        const winner = session.players.find(p => p.symbol === game.winner);
        const loser = session.players.find(p => p.symbol !== game.winner);

        if (winner) await updateStats(winner.name, USER_STATS.WIN);
        if (loser) await updateStats(loser.name, USER_STATS.LOSS);

        game.statsUpdated = true;
        return;
    }

    if (game.isDraw) {
        await Promise.all(
            session.players.map(p =>
                updateStats(p.name, USER_STATS.DRAW)
            )
        );

        game.statsUpdated = true;
    }
};

const handleMove = async (ws, data, aWss, sessions) => {
    const { roomId, index, symbol } = data;
    const session = sessions[roomId];

    const player = validateMove(session, ws, symbol);
    if (!player) return;

    const valid = applyMove(session, index, symbol);

    if (!valid) {
        return ws.send(JSON.stringify({
            method: METHODS.ERROR,
            message: "Invalid move: the cell is unavailable or it is not your turn"
        }));
    }

    broadcastGameUpdate(aWss, roomId, session.game);

    await handleGameResult(session);
};

const handleRestart = (data, aWss, sessions) => {
    const { roomId } = data;
    const session = sessions[roomId];

    if (!session || session.players.length < 2) return;

    session.game = new Game();
    session.game.statsUpdated = false;
    session.started = true;

    broadcast(aWss, roomId, {
        method: METHODS.UPDATE_GAME,
        board: session.game.board,
        currentTurn: session.game.currentTurn,
        winner: null,
        isDraw: false
    });
};

const handleClose = (ws, aWss) => {
    const roomId = ws.roomId;
    if (!roomId) return;

    const session = sessions[roomId];
    if (session) {
        broadcast(aWss, roomId, {
            method: METHODS.OPPONENT_LEFT,
            message: "Your opponent has left. You will be redirected to the Statistics page."
        });

        session.players = session.players.filter(p => p.socket !== ws);
        session.started = false;

        if (session.players.length === 0) {
            delete sessions[roomId];
        }
    }
};

module.exports = {
    handleJoin,
    handleStart,
    handleMove,
    handleRestart,
    handleClose
};