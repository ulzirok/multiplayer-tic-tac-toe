const sessions = require('../state/state');
const { GAME_STATUS } = require('../constants');

module.exports.getRooms = function (req, res) {
    try {
        const rooms = Object.keys(sessions).map(id => ({
            id,
            playersCount: sessions[id].players.length,
            status: sessions[id].started ? GAME_STATUS.PLAYING : GAME_STATUS.WAITING
        }));
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};