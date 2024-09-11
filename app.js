const gameboard = document.getElementById("gameboard");
const player = document.getElementById("player");
const infoDisplay = document.getElementById("info-display");

const width = 8;
let playerGo = "black";
player.textContent = "crni";

const startPieces = [
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
];

function createBoard() {
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement("div");
    square.classList.add("square");
    square.innerHTML = startPiece;
    square.firstChild?.setAttribute("draggable", true);
    square.setAttribute("square-id", i);

    //Bojenje polja
    const row = Math.floor((63 - i) / 8) + 1;
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "green" : "brown");
    } else {
      square.classList.add(i % 2 === 0 ? "brown" : "green");
    }

    if (i <= 15) {
      square.firstChild.firstChild.classList.add("black");
    }
    if (i >= 48) {
      square.firstChild.firstChild.classList.add("white");
    }

    gameboard.append(square);
  });
}
createBoard();

//Pomeranje figura
const allSquares = document.querySelectorAll(".square");

allSquares.forEach((square) => {
  square.addEventListener("dragstart", dragStart);
  square.addEventListener("dragover", dragOver);
  square.addEventListener("drop", dragDrop);
});

let startPositionId;
let draggedElement;

function dragStart(e) {
  startPositionId = e.target.parentNode.getAttribute("square-id");
  draggedElement = e.target;
}
function dragOver(e) {
  e.preventDefault();
}
function dragDrop(e) {
  e.stopPropagation();

  //Provera da ispravan igrac igra
  const correctGo = draggedElement.firstChild.classList.contains(playerGo);
  const taken = e.target.classList.contains("piece");
  const valid = checkIfValid(e.target);
  const opponentGo = playerGo === "white" ? "black" : "white";
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);

  if (correctGo) {
    //prva provera da li je ispravan igrac
    if (takenByOpponent && valid) {
      e.target.parentNode.append(draggedElement);
      e.target.remove();
      changePlayer();
      return;
    }
  }
  //druga provera da li je polje zauzeto
  if (taken && !takenByOpponent) {
    infoDisplay.textContent = "Ne možeš ovde postaviti figuru!";
    setTimeout(() => (infoDisplay.textContent = ""), 2000);
    return;
  }
  if (valid) {
    e.target.append(draggedElement);
    changePlayer();
    return;
  }
}
function changePlayer() {
  if (playerGo === "black") {
    reverseIds();
    playerGo = "white";
    player.textContent = "beli";
  } else {
    revertId();
    playerGo = "black";
    player.textContent = "crni";
  }
}
function reverseIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => {
    square.setAttribute("square-id", 63 - i);
  });
}
function revertId() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) => {
    square.setAttribute("square-id", i);
  });
}
function checkIfValid(target) {
  const targetId = Number(
    target.getAttribute("square-id") ||
      target.parentNode.getAttribute("square-id")
  );
  const startId = Number(startPositionId);
  const piece = draggedElement.id;
  console.log("target id", targetId);
  console.log("start id", startId);
  console.log("piece", piece);

  switch (piece) {
    case "pawn":
      const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
      if (
        (starterRow.includes(startId) && startId + width * 2 === targetId) ||
        startId + width === targetId
      ) {
        return true;
      }
  }
}
