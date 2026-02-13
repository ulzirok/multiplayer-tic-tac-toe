const sessions = require('../state/state');
const { GAME_STATUS, METHODS } = require('../constants');

module.exports.getRooms = function (req, res) {
    try {
        const rooms = Object.keys(sessions).map(id => {
            const session = sessions[id];
            let currentStatus = GAME_STATUS.WAITING;

            if (session.isFinished) {
                currentStatus = METHODS.FINISHED;
            } else if (session.started) {
                currentStatus = GAME_STATUS.PLAYING;
            }

            return {
                id,
                playersCount: session.players.length,
                status: currentStatus
            };
        });

        res.status(200).json(rooms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};