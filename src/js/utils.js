import { playerOneMarker, playerTwoMarker, gameMode, handleMove, cpuMove } from './game.js';
import { restartGameDisplay } from './gameMenu.js';

export let boardState = Array(9).fill(null); // Track cell states; null means empty
export let currentPlayer = 'X';
export let timeoutIds = []; // Store all active timeouts

// Getter function to access currentPlayer
export function getCurrentPlayer() {
    return currentPlayer;
}

// Setter function to update currentPlayer
export function setCurrentPlayer(player) {
    currentPlayer = player;
}

const gameBoardDisplay = document.getElementById('game-board-display');
const gameWinnerDisplay = document.getElementById('game-winner-display');

// Define a function to handle "Next Round" and "Quit Game" actions to avoid multiple listeners
function handleNextRound() {
    gameWinnerDisplay.style.display = 'none';
    gameBoardDisplay.classList.remove('game-over');
    resetGame();
}

function handleQuitGame() {
    gameWinnerDisplay.style.display = 'none';
    gameBoardDisplay.style.display = 'none';
    gameBoardDisplay.classList.remove('game-over');
    document.getElementById('game-menu-display').style.display = 'flex';
    
}

export function checkWinCondition() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Vertical
        [0, 4, 8], [2, 4, 6]              // Diagonal
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;

        // Check if all three cells in the condition have the same marker (either X or O)
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) { 
            const winningMarker = boardState[a];
            const winningClass = winningMarker === 'X' ? 'x-winning-cell' : 'o-winning-cell';

            // Add the winning class to each cell in the winning combination
            document.querySelector(`[data-index="${a}"]`).classList.add(winningClass);
            document.querySelector(`[data-index="${b}"]`).classList.add(winningClass);
            document.querySelector(`[data-index="${c}"]`).classList.add(winningClass);

            return winningMarker; // Return the winning marker ('X' or 'O')
        }
    }
    return null; // No win detected
}


 function stats() {
    // Initialize counters
    let player1Wins = 0;
    let player2Wins = 0;
    let cpuWins = 0;
    let draws = 0;

    // DOM Elements
    const player1WinsText = document.querySelector('.x-wins-text');
    const player1WinsAmount = document.querySelector('.wins-amount');
    const drawsText = document.querySelector('.draws-text');
    const drawsAmount = document.querySelector('.draws-amount');
    const player2OrCpuWinsText = document.querySelector('.o-wins-text');
    const player2OrCpuWinsAmount = document.querySelector('.o-wins-amount');

    // Set initial text labels based on game mode
    function updateLabels() {
        if (gameMode === 'cpu') {
            player1WinsText.textContent = 'Player Wins';
            player2OrCpuWinsText.textContent = 'CPU Wins';
        } else if (gameMode === '1v1') {
            player1WinsText.textContent = 'Player 1 Wins';
            player2OrCpuWinsText.textContent = 'Player 2 Wins';
        }
        drawsText.textContent = 'Draws';
    }

    // Update display counts
    function updateStatsDisplay() {
        player1WinsAmount.textContent = player1Wins;
        drawsAmount.textContent = draws;
        if (gameMode === 'cpu') {
            player2OrCpuWinsAmount.textContent = cpuWins;
        } else if (gameMode === '1v1') {
            player2OrCpuWinsAmount.textContent = player2Wins;
        }
    }

    // Nested functions to increment stats
    function incrementPlayer1Wins() {
        player1Wins++;
        updateStatsDisplay();
    }

    function incrementPlayer2Wins() {
        player2Wins++;
        updateStatsDisplay();
    }

    function incrementCpuWins() {
        cpuWins++;
        updateStatsDisplay();
    }

    function incrementDraws() {
        draws++;
        updateStatsDisplay();
    }

    // Return functions to increment specific stats
    return {
        incrementPlayer1Wins,
        incrementPlayer2Wins,
        incrementCpuWins,
        incrementDraws, 
        updateLabels
    };
}

export const gameStats = stats();


export function endGame(winningMarker) {
    gameWinnerDisplay.style.display = 'flex';
    gameBoardDisplay.classList.add('game-over');
    
    const winningDisplayHeader = document.querySelector('.game-winner-header');
    winningDisplayHeader.classList.add('text-preset-4');
    const winningIcon = document.querySelector('.winning-icon');
    const winningText = document.querySelector('.winning-text');

    // Check for a tie first
    if (!winningMarker && boardState.every(cell => cell !== null)) {
        // Update stats for a tie
        gameStats.incrementDraws();
        winningText.textContent = "Round tied";
        winningText.style.color = '#A8BFC9';
        winningDisplayHeader.style.display = 'none';
        winningIcon.style.display = 'none';


    } else if (winningMarker) {

        winningDisplayHeader.style.display = 'flex';
        winningIcon.style.display = 'block';

        // Handle win conditions if there's a winner
        if (gameMode === 'cpu') {
            if (winningMarker === playerOneMarker) {
                gameStats.incrementPlayer1Wins();
                winningDisplayHeader.classList.add('text-preset-4');
                winningDisplayHeader.textContent = 'you won!';
                winningIcon.src = playerOneMarker === 'X' ? 'public/assets/icon-x.svg' : 'public/assets/icon-o.svg';
                winningText.textContent = 'Takes the round';
                winningText.style.color = playerOneMarker === 'X' ? '#31C3BD' : '#F2B137';
            } else if (winningMarker === playerTwoMarker) {
                gameStats.incrementCpuWins();
                winningDisplayHeader.textContent = 'Oh no, you lost...';
                winningIcon.src = playerTwoMarker === 'X' ? 'public/assets/icon-x.svg' : 'public/assets/icon-o.svg';
                winningText.textContent = 'Takes the round';
                winningText.style.color = playerTwoMarker === 'X' ? '#31C3BD' : '#F2B137';
            }
        } else if (gameMode === '1v1') {
            if (winningMarker === playerOneMarker) {
                gameStats.incrementPlayer1Wins();
                winningDisplayHeader.textContent = 'Player 1 wins!';
                winningIcon.src = playerOneMarker === 'X' ? 'public/assets/icon-x.svg' : 'public/assets/icon-o.svg';
                winningText.textContent = 'Takes the round';
                winningText.style.color = playerOneMarker === 'X' ? '#31C3BD' : '#F2B137';
            } else if (winningMarker === playerTwoMarker) {
                gameStats.incrementPlayer2Wins();
                winningDisplayHeader.textContent = 'Player 2 wins!';
                winningIcon.src = playerTwoMarker === 'X' ? 'public/assets/icon-x.svg' : 'public/assets/icon-o.svg';
                winningText.textContent = 'Takes the round';
                winningText.style.color = playerTwoMarker === 'X' ? '#31C3BD' : '#F2B137';
            }
        }
    }

    timeoutIds.push(setTimeout(resetGame, 4000)); // Track the timeout for resetting the game

}



function resetGame() {

    // Clear all active timeouts
    timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutIds = []; // Reset the array

    // Reset the board state and set currentPlayer to 'X'
    boardState = Array(9).fill(null);
    setCurrentPlayer('X'); // Explicitly set to 'X' at the start of a new game

    // Clear the content and classes from each cell
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x-winning-cell', 'o-winning-cell');
    });

    // Reset the turn indicator to show "X TURN"
    const markerIndicator = document.querySelector('.marker-indicator');
    if (markerIndicator) {
        markerIndicator.textContent = "X TURN";
    }

    // Hide the restart display
    const restartGameDisplay = document.getElementById('restart-game-display');
    restartGameDisplay.style.display = 'none';

    // Remove 'game-over' class from the game board display
    const gameBoardDisplay = document.getElementById('game-board-display');
    gameBoardDisplay.classList.remove('game-over');

    // Reinitialize the board to ensure a fresh setup
    initialiseGameBoard();

    if (playerOneMarker === 'O' && gameMode === 'cpu') {
        setTimeout(cpuMove, 500); // Optional delay to simulate CPU's initial move
    }
}


function cancelGame() {
    restartGameDisplay.style.display = 'none';
    gameBoardDisplay.classList.remove('game-over');
}

function restartGame() { 
    const restartGameDisplay = document.getElementById('restart-game-display');
    restartGameDisplay.style.display = 'flex';
    gameBoardDisplay.classList.add('game-over');

    const markerIndicator = document.querySelector('.marker-indicator');
    markerIndicator.textContent = `${currentPlayer} TURN`;

    document.getElementById('restart').addEventListener('click', resetGame) 
    document.getElementById('cancel').addEventListener('click', cancelGame)
}

document.getElementById('restart-game-btn').addEventListener('click', restartGame);


export function handleCellClick(event) {
    const markerIndicator = document.querySelector('.marker-indicator');
    const cell = event.target;
    const cellIndex = cell.dataset.index;

    if (boardState[cellIndex] !== null) return; // Cell is already occupied

    // Update board state and UI
    boardState[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer === 'X' ? 'x-marker' : 'o-marker');
   
    // Check for a win or tie
    const winningMarker = checkWinCondition();

    if (winningMarker) {
        // Pass the winning marker to endGame if there's a winner
        endGame(winningMarker);
    } else if (boardState.every(cell => cell !== null)) {
        // Pass null to endGame to indicate a tie
        endGame(null);
    } else {
        // Switch turns if there's no win or tie
        currentPlayer = currentPlayer === playerOneMarker ? playerTwoMarker : playerOneMarker;
        markerIndicator.textContent = `${currentPlayer} TURN`;


         // Trigger CPU move if it's the CPU's turn
         if (gameMode === 'cpu' && currentPlayer === playerTwoMarker) {
            gameBoardDisplay.classList.add('disable-clicks'); // Disable clicks during CPU move
            setTimeout(() => {
                cpuMove(); // CPU move
                markerIndicator.textContent = `${playerOneMarker} TURN`; // Update marker indicator after CPU move
                gameBoardDisplay.classList.remove('disable-clicks'); // Enable clicks after CPU move
            }, 500); // Slight delay for realism
        }
    }
}


export function initialiseGameBoard() {
    currentPlayer = 'X';
    gameBoardDisplay.style.display = 'flex';
    document.getElementById('game-menu-display').style.display = 'none';

    const gameBoard = document.querySelector('.game-board');
    gameBoard.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;

        cell.textContent = ''; // Clear text content
        cell.addEventListener('mouseenter', () => {
            if (cell.classList.contains('x-marker') || cell.classList.contains('o-marker')) {
                // Create the outline img element dynamically on hover
                const outlineImg = document.createElement('img');
                outlineImg.classList.add('outline-icon');
                outlineImg.src = cell.classList.contains('x-marker') 
                ? '/assets/icon-x-outline.svg' 
                : '/assets/icon-o-outline.svg'; 
                cell.textContent = ''; // Clear text content to show the icon
                cell.appendChild(outlineImg); // Add outline icon to the cell
            }
        });

        cell.addEventListener('mouseleave', () => {
            // Restore the text content based on the player's marker class
            if (cell.querySelector('.outline-icon')) {
                cell.removeChild(cell.querySelector('.outline-icon')); // Remove outline icon
            }
            cell.textContent = cell.classList.contains('x-marker') ? 'X' : cell.classList.contains('o-marker') ? 'O' : '';
        });

        cell.addEventListener('click',  handleMove);
        gameBoard.appendChild(cell);
    }

    // Add event listeners for restart and quit actions once
    document.getElementById('next-round-btn').addEventListener('click', handleNextRound);
    document.getElementById('quit-game-btn').addEventListener('click', handleQuitGame);
}


