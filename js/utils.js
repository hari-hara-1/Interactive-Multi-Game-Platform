const isValidMove = (board, r, c, player) => {
    if (board[r][c] !== EMPTY) return false;
    const opponent = player === BLACK ? WHITE : BLACK;

    for (let [dr, dc] of DIRECTIONS) {
        let nr = r + dr;
        let nc = c + dc;
        let foundOpponent = false;

        while (
            nr >= 0 && nr < BOARD_SIZE &&
            nc >= 0 && nc < BOARD_SIZE &&
            board[nr][nc] === opponent
        ) {
            nr += dr;
            nc += dc;
            foundOpponent = true;
        }

        if (
            foundOpponent &&
            nr >= 0 && nr < BOARD_SIZE &&
            nc >= 0 && nc < BOARD_SIZE &&
            board[nr][nc] === player
        ) {
            return true;
        }
    }
    return false;
};

const hasValidMoves = (board, player) => {
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (isValidMove(board, r, c, player)) return true;
        }
    }
    return false;
};

const flipDiscs = (board, r, c, player) => {
    const opponent = player === BLACK ? WHITE : BLACK;

    for (let [dr, dc] of DIRECTIONS) {
        let nr = r + dr;
        let nc = c + dc;
        let toFlip = [];

        while (
            nr >= 0 && nr < BOARD_SIZE &&
            nc >= 0 && nc < BOARD_SIZE &&
            board[nr][nc] === opponent
        ) {
            toFlip.push([nr, nc]);
            nr += dr;
            nc += dc;
        }

        if (
            toFlip.length &&
            nr >= 0 && nr < BOARD_SIZE &&
            nc >= 0 && nc < BOARD_SIZE &&
            board[nr][nc] === player
        ) {
            toFlip.forEach(([fr, fc]) => {
                board[fr][fc] = player;
            });
        }
    }
};

const calculateScore = (board) => {
    let black = 0, white = 0;

    board.forEach(row =>
        row.forEach(cell => {
            if (cell === BLACK) black++;
            else if (cell === WHITE) white++;
        })
    );

    return { black, white };
};
