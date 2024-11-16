// startGame.js


import { initialiseGameBoard, gameStats, boardState, checkWinCondition, endGame, getCurrentPlayer, setCurrentPlayer, handleCellClick, timeoutIds } from './utils.js';


export let gameMode;           // Export gameMode to use in other files
export let playerOneMarker;     // Export playerOneMarker to use in other files
export let playerTwoMarker;  

export function startGame(marker, mode) {
    gameMode = mode; 
    gameStats.updateLabels(gameMode);
    playerOneMarker = marker;
    playerTwoMarker = marker === 'X' ? 'O' : 'X';
    setCurrentPlayer(playerOneMarker); // Use setter to initialize currentPlayer

    if (mode === 'cpu') {
        setupCPUGame();
    } else if (mode === '1v1') {
        setup1v1Game();
    }
}

function setup1v1Game() {
    initialiseGameBoard();
    console.log(`Starting 1v1 game with Player 1 as ${playerOneMarker} and Player 2 as ${playerTwoMarker}`);
}

function setupCPUGame() {
    initialiseGameBoard();

    if (playerOneMarker === 'O') {
        // CPU starts the game if player is O
        setCurrentPlayer(playerTwoMarker); 
        timeoutIds.push(setTimeout(cpuMove, 500));
    }

    console.log(`Starting CPU game with Player as ${playerOneMarker} and CPU as ${playerTwoMarker}`);
}
  


export function cpuMove() {
    let cellIndex;

    // Helper function to find a winning or blocking move
    function findStrategicMove(marker) {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Horizontal
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Vertical
            [0, 4, 8], [2, 4, 6]              // Diagonal
        ];

        for (let condition of winConditions) {
            const [a, b, c] = condition;
            const values = [boardState[a], boardState[b], boardState[c]];

            // Check if the CPU can win or block
            if (values.filter(val => val === marker).length === 2 && values.includes(null)) {
                return condition[values.indexOf(null)]; // Return the index of the empty cell
            }
        }
        return null; // No strategic move found
    }

    // 1. Check if CPU can win
    cellIndex = findStrategicMove(playerTwoMarker);

    // 2. If not, block the player from winning
    if (cellIndex === null) {
        cellIndex = findStrategicMove(playerOneMarker);
    }

    // 3. Take center if available
    if (cellIndex === null && boardState[4] === null) {
        cellIndex = 4;
    }

    // 4. Take a corner if available
    if (cellIndex === null) {
        const corners = [0, 2, 6, 8];
        cellIndex = corners.find(index => boardState[index] === null) || null;
    }

    // 5. Fallback to random empty cell
    if (cellIndex === null) {
        do {
            cellIndex = Math.floor(Math.random() * 9);
        } while (boardState[cellIndex] !== null);
    }

    // Update board state and UI for CPU's move
    boardState[cellIndex] = playerTwoMarker;
    const cell = document.querySelector(`[data-index="${cellIndex}"]`);
    cell.textContent = playerTwoMarker;
    cell.classList.add(playerTwoMarker === 'X' ? 'x-marker' : 'o-marker');

    // Check for a win or tie
    const winningMarker = checkWinCondition();
    if (winningMarker) {
        endGame(winningMarker);
    } else if (boardState.every(cell => cell !== null)) {
        endGame(null); // Tie
    } else {
        setCurrentPlayer(playerOneMarker); // Pass turn back to player
    }
}



// handleMove function with updated usage of getCurrentPlayer and setCurrentPlayer
export function handleMove(event) {
    if (gameMode === 'cpu' && getCurrentPlayer() === playerTwoMarker) {
        // Disable clicks during the CPU's move
        gameBoardDisplay.classList.add('disable-clicks');

        // Use a timeout for the CPU's move
        timeoutIds.push(setTimeout(() => {
            cpuMove();
            gameBoardDisplay.classList.remove('disable-clicks'); // Re-enable clicks
        }, 2000));
    } else if (gameMode !== 'cpu' || getCurrentPlayer() === playerOneMarker) {
        // Handle player move if it's their turn
        handleCellClick(event);
    }
}
