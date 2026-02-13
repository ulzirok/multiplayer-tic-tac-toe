const METHODS = {
    JOIN_ROOM: 'JOIN_ROOM',
    START_GAME: 'START_GAME',
    MAKE_MOVE: 'MAKE_MOVE',
    UPDATE_GAME: 'UPDATE_GAME',
    RESTART_GAME: 'RESTART_GAME',
    UPDATE_PLAYERS: 'UPDATE_PLAYERS',
    OPPONENT_LEFT: 'OPPONENT_LEFT',
    FINISHED: 'FINISHED',
    ERROR: 'ERROR'
};

const PLAYER_SYMBOLS = {
    X: 'X',
    O: 'O'
};

const GAME_STATUS = {
    WAITING: 'Waiting',
    PLAYING: 'Playing'
};

const USER_STATS = {
    WIN: 'win',
    LOSS: 'loss',
    DRAW: 'draw',
};

module.exports = { METHODS, PLAYER_SYMBOLS, GAME_STATUS, USER_STATS };