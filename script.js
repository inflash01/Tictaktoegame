const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const resetBtn = document.querySelector('.reset-btn');
const pvpBtn = document.getElementById('pvp');
const pvcBtn = document.getElementById('pvc');
const difficultyDiv = document.getElementById('difficulty');
const diffBtns = document.querySelectorAll('.diff-btn');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
let board = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;
let isVsComputer = false;
let difficulty = 'easy';
let scores = {X: 0, O: 0};

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
];

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;

    if (board[index] !== '' || !gameActive) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
        statusText.textContent = `Win Game`;
        scores[currentPlayer]++;
        updateScores();
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        statusText.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    if (isVsComputer && currentPlayer === 'O' && gameActive) {
        setTimeout(computerMove, 500);
    }
}

function checkWin() {
    return winConditions.some(condition => {
        return condition.every(index => board[index] === currentPlayer);
    });
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function updateScores() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

function startGame() {
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

function computerMove() {
    let availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    
    if (availableMoves.length === 0) return;

    let move;
    if (difficulty === 'easy') {
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else if (difficulty === 'medium') {
        // 50% chance to play optimally, 50% random
        if (Math.random() > 0.5) {
            move = getBestMove();
        } else {
            move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
    } else { // hard
        move = getBestMove();
    }

    board[move] = 'O';
    cells[move].textContent = 'O';
    cells[move].classList.add('o');

    if (checkWin()) {
        statusText.textContent = `Win Game`;
        scores.O++;
        updateScores();
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        statusText.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function getBestMove() {
    // Simple minimax for Tic Tac Toe
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return result;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    for (let condition of winConditions) {
        if (board[condition[0]] === board[condition[1]] && board[condition[1]] === board[condition[2]] && board[condition[0]] !== '') {
            return board[condition[0]] === 'O' ? 1 : -1;
        }
    }
    if (board.every(cell => cell !== '')) return 0;
    return null;
}

function resetGame() {
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

pvpBtn.addEventListener('click', () => {
    isVsComputer = false;
    startGame();
});

pvcBtn.addEventListener('click', () => {
    difficultyDiv.style.display = 'block';
});

diffBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        difficulty = e.target.dataset.diff;
        isVsComputer = true;
        difficultyDiv.style.display = 'none';
        startGame();
    });
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
