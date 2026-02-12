const { METHODS } = require('../constants');
const { handleJoin, handleStart, handleMove, handleRestart } = require('./socketController');
const sessions = require('../state/state');

module.exports = function (ws, msg, aWss) {
    const data = JSON.parse(msg);
    const { method } = data;

    switch (method) {
        case METHODS.JOIN_ROOM:
            handleJoin(ws, data, aWss, sessions);
            break;

        case METHODS.START_GAME:
            handleStart(data, aWss, sessions);
            break;

        case METHODS.MAKE_MOVE:
            handleMove(ws, data, aWss, sessions);
            break;

        case METHODS.RESTART_GAME:
            handleRestart(data, aWss, sessions);
            break;
    }
};


