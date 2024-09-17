const gameboard = document.getElementById("gameboard");
const player = document.getElementById("player");
const infoDisplay = document.getElementById("info-display");

const width = 8;
let playerGo = "white";
player.textContent = "beli";

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

    const row = Math.floor((63 - i) / 8) + 1;
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "green" : "brown");
    } else {
      square.classList.add(i % 2 === 0 ? "brown" : "green");
    }

    if (i <= 15) {
      square.firstChild.firstChild.classList.add("white");
    }
    if (i >= 48) {
      square.firstChild.firstChild.classList.add("black");
    }

    gameboard.append(square);
  });
}
createBoard();

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

  const correctGo = draggedElement.firstChild.classList.contains(playerGo);
  const taken = e.target.classList.contains("piece");
  const valid = checkIfValid(e.target);
  const opponentGo = playerGo === "white" ? "black" : "white";
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);

  if (!correctGo) {
    infoDisplay.textContent = "Nije tvoj red!";
    setTimeout(() => (infoDisplay.textContent = ""), 2000);
    return;
  }

  if (valid && takenByOpponent) {
    e.target.parentNode.append(draggedElement);
    e.target.remove();
    checkForWin();
    changePlayer();
    return;
  }

  if (valid) {
    e.target.append(draggedElement);
    checkForWin();
    changePlayer();
    return;
  }

  if (taken && !takenByOpponent) {
    infoDisplay.textContent = "Ne možeš ovde postaviti figuru!";
    setTimeout(() => (infoDisplay.textContent = ""), 2000);
    return;
  }
}

function changePlayer() {
  if (playerGo === "white") {
    reverseIds();
    playerGo = "black";
    player.textContent = "crni";
  } else {
    revertId();
    playerGo = "white";
    player.textContent = "beli";
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
  // console.log("target id", targetId);
  // console.log("start id", startId);
  // console.log("piece", piece);

  switch (piece) {
    case "pawn":
      return isValidPawnMove(startId, targetId);
    case "knight":
      return isValidKnightMove(startId, targetId);
    case "bishop":
      return isValidBishopMove(startId, targetId);
    case "rook":
      return isValidRookMove(startId, targetId);
    case "queen":
      return isValidQueenMove(startId, targetId);
    case "king":
      return isValidKingMove(startId, targetId);
    default:
      return false;
  }
}

function isValidPawnMove(startId, targetId) {
  const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
  if (
    (starterRow.includes(startId) && startId + width * 2 === targetId) ||
    startId + width === targetId ||
    (startId + width - 1 === targetId &&
      document.querySelector(`[square-id="${startId + width - 1}"]`)
        .firstChild) ||
    (startId + width + 1 === targetId &&
      document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild)
  ) {
    return true;
  }

  return false;
}
function isValidBishopMove(startId, targetId) {
  const directions = [width + 1, width - 1, -width + 1, -width - 1];

  for (const direction of directions) {
    let currentId = startId;

    while (true) {
      currentId += direction;

      if (currentId < 0 || currentId >= 64) break;

      if (
        Math.abs((currentId % width) - ((currentId - direction) % width)) !== 1
      )
        break;

      if (currentId === targetId) {
        return true;
      }

      const currentSquare = document.querySelector(
        `[square-id="${currentId}"]`
      );
      if (currentSquare.firstChild) break;
    }
  }

  return false;
}

function isValidKnightMove(startId, targetId) {
  const possibleMoves = [
    startId + width * 2 - 1,
    startId + width * 2 + 1,
    startId - width * 2 - 1,
    startId - width * 2 + 1,
    startId + width - 2,
    startId + width + 2,
    startId - width - 2,
    startId - width + 2,
  ];
  return possibleMoves.includes(targetId);
}
function isValidRookMove(startId, targetId) {
  const directions = [1, -1, width, -width];
  for (const direction of directions) {
    let currentId = startId;

    while (true) {
      currentId += direction;

      if (currentId < 0 || currentId >= 64) break;

      if (
        (direction === 1 || direction === -1) &&
        Math.floor(currentId / width) !==
          Math.floor((currentId - direction) / width)
      )
        break;

      if (currentId === targetId) {
        return true;
      }

      const currentSquare = document.querySelector(
        `[square-id="${currentId}"]`
      );
      if (currentSquare.firstChild) break;
    }
  }

  return false;
}
function isValidQueenMove(startId, targetId) {
  const rookDirections = [1, -1, width, -width];
  for (const direction of rookDirections) {
    let currentId = startId;

    while (true) {
      currentId += direction;

      if (currentId < 0 || currentId >= 64) break;

      if (
        (direction === 1 || direction === -1) &&
        Math.floor(currentId / width) !==
          Math.floor((currentId - direction) / width)
      )
        break;

      if (currentId === targetId) {
        return true;
      }

      const currentSquare = document.querySelector(
        `[square-id="${currentId}"]`
      );
      if (currentSquare.firstChild) break;
    }
  }

  const bishopDirections = [width + 1, width - 1, -width + 1, -width - 1];
  for (const direction of bishopDirections) {
    let currentId = startId;

    while (true) {
      currentId += direction;

      if (currentId < 0 || currentId >= 64) break;

      if (
        Math.abs((currentId % width) - ((currentId - direction) % width)) !== 1
      )
        break;

      if (currentId === targetId) {
        return true;
      }

      const currentSquare = document.querySelector(
        `[square-id="${currentId}"]`
      );
      if (currentSquare.firstChild) break;
    }
  }

  return false;
}
function isValidKingMove(startId, targetId) {
  const possibleMoves = [
    startId + 1,
    startId - 1,
    startId + width,
    startId - width,
    startId + width + 1,
    startId + width - 1,
    startId - width + 1,
    startId - width - 1,
  ];

  if (possibleMoves.includes(targetId)) {
    return true;
  }

  return false;
}
function checkForWin() {
  const kings = Array.from(document.querySelectorAll("#king"));
  console.log("Kings", kings);
  if (!kings.some((king) => king.firstChild.classList.contains("white"))) {
    infoDisplay.innerHTML = "Crni igrač je pobedio!";
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false)
    );
  }
  if (!kings.some((king) => king.firstChild.classList.contains("black"))) {
    infoDisplay.innerHTML = "Beli igrač je pobedio!";
    const allSquares = document.querySelectorAll(".square");
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute("draggable", false)
    );
  }
}
