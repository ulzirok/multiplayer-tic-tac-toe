const { METHODS } = require('../constants');
const { handleJoin, handleStart, handleMove, handleRestart } = require('./socketController');

module.exports = function (ws, msg, aWss) {
    const data = JSON.parse(msg);
    const { method } = data;

    switch (method) {
        case METHODS.JOIN_ROOM:
            handleJoin(ws, data, aWss);
            break;

        case METHODS.START_GAME:
            handleStart(data, aWss);
            break;

        case METHODS.MAKE_MOVE:
            handleMove(ws, data, aWss);
            break;

        case METHODS.RESTART_GAME:
            handleRestart(data, aWss);
            break;
    }
};


