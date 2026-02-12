const sessions = require('../state/state');
const pool = require('../db');
const { randomUUID } = require("crypto");

module.exports.createSession = async function (req, res) {
    try {
        const { username } = req.body;
        await pool.query(
            'INSERT INTO tictactoe_users (username) VALUES ($1) ON CONFLICT (username) DO NOTHING',
            [username]
        );
        const roomId = randomUUID();
        sessions[roomId] = {
            players: [],
            game: null,
            started: false
        };
        res.status(201).json({ roomId });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

