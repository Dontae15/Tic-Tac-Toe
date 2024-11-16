// gameMenu.js

import { startGame } from './game.js';

const xButton = document.getElementById('x-icon-btn');
const oButton = document.getElementById('o-icon-btn');
const cpuButton = document.getElementById('cpu-btn');
const pvpButton = document.getElementById('pvp-btn');
const xIconSilver = document.querySelector('.x-icon-silver');
const oIconSilver = document.querySelector('.o-icon-silver');
const xIconNavy = document.querySelector('.x-icon-navy');
const oIconNavy = document.querySelector('.o-icon-navy');

export let playerOneMarker;
export let playerTwoMarker;

// Exporting DOM elements for toggling display properties later
export const gameBoardDisplay = document.getElementById('game-board-display');
export const gameWinnerDisplay = document.getElementById('game-winner-display');
export const restartGameDisplay = document.getElementById('restart-game-display');

// Initially hide game displays
gameBoardDisplay.style.display = 'none';
gameWinnerDisplay.style.display = 'none';
restartGameDisplay.style.display = 'none';
xIconNavy.style.display = 'none';
oIconNavy.style.display = 'none';

// Function to set Player 1's and Player 2's markers based on selection
function selectMarker(marker) {
    playerOneMarker = marker;
    playerTwoMarker = marker === 'X' ? 'O' : 'X';
}

// Event listener for CPU game
cpuButton.addEventListener('click', () => {
    if (!playerOneMarker) {
        alert("Please select a marker (X or O) to start the game!");
        return;
    }
    startGame(playerOneMarker, 'cpu'); // Start game with CPU mode
});

// Event listener for Player vs Player game
pvpButton.addEventListener('click', () => {
    if (!playerOneMarker) {
        alert("Please select a marker (X or O) to start the game!");
        return;
    }
    startGame(playerOneMarker, '1v1'); // Start game with 1v1 mode
});

// Event listener for choosing 'X' marker
xButton.addEventListener('click', () => {
    selectMarker('X');
    xButton.classList.add('active');
    oButton.classList.remove('active');
    xIconSilver.style.display = 'none';
    xIconNavy.style.display = 'flex';
    oIconNavy.style.display = 'none';
    oIconSilver.style.display = 'flex';
});

// Event listener for choosing 'O' marker
oButton.addEventListener('click', () => {
    selectMarker('O');
    oButton.classList.add('active');
    xButton.classList.remove('active');
    oIconSilver.style.display = 'none';
    oIconNavy.style.display = 'flex';
    xIconNavy.style.display = 'none';
    xIconSilver.style.display = 'flex';
});
