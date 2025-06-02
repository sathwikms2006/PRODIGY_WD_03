const board = document.getElementById('board');
const status = document.getElementById('status');
const aiToggle = document.getElementById('aiToggle');
const twoPlayerToggle = document.getElementById('twoPlayerToggle');

let currentPlayer = 'X';
let cells = Array(9).fill(null);
let gameActive = true;

function createBoard() {
  board.innerHTML = '';
  cells.forEach((_, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = index;
    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
  });
  updateStatus();
}

function handleClick(e) {
  const index = e.target.dataset.index;

  if (!cells[index] && gameActive) {
    if (twoPlayerToggle.checked) {
      // In 2-player mode, allow both X and O to click
      makeMove(index, currentPlayer);
    } else if (currentPlayer === 'X') {
      // In AI mode, only allow user to play as 'X'
      makeMove(index, 'X');
    }
  }
}


function makeMove(index, player) {
  cells[index] = player;
  const cell = document.querySelector(`[data-index='${index}']`);
  cell.textContent = player;

  if (checkWinner(player)) {
    status.textContent = `Player ${player} wins!`;
    gameActive = false;
    return;
  }

  if (cells.every(cell => cell)) {
    status.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  // Switch player
  currentPlayer = player === 'X' ? 'O' : 'X';
  updateStatus();

  // Trigger AI only if in single-player mode and it's O's turn
  if (!twoPlayerToggle.checked && currentPlayer === 'O') {
    setTimeout(aiMove, 300);
  }
}


function aiMove() {
  const bestMove = getBestMove();
  makeMove(bestMove, 'O');
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (!cells[i]) {
      cells[i] = 'O';
      const score = minimax(cells, 0, false);
      cells[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWinner('O', board)) return 10 - depth;
  if (checkWinner('X', board)) return depth - 10;
  if (board.every(cell => cell)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        const score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';
        const score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner(player, customBoard = cells) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  return winPatterns.some(([a, b, c]) =>
    customBoard[a] === player && customBoard[b] === player && customBoard[c] === player
  );
}

function updateStatus() {
  status.textContent = `Player ${currentPlayer}'s turn`;
}

function restartGame() {
  cells = Array(9).fill(null);
  currentPlayer = 'X';
  gameActive = true;
  createBoard();
}

createBoard();
