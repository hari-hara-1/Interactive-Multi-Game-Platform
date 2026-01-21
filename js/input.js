import { game } from "./game.js";
import { renderBoard } from "./board.js";

let selectedSquare = null;
let draggedFrom = null;

/* ---------- Helpers ---------- */

function clearHighlights() {
  document
    .querySelectorAll(".square.selected, .square.legal, .square.capture, .square.drag-over")
    .forEach(sq => {
      sq.classList.remove("selected", "legal", "capture", "drag-over");
    });
}

function showLegalMoves(fromSquare) {
  const moves = game.moves({
    square: fromSquare,
    verbose: true
  });

  moves.forEach(move => {
    const target = document.querySelector(
      `.square[data-square="${move.to}"]`
    );

    if (!target) return;

    target.classList.add("legal");

    if (move.captured) {
      target.classList.add("capture");
    }
  });
}

function updateStatus() {
  const status = document.getElementById("status");

  if (game.isCheckmate()) {
    const winner = game.turn() === "w" ? "Black" : "White";
    showGameOverPopup(`${winner} Won!`);
    status.textContent = "Checkmate";
    return;
  }

  if (game.isStalemate()) {
    showGameOverPopup("Stalemate!");
    status.textContent = "Stalemate";
    return;
  }

  if (game.isDraw()) {
    showGameOverPopup("Draw!");
    status.textContent = "Draw";
    return;
  }

  status.textContent =
    (game.turn() === "w" ? "White" : "Black") + " to move";
}


/* ---------- MAIN INPUT ---------- */

export function enableInput() {
  const board = document.getElementById("board");

  /* ===== CLICK TO MOVE ===== */
  board.addEventListener("click", (e) => {
    const square = e.target.closest(".square");
    if (!square) return;

    const squareName = square.dataset.square;

    if (selectedSquare && square.classList.contains("legal")) {
      game.move({
        from: selectedSquare,
        to: squareName,
        promotion: "q"
      });

      selectedSquare = null;
      clearHighlights();
      renderBoard();
      highlightCheck();          // ✅ STEP 3
      updateCapturedPieces();
      updateStatus();
      return;
    }

    if (squareName === selectedSquare) {
      selectedSquare = null;
      clearHighlights();
      return;
    }

    if (game.get(squareName)) {
      clearHighlights();
      selectedSquare = squareName;
      square.classList.add("selected");
      showLegalMoves(squareName);
    }
  });

  /* ===== DRAG START ===== */
  board.addEventListener("dragstart", (e) => {
    const img = e.target;
    if (!img.dataset.from) return;

    draggedFrom = img.dataset.from;

    clearHighlights();
    showLegalMoves(draggedFrom);

    img.parentElement.classList.add("selected");
  });

  /* ===== DRAG OVER ===== */
  board.addEventListener("dragover", (e) => {
    const square = e.target.closest(".square");
    if (!square) return;

    if (square.classList.contains("legal")) {
      e.preventDefault();
      square.classList.add("drag-over");
    }
  });

  /* ===== DRAG LEAVE ===== */
  board.addEventListener("dragleave", (e) => {
    const square = e.target.closest(".square");
    if (!square) return;

    square.classList.remove("drag-over");
  });

  /* ===== DROP ===== */
  board.addEventListener("drop", (e) => {
    const square = e.target.closest(".square");
    if (!square || !draggedFrom) return;

    const to = square.dataset.square;

    if (!square.classList.contains("legal")) {
      draggedFrom = null;
      clearHighlights();
      return;
    }

    game.move({
      from: draggedFrom,
      to,
      promotion: "q"
    });

    draggedFrom = null;
    clearHighlights();
    renderBoard();
    highlightCheck();           // ✅ STEP 3
    updateCapturedPieces();
    updateStatus();
  });

  /* ===== DRAG END ===== */
  board.addEventListener("dragend", () => {
    draggedFrom = null;
    clearHighlights();
  });

  /* ===== RESTART GAME ===== */
  document.getElementById("restart-btn").addEventListener("click", () => {
    game.reset();
    hideGameOverPopup();
    renderBoard();
    highlightCheck();           // ✅ STEP 3
    updateCapturedPieces();
    updateStatus();
  });
}

function updateCapturedPieces() {
  const whiteTray = document.getElementById("white-captures");
  const blackTray = document.getElementById("black-captures");

  whiteTray.innerHTML = "";
  blackTray.innerHTML = "";

  const history = game.history({ verbose: true });

  history.forEach(move => {
    if (!move.captured) return;

    const capturedPieceColor = move.color === "w" ? "b" : "w";

    const img = document.createElement("img");
    img.src = `assets/pieces/${capturedPieceColor}${move.captured}.png`;
    img.alt = `${capturedPieceColor}${move.captured}`;

    if (move.color === "w") {
      whiteTray.appendChild(img);
    } else {
      blackTray.appendChild(img);
    }
  });
}

function showGameOverPopup(message) {
  const overlay = document.getElementById("game-over-overlay");
  const title = document.getElementById("game-over-title");

  title.textContent = message;
  overlay.classList.remove("hidden");
}

function hideGameOverPopup() {
  document.getElementById("game-over-overlay").classList.add("hidden");
}
function highlightCheck() {
  document
    .querySelectorAll(".square.in-check")
    .forEach(sq => sq.classList.remove("in-check"));

  if (!game.isCheck()) return;

  const turn = game.turn(); // side to move is in check
  const board = game.board();

  for (let row of board) {
    for (let piece of row) {
      if (
        piece &&
        piece.type === "k" &&
        piece.color === turn
      ) {
        const kingSquare = document.querySelector(
          `.square[data-square="${piece.square}"]`
        );
        if (kingSquare) {
          kingSquare.classList.add("in-check");
        }
        return;
      }
    }
  }
}
