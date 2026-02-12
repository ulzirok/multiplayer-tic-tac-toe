const pool = require('../db');

module.exports.getStats = async function (req, res) {
    try {
        const result = await pool.query(
            'SELECT username, wins, losses, draws FROM tictactoe_users ORDER BY wins DESC'
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}