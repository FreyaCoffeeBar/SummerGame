document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.board');
    const cells = document.querySelectorAll('.cell');
    const xImg = 'x.png'; // X için kullanmak istediğiniz PNG
    const oImg = 'o.png'; // O için kullanmak istediğiniz PNG
    let isXTurn = true;

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (!cell.innerHTML && isXTurn) {
                cell.innerHTML = `<img src="${xImg}" alt="X">`;
                if (checkWin('X')) {
                    setTimeout(() => alert('Player X wins!'), 10);
                    resetBoard();
                } else if (isDraw()) {
                    setTimeout(() => alert('Draw!'), 10);
                    resetBoard();
                } else {
                    isXTurn = false;
                    setTimeout(aiMove, 500); // Yapay zekanın hamlesi için kısa bir gecikme
                }
            }
        });
    });

    function aiMove() {
        const bestMove = getBestMove();
        if (bestMove !== undefined) {
            cells[bestMove].innerHTML = `<img src="${oImg}" alt="O">`;
            if (checkWin('O')) {
                setTimeout(() => alert('Təəssüf Tiramisu qazandı!'), 10);
                resetBoard();
            } else if (isDraw()) {
                setTimeout(() => alert('Bərabərə, limonad üçün qızğın oyun!'), 10);
                resetBoard();
            }
            isXTurn = true;
        }
    }

    function getBestMove() {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i].innerHTML) {
                cells[i].innerHTML = `<img src="${oImg}" alt="O">`;
                let score = minimax(cells, 0, false, -Infinity, Infinity);
                cells[i].innerHTML = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    function minimax(cells, depth, isMaximizing, alpha, beta) {
        if (checkWin('O')) return 1;
        if (checkWin('X')) return -1;
        if (isDraw()) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < cells.length; i++) {
                if (!cells[i].innerHTML) {
                    cells[i].innerHTML = `<img src="${oImg}" alt="O">`;
                    let score = minimax(cells, depth + 1, false, alpha, beta);
                    cells[i].innerHTML = '';
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, score);
                    if (beta <= alpha) break;
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < cells.length; i++) {
                if (!cells[i].innerHTML) {
                    cells[i].innerHTML = `<img src="${xImg}" alt="X">`;
                    let score = minimax(cells, depth + 1, true, alpha, beta);
                    cells[i].innerHTML = '';
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, score);
                    if (beta <= alpha) break;
                }
            }
            return bestScore;
        }
    }

    function checkWin(player) {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        return winPatterns.some(pattern => {
            return pattern.every(index => {
                const cell = cells[index].querySelector('img');
                return cell && cell.alt === player;
            });
        });
    }

    function isDraw() {
        return Array.from(cells).every(cell => cell.innerHTML);
    }

    function resetBoard() {
        cells.forEach(cell => {
            cell.innerHTML = '';
        });
        isXTurn = true;
    }
});
