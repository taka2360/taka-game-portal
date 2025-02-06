const canvas = document.getElementById('gomoku-board');
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#FFE597'; // ベージュ色
ctx.fillRect(0, 0, canvas.width, canvas.height); // 塗りつぶし

const BOARD_SIZE = 20;
const CELL_SIZE = canvas.width / BOARD_SIZE;

let board = [];
for (let i = 0; i < BOARD_SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
        board[i][j] = 0; // 0: empty, 1: black, 2: white
    }
}

let currentPlayer = 1; // 1: black, 2: white
let gameEnded = false;
let blackWins = 0;
let whiteWins = 0;

const blackWinsSpan = document.getElementById('black-wins');
const whiteWinsSpan = document.getElementById('white-wins');
const resetButton = document.getElementById('reset-button');

function drawBoard() {
    ctx.strokeStyle = 'black';
    for (let i = 0; i <= BOARD_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE + CELL_SIZE / 2, 0);
        ctx.lineTo(i * CELL_SIZE + CELL_SIZE / 2, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE + CELL_SIZE / 2);
        ctx.lineTo(canvas.width, i * CELL_SIZE + CELL_SIZE / 2);
        ctx.stroke();
    }
}

function drawStone(row, col, player) {
    const x = col * CELL_SIZE + CELL_SIZE / 1.8;
    const y = row * CELL_SIZE + CELL_SIZE / 1.8;

    ctx.beginPath();
    ctx.arc(x - 2, y - 2, CELL_SIZE / 1.8 - 5, 0, 2 * Math.PI);
    ctx.fillStyle = player === 1 ? 'black' : 'white';
    ctx.fill();
}

function handleClick(event) {
    if (gameEnded) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const row = Math.floor(y / CELL_SIZE);
    const col = Math.floor(x / CELL_SIZE);

    if (board[row][col] === 0) {
        board[row][col] = currentPlayer;
        drawStone(row, col, currentPlayer);

        if (checkWin(row, col)) {
            gameEnded = true;
            if (currentPlayer === 1) {
                blackWins++;
                blackWinsSpan.textContent = `Black wins: ${blackWins}`;
                alert('Black wins!');
            } else {
                whiteWins++;
                whiteWinsSpan.textContent = `White wins: ${whiteWins}`;
                alert('White wins!');
            }
        } else if (isBoardFull()) {
            gameEnded = true;
            alert('Draw!');
        } else {
            currentPlayer = 3 - currentPlayer; // Switch player
        }
    }
}

function checkWin(row, col) {
    const player = board[row][col];

    // Check horizontal
    let count = 0;
    for (let j = Math.max(0, col - 4); j <= Math.min(BOARD_SIZE - 1, col + 4); j++) {
        if (board[row][j] === player) {
            count++;
            if (count >= 5) return true;
        } else {
            count = 0;
        }
    }

    // Check vertical
    count = 0;
    for (let i = Math.max(0, row - 4); i <= Math.min(BOARD_SIZE - 1, row + 4); i++) {
        if (board[i][col] === player) {
            count++;
            if (count >= 5) return true;
        } else {
            count = 0;
        }
    }

    // Check diagonal (top-left to bottom-right)
    count = 0;
    let startRow = Math.max(0, row - Math.min(row, col));
    let startCol = Math.max(0, col - Math.min(row, col));
    for (let i = 0; startRow + i < BOARD_SIZE && startCol + i < BOARD_SIZE; i++) {
        if (board[startRow + i][startCol + i] === player) {
            count++;
            if (count >= 5) return true;
        } else {
            count = 0;
        }
    }

    // Check diagonal (top-right to bottom-left)
    count = 0;
    startRow = Math.max(0, row - Math.min(row, BOARD_SIZE - 1 - col));
    startCol = col + Math.min(row, BOARD_SIZE - 1 - col);
    for (let i = 0; startRow + i < BOARD_SIZE && startCol - i >= 0; i++) {
        if (board[startRow + i][startCol - i] === player) {
            count++;
            if (count >= 5) return true;
        } else {
            count = 0;
        }
    }

    return false;
}

function isBoardFull() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }
    return true;
}

function resetBoard() {
    board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = 0;
        }
    }
    currentPlayer = 1;
    gameEnded = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFE597'; // ベージュ色
    ctx.fillRect(0, 0, canvas.width, canvas.height); // 塗りつぶし
    drawBoard();
}

drawBoard();
canvas.addEventListener('click', handleClick);
resetButton.addEventListener('click', resetBoard);