var numSelected = null;
var score = 0;
var timerInterval = null;
var isPaused = false;
var seconds = 0;
var lastSelectedTile = null;
var notesMode = false;
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
    startTimer();
    const pauseBtn = document.getElementById("pauseBtn");
    pauseBtn.innerText = "⏸";
    pauseBtn.onclick = togglePause;
    document.getElementById("eraseBtn").onclick = eraseTile;
    document.getElementById("resetBtn").onclick = resetGame;
    document.getElementById("notesBtn").onclick = toggleNotesMode;
};
function togglePause() {
    if (isPaused) {
        // ▶ Resume
        startTimer();
        document.getElementById("pauseBtn").innerText = "⏸";
    } else {
        // ⏸ Pause
        pauseTimer();
        document.getElementById("pauseBtn").innerText = "▶";
    }
}

function startTimer() {
    if (timerInterval) return; // already running

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
    isPaused = false;

    document.getElementById("timer").innerText = "00:00";
    document.getElementById("score").innerText = score;
    document.getElementById("message").innerText = "";

    document.getElementById("board").innerHTML = "";
    document.getElementById("digits").innerHTML = "";
    numSelected = null;

    setGame();
    startTimer();

    document.getElementById("pauseBtn").innerText = "⏸";
}
function setGame() {
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r + "-" + c;

            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }

            if (r == 2 || r == 5) tile.classList.add("horizontal-line");
            if (c == 2 || c == 5) tile.classList.add("vertical-line");

            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}
function toggleNotesMode() {
    notesMode = !notesMode;
    document.getElementById("notesBtn").innerText = notesMode ? "✏" : "✏";
}

function selectNumber() {
    if (numSelected) numSelected.classList.remove("number-selected");
    numSelected = this;
    numSelected.classList.add("number-selected");
}
function eraseTile() {
    if (!lastSelectedTile) return;

    if (
        lastSelectedTile.classList.contains("tile-start")
    ) return;

    lastSelectedTile.innerText = "";
    lastSelectedTile.classList.remove("tile-wrong");
    lastSelectedTile.classList.remove("tile-user");

    document.getElementById("message").innerText = "";
}

function selectTile() {
    if (isPaused) return;
    if (!numSelected) return;

    lastSelectedTile = this;

    // Do not allow editing fixed cells
    if (this.classList.contains("tile-start")) return;

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if (notesMode) {
        let note = this.querySelector(".tile-note");

        if (!note) {
            note = document.createElement("span");
            note.classList.add("tile-note");
            this.appendChild(note);
        }

        // Toggle note digit
        if (note.innerText.includes(numSelected.id)) {
            note.innerText = note.innerText.replace(numSelected.id, "");
        } else {
            note.innerText += numSelected.id;
        }

        return; // IMPORTANT: do not place main digit
    }
    
    // Remove previous states
    this.classList.remove("tile-wrong");
    this.classList.remove("tile-user");

    this.innerText = numSelected.id;

    if (solution[r][c] == numSelected.id) {
        // ✅ Correct move
        this.classList.add("tile-user");
        score += 10;
        document.getElementById("message").innerText = "✔ Correct! +10";
    } else {
        // ❌ Wrong move
        this.classList.add("tile-wrong");
        score -= 5;
        document.getElementById("message").innerText = "❌ Wrong! −5";
    }

    document.getElementById("score").innerText = score;
}
