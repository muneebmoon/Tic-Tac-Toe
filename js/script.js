const cells = document.querySelectorAll('.cell');
const gameStatus = document.getElementById('gameStatus');
const restartButton = document.getElementById('restartButton');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
    [0, 1, 2],  // Horizontal top
    [3, 4, 5],  // Horizontal middle
    [6, 7, 8],  // Horizontal bottom
    [0, 3, 6],  // Vertical left
    [1, 4, 7],  // Vertical middle
    [2, 5, 8],  // Vertical right
    [0, 4, 8],  // Diagonal top-left to bottom-right
    [2, 4, 6]   // Diagonal top-right to bottom-left
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();
    switchPlayer();
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];

        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            drawWinningLine(a, b, c);
            break;
        }
    }

    if (roundWon) {
        gameStatus.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        gameStatus.textContent = 'Draw!';
        gameActive = false;
        return;
    }
}

function drawWinningLine(a, b, c) {
    const line = document.createElement('div');
    line.classList.add('winning-line');

    const boardRect = document.querySelector('.game-board').getBoundingClientRect();
    const cellA = cells[a].getBoundingClientRect();
    const cellB = cells[b].getBoundingClientRect();
    const cellC = cells[c].getBoundingClientRect();

    const isHorizontal = a + 1 === b && b + 1 === c;
    const isVertical = a + 3 === b && b + 3 === c;
    const isDiagonal = (a === 0 && c === 8) || (a === 2 && c === 6);

    if (isHorizontal) {
        line.classList.add('horizontal-line');
        line.style.top = `${(cellA.top + cellA.height / 2) - boardRect.top}px`;
        line.style.left = `${cellA.left - boardRect.left}px`;
    } else if (isVertical) {
        line.classList.add('vertical-line');
        line.style.left = `${(cellA.left + cellA.width / 2) - boardRect.left}px`;
        line.style.top = `${cellA.top - boardRect.top}px`;
    } else if (isDiagonal) {
        line.classList.add('diagonal-line');
        if (a === 0 && c === 8) {
            line.style.transform = 'rotate(45deg)';
            line.style.top = `${(cellA.top + cellA.height / 2) - boardRect.top - 10}px`;
            line.style.left = `${cellA.left - boardRect.left}px`;
        } else {
            line.style.transform = 'rotate(-45deg)';
            line.style.top = `${(cellA.top + cellA.height / 2) - boardRect.top - 10}px`;
            line.style.left = `${cellA.left - boardRect.left}px`;
        }
    }

    document.querySelector('.game-board').appendChild(line);
}

function restartGame() {
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;

    cells.forEach(cell => (cell.textContent = ''));

    const line = document.querySelector('.winning-line');
    if (line) {
        line.remove();
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);

gameStatus.textContent = `Player ${currentPlayer}'s turn`;
