import { game } from "./game.js";
import { UNICODE_PIECES } from "./pieces.js";

const boardElement = document.getElementById("board");

export function renderBoard() {
  boardElement.innerHTML = "";

  const board = game.board();

  board.forEach((row, rowIndex) => {
    row.forEach((piece, colIndex) => {
      const square = document.createElement("div");
      square.classList.add("square");

      const isLight = (rowIndex + colIndex) % 2 === 0;
      square.classList.add(isLight ? "light" : "dark");

      const file = String.fromCharCode(97 + colIndex);
      const rank = 8 - rowIndex;
      square.dataset.square = `${file}${rank}`;

      if (piece) {
        const img = document.createElement("img");

        img.src = `assets/pieces/${piece.color}${piece.type}.png`;
        img.alt = `${piece.color}${piece.type}`;
        img.draggable = true;
        img.dataset.from = square.dataset.square;

        square.appendChild(img);
      }

      boardElement.appendChild(square);
    });
  });
}
