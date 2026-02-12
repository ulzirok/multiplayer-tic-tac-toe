const { PLAYER_SYMBOLS } = require('../constants');

class Game {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentTurn = PLAYER_SYMBOLS.X;
        this.winner = null;
        this.isDraw = false;
    }

    makeMove(index, symbol) {
        if (this.board[index] || this.winner) return false;
        if (symbol !== this.currentTurn) return false;

        this.board[index] = symbol;
        this.checkWinner();

        if (!this.winner) {
            this.currentTurn = this.currentTurn === PLAYER_SYMBOLS.X ? PLAYER_SYMBOLS.O : PLAYER_SYMBOLS.X;
        }

        return true;
    }

    checkWinner() {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let [a, b, c] of lines) {
            if (
                this.board[a] &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]
            ) {
                this.winner = this.board[a];
                return;
            }
        }

        if (!this.board.includes(null)) {
            this.isDraw = true;
        }
    }
}

module.exports = Game;
