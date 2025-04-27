let gridSize;
let players;
let currentPlayer;
let board = [];
let gameOver = false;

const gridElement = document.getElementById('grid');
const turnText = document.getElementById('turn');
const winnerText = document.getElementById('winner');
const restartBtn = document.getElementById('restart');
const winnerModal = document.getElementById('winnerModal');
const winnerMessage = document.getElementById('winnerMessage');
const closeModal = document.getElementById('closeModal');

function startGame(size) {
  gridSize = size;
  players = size === 3 ? ['❌', '⭕'] :
            size === 4 ? ['❌', '⭕', '✔️'] :
                         ['❌', '⭕', '✔️', '✖️'];
  currentPlayer = players[0];
  board = Array(gridSize * gridSize).fill(null);
  gameOver = false;
  winnerText.textContent = '';

  gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
  gridElement.innerHTML = '';

  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    gridElement.appendChild(cell);
  }

  turnText.textContent = `${currentPlayer}'s turn`;
  restartBtn.style.display = 'inline-block';
}

function handleCellClick() {
  const index = this.getAttribute('data-index');
  if (!board[index] && !gameOver) {
    board[index] = currentPlayer;
    this.textContent = currentPlayer;
    this.classList.add('placed');

    if (checkWinner()) {
      showWinnerModal(`${currentPlayer} wins!`);
      gameOver = true;
    } else if (board.every(val => val)) {
      showWinnerModal(`It's a draw!`);
      gameOver = true;
    } else {
      nextPlayer();
    }
  }
}

function nextPlayer() {
  const currentIndex = players.indexOf(currentPlayer);
  currentPlayer = players[(currentIndex + 1) % players.length];
  turnText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
  const combos = getWinningCombos();
  return combos.some(combo =>
    combo.every(i => board[i] === currentPlayer)
  );
}

function getWinningCombos() {
  const combos = [];
  for (let r = 0; r < gridSize; r++) {
    const row = [];
    for (let c = 0; c < gridSize; c++) {
      row.push(r * gridSize + c);
    }
    combos.push(row);
  }
  for (let c = 0; c < gridSize; c++) {
    const col = [];
    for (let r = 0; r < gridSize; r++) {
      col.push(r * gridSize + c);
    }
    combos.push(col);
  }
  const diag1 = [], diag2 = [];
  for (let i = 0; i < gridSize; i++) {
    diag1.push(i * gridSize + i);
    diag2.push(i * gridSize + (gridSize - 1 - i));
  }
  combos.push(diag1, diag2);
  return combos;
}

function showWinnerModal(message) {
  winnerModal.style.display = 'block';
  winnerMessage.textContent = message;
}

if (closeModal) {
  closeModal.onclick = () => {
    winnerModal.style.display = 'none';
  };
}

function restartGame() {
  board.fill(null);
  document.querySelectorAll('.cell').forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('placed');
  });
  winnerText.textContent = '';
  currentPlayer = players[0];
  turnText.textContent = `${currentPlayer}'s turn`;
  gameOver = false;
  winnerModal.style.display = 'none';
  startGame(gridSize); // Start the game again
}
