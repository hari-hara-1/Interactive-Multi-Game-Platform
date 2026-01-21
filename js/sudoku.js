var numSelected = null;
var score = 0;

var timerInterval = null;
var seconds = 0;
var isPaused = true;
var gameStarted = false;

var lastSelectedTile = null;
var notesMode = false;
var completedDigits = new Set();

var board = [
    "--74916-5", "2---6-3-9", "-----7-1-",
    "-586----4", "--3----9-", "--62--187",
    "9-4-7---2", "67-83----", "81--45---"
];

var solution = [
    "387491625", "241568379", "569327418",
    "758619234", "123784596", "496253187",
    "934176852", "675832941", "812945763"
];

window.onload = function () {
    setGame();

    document.getElementById("startBtn").onclick = startGame;
    document.getElementById("pauseBtn").onclick = togglePause;
    document.getElementById("eraseBtn").onclick = eraseTile;
    document.getElementById("notesBtn").onclick = toggleNotesMode;
    document.getElementById("resetBtn").onclick = resetGame;

    document.getElementById("pauseBtn").innerText = "▶";
};

function startGame() {
    if (gameStarted) return;

    gameStarted = true;
    isPaused = false;

    startTimer();

    document.getElementById("pauseBtn").innerText = "⏸";
    document.getElementById("startBtn").style.display = "none";
}

function togglePause() {
    if (!gameStarted) return;

    if (isPaused) {
        startTimer();
        document.getElementById("pauseBtn").innerText = "⏸";
    } else {
        pauseTimer();
        document.getElementById("pauseBtn").innerText = "▶";
    }
}

function startTimer() {
    if (timerInterval) return;

    isPaused = false;
    timerInterval = setInterval(() => {
        seconds++;
        let min = Math.floor(seconds / 60);
        let sec = seconds % 60;
        document.getElementById("timer").innerText =
            (min < 10 ? "0" + min : min) + ":" +
            (sec < 10 ? "0" + sec : sec);
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = true;
}

function resetGame() {
    clearInterval(timerInterval);
    timerInterval = null;

    seconds = 0;
    score = 0;
    isPaused = true;
    gameStarted = false;

    document.getElementById("timer").innerText = "00:00";
    document.getElementById("score").innerText = score;
    document.getElementById("message").innerText = "";

    document.getElementById("board").innerHTML = "";
    document.getElementById("digits").innerHTML = "";

    numSelected = null;
    lastSelectedTile = null;
    notesMode = false;

    setGame();

    document.getElementById("pauseBtn").innerText = "▶";
    document.getElementById("startBtn").style.display = "inline-block";
    completedDigits.clear();

    document.querySelectorAll(".number").forEach(btn => {
        btn.classList.remove("number-complete", "number-selected");
    });

}

function setGame() {
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.classList.add("number");
        number.addEventListener("click", selectNumber);
        document.getElementById("digits").appendChild(number);
    }

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r + "-" + c;
            tile.classList.add("tile");

            if (board[r][c] !== "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }

            if (r === 2 || r === 5) tile.classList.add("horizontal-line");
            if (c === 2 || c === 5) tile.classList.add("vertical-line");

            tile.addEventListener("click", selectTile);
            document.getElementById("board").appendChild(tile);
        }
    }
}
function isRowComplete(row) {
    for (let c = 0; c < 9; c++) {
        const tile = document.getElementById(row + "-" + c);
        if (
            tile.innerText === "" ||
            tile.classList.contains("tile-wrong")
        ) return false;
    }
    return true;
}
function isColComplete(col) {
    for (let r = 0; r < 9; r++) {
        const tile = document.getElementById(r + "-" + col);
        if (
            tile.innerText === "" ||
            tile.classList.contains("tile-wrong")
        ) return false;
    }
    return true;
}
function isBoxComplete(startRow, startCol) {
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            const tile = document.getElementById(r + "-" + c);
            if (
                tile.innerText === "" ||
                tile.classList.contains("tile-wrong")
            ) return false;
        }
    }
    return true;
}
function highlightRow(row) {
    for (let c = 0; c < 9; c++) {
        document.getElementById(row + "-" + c)
            .classList.add("highlight");
    }
}
function highlightCol(col) {
    for (let r = 0; r < 9; r++) {
        document.getElementById(r + "-" + col)
            .classList.add("highlight");
    }
}
function highlightBox(startRow, startCol) {
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            document.getElementById(r + "-" + c)
                .classList.add("highlight");
        }
    }
}
function checkWholeBoard() {
    const tiles = document.querySelectorAll(".tile");

    for (let tile of tiles) {
        if (
            tile.innerText === "" ||
            tile.classList.contains("tile-wrong")
        ) return;
    }

    // 🎉 Completed
    document.getElementById("board")
        .classList.add("board-complete");

    document.getElementById("message")
        .innerText = "🎉 Puzzle Completed!";
    
    pauseTimer();
}
function isDigitComplete(digit) {
    let count = 0;

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const tile = document.getElementById(r + "-" + c);

            if (
                tile.innerText == digit &&
                !tile.classList.contains("tile-wrong")
            ) {
                count++;
            }
        }
    }

    return count === 9;
}

function highlightCompletedDigit(digit) {
    // Highlight all tiles with this digit
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const tile = document.getElementById(r + "-" + c);
            if (tile.innerText == digit) {
                tile.classList.add("digit-complete");
            }
        }
    }

    // 🔒 Permanently mark digit button
    const digitBtn = document.getElementById(digit);
    if (digitBtn) {
        digitBtn.classList.add("number-complete");
        digitBtn.classList.remove("number-selected");
    }
}

function toggleNotesMode() {
    notesMode = !notesMode;
}

function selectNumber() {
    if (this.classList.contains("number-complete")) return;

    if (numSelected) numSelected.classList.remove("number-selected");
    numSelected = this;
    numSelected.classList.add("number-selected");
}


function eraseTile() {
    if (!lastSelectedTile) return;
    if (lastSelectedTile.classList.contains("tile-start")) return;

    lastSelectedTile.innerText = "";
    lastSelectedTile.classList.remove("tile-user", "tile-wrong");

    let note = lastSelectedTile.querySelector(".tile-note");
    if (note) note.remove();

    document.getElementById("message").innerText = "";
}

function selectTile() {
    if (!gameStarted || isPaused || !numSelected) return;

    lastSelectedTile = this;
    if (this.classList.contains("tile-start")) return;

    let [r, c] = this.id.split("-").map(Number);

    if (notesMode) {
        let note = this.querySelector(".tile-note");
        if (!note) {
            note = document.createElement("span");
            note.classList.add("tile-note");
            this.appendChild(note);
        }
        note.innerText = note.innerText.includes(numSelected.id)
            ? note.innerText.replace(numSelected.id, "")
            : note.innerText + numSelected.id;
        return;
    }

    this.classList.remove("tile-user", "tile-wrong");
    this.innerText = numSelected.id;

    if (solution[r][c] === numSelected.id) {
    this.classList.add("tile-user");
    score += 10;
    document.getElementById("message").innerText = "✔ Correct +10";

    // ✅ CHECK DIGIT COMPLETION ONLY HERE
    if (!completedDigits.has(numSelected.id)) {
        if (isDigitComplete(numSelected.id)) {
            completedDigits.add(numSelected.id);
            highlightCompletedDigit(numSelected.id);
        }
    }
    } else {
        this.classList.add("tile-wrong");
        score -= 5;
        document.getElementById("message").innerText = "❌ Wrong −5";
    }

    document.getElementById("score").innerText = score;
        // Row complete
    if (isRowComplete(r)) highlightRow(r);

    // Column complete
    if (isColComplete(c)) highlightCol(c);

    // 3x3 box complete
    let boxRow = Math.floor(r / 3) * 3;
    let boxCol = Math.floor(c / 3) * 3;
    if (isBoxComplete(boxRow, boxCol)) {
        highlightBox(boxRow, boxCol);
    }

    // Full board completion
    checkWholeBoard();
    if (!completedDigits.has(numSelected.id)) {
    if (isDigitComplete(numSelected.id)) {
        completedDigits.add(numSelected.id);
        highlightCompletedDigit(numSelected.id);
    }
}

}
