// Track previous valid move count to detect consecutive no-move states
let previousValidMoves = -1;
let consecutiveNoMoves = 0;

// Update score display and turn indicator
function updateGameInfo() {
    const root = document.getElementById('root');
    const blackDiscs = root.querySelectorAll('.cell-disc.black').length;
    const whiteDiscs = root.querySelectorAll('.cell-disc.white').length;
    const validMoves = root.querySelectorAll('.cell.valid-move').length;
    const totalCells = 64;
    
    const blackScoreEl = document.getElementById('black-score');
    const whiteScoreEl = document.getElementById('white-score');
    const statusEl = document.getElementById('status');
    
    if (blackScoreEl) blackScoreEl.textContent = blackDiscs;
    if (whiteScoreEl) whiteScoreEl.textContent = whiteDiscs;
    
    if (statusEl) {
        const boardFull = blackDiscs + whiteDiscs >= totalCells;
        
        // Check for consecutive no-move states
        if (validMoves === 0) {
            if (previousValidMoves === 0) {
                consecutiveNoMoves++;
            } else {
                consecutiveNoMoves = 1;
            }
        } else {
            consecutiveNoMoves = 0;
        }
        previousValidMoves = validMoves;
        
        // Game over only if: board is full OR both players had no valid moves (consecutive)
        const gameOver = boardFull || consecutiveNoMoves >= 2;
        
        if (gameOver) {
            let title = '';
            if (blackDiscs > whiteDiscs) {
                title = 'Black Wins!';
            } else if (whiteDiscs > blackDiscs) {
                title = 'White Wins!';
            } else {
                title = "It's a Tie!";
            }
            statusEl.textContent = title;
            showGameOver(title);
        } else {
            const totalDiscs = blackDiscs + whiteDiscs;
            let currentPlayer = 'Black';
            
            if (totalDiscs === 0 || totalDiscs === 4) {
                currentPlayer = 'Black';
            } else if (blackDiscs <= whiteDiscs) {
                currentPlayer = 'Black';
            } else {
                currentPlayer = 'White';
            }
            
            statusEl.textContent = currentPlayer + ' to move';
            hideGameOver();
        }
    }
}

function showGameOver(title) {
    const overlay = document.getElementById('game-over-overlay');
    const titleEl = document.getElementById('game-over-title');
    
    if (overlay && titleEl) {
        titleEl.textContent = title;
        overlay.classList.remove('hidden');
    }
}

function hideGameOver() {
    const overlay = document.getElementById('game-over-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

function setupRestartButton() {
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            hideGameOver();
            consecutiveNoMoves = 0;
            previousValidMoves = -1;
            const root = document.getElementById('root');
            const buttons = root.querySelectorAll('.container button');
            if (buttons.length > 0) {
                buttons[0].click();
            }
        });
    }
}

function observeGameState() {
    const root = document.getElementById('root');
    
    const observer = new MutationObserver((mutations) => {
        clearTimeout(window.gameInfoTimeout);
        window.gameInfoTimeout = setTimeout(updateGameInfo, 150);
    });
    
    observer.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

setTimeout(() => {
    observeGameState();
    setupRestartButton();
    updateGameInfo();
}, 100);

window.addEventListener('focus', updateGameInfo);

