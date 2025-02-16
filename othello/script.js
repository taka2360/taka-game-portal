const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const BOARD_SIZE = 8
const cellSize = canvas.width / BOARD_SIZE;

const board = [];
let currentPlayer = 'black';
let gameover = false;

// ボードの初期化
for (let i = 0; i < BOARD_SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
        board[i][j] = null;
    }
}

// 初期配置
board[BOARD_SIZE/2-1][BOARD_SIZE/2-1] = 'white';
board[BOARD_SIZE/2][BOARD_SIZE/2] = 'white';
board[BOARD_SIZE/2-1][BOARD_SIZE/2] = 'black';
board[BOARD_SIZE/2][BOARD_SIZE/2-1] = 'black';

// 描画処理
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#009900'; // ベージュ色
    ctx.fillRect(0, 0, canvas.width, canvas.height); // 塗りつぶし
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            ctx.strokeStyle = 'lightgray';
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
            if (board[i][j]) {
                const color = board[i][j];
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(j * cellSize + cellSize / 2, i * cellSize + cellSize / 2, cellSize / 2 - 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// クリック処理
canvas.addEventListener('click', (event) => {
    if (gameover) return;
    const x = event.offsetX;
    const y = event.offsetY;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);

    if (board[row][col] === null && canReverse(row, col)) {
        board[row][col] = currentPlayer;
        reverseStones(row, col);
        switchPlayer();
        drawBoard();
        if (isGameover()) {
            endGame();
        }
    }
});

// 石を置けるか判定
function canReverse(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1], [0, -1],
        [0, 1], [1, -1], [1, 0], [1, 1]
    ];
    for (const [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;
        if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) continue;
        const opponent = currentPlayer === 'black' ? 'white' : 'black';
        if (board[r][c] === opponent) {
            while (true) {
                r += dr;
                c += dc;
                if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break;
                if (board[r][c] === currentPlayer) {
                    return true;
                }
                if (board[r][c] !== opponent) {
                    break;
                }
            }
        }
    }
    return false;
}

// 石をひっくり返す
function reverseStones(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1], [0, -1],
        [0, 1], [1, -1], [1, 0], [1, 1]
    ];
    for (const [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;
        if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) continue;
        const opponent = currentPlayer === 'black' ? 'white' : 'black';
        if (board[r][c] === opponent) {
            let stonesToReverse = [[r, c]];
            while (true) {
                r += dr;
                c += dc;
                if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break;
                if (board[r][c] === currentPlayer) {
                    for(const [x, y] of stonesToReverse){
                        board[x][y] = currentPlayer
                    }
                }
                if (board[r][c] === opponent) {
                    stonesToReverse.push([r, c]);
                }
            }
        }
    }
}

// プレイヤー交代
function switchPlayer() {
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
}

// ゲーム終了判定
function isGameover() {
    const blackCanMove = board.some((row, i) => row.some((cell, j) => {
        return cell === null && canReverse(i, j);
    }));
    const whiteCanMove = board.some((row, i) => row.some((cell, j) => {
        return cell === null && canReverse(i, j);
    }));
    return !blackCanMove && !whiteCanMove;
}

// ゲーム終了処理
function endGame() {
    gameover = true;
    let blackCount = 0;
    let whiteCount = 0;
    for (const row of board) {
        for (const cell of row) {
            if (cell === 'black') blackCount++;
            if (cell === 'white') whiteCount++;
        }
    }
    const winner = blackCount > whiteCount ? '黒' : whiteCount > blackCount ? '白' : '引き分け';
    alert(`ゲーム終了！${winner}の勝ちです！`);
}

// 初期描画
drawBoard();
