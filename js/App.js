const { useState, useEffect, useCallback } = React;

function App() {
    const [board, setBoard] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(BLACK);
    const [validMoves, setValidMoves] = useState([]);
    const [gameStatus, setGameStatus] = useState({
        isOver: false,
        message: '',
        blackScore: 2,
        whiteScore: 2
    });

    const initGame = useCallback(() => {
        const b = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY));
        const m = BOARD_SIZE / 2;

        b[m-1][m-1] = WHITE;
        b[m-1][m]   = BLACK;
        b[m][m-1]   = BLACK;
        b[m][m]     = WHITE;

        setBoard(b);
        setCurrentPlayer(BLACK);
        setGameStatus({ isOver: false, message: '', blackScore: 2, whiteScore: 2 });
    }, []);

    useEffect(initGame, [initGame]);

    useEffect(() => {
        if (!board.length) return;

        const moves = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (isValidMove(board, r, c, currentPlayer)) {
                    moves.push(`${r},${c}`);
                }
            }
        }
        setValidMoves(moves);
    }, [board, currentPlayer]);

    const handleCellClick = (r, c) => {
        if (!validMoves.includes(`${r},${c}`) || gameStatus.isOver) return;

        const newBoard = board.map(row => [...row]);
        newBoard[r][c] = currentPlayer;
        flipDiscs(newBoard, r, c, currentPlayer);

        const scores = calculateScore(newBoard);

        setBoard(newBoard);
        setGameStatus(prev => ({
            ...prev,
            blackScore: scores.black,
            whiteScore: scores.white
        }));
        setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);
    };

    return (
        <div className="container">
            <h1>Reversi</h1>

            <div className="board">
                {board.map((row, r) =>
                    row.map((cell, c) => (
                        <div
                            key={`${r}-${c}`}
                            className={`cell ${validMoves.includes(`${r},${c}`) ? 'valid-move' : ''}`}
                            onClick={() => handleCellClick(r, c)}
                        >
                            {cell !== EMPTY && (
                                <div className={`cell-disc ${cell === BLACK ? 'black' : 'white'}`}></div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <button onClick={initGame}>New Game</button>
        </div>
    );
}
