import {
  getCellElementList,
  getCurrentTurnElement,
  getCellElementAtIdx, getGameStatusElement, getReplayButton
} from "./selectors.js";

import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import { checkGameStatus } from "./utils.js";

// console.log(checkGameStatus(['X', 'O', 'O', '', 'X', '', '', 'O', 'X']));
// console.log(checkGameStatus(['X', 'O', 'X', 'X', 'O', 'X', 'O', 'X', 'O']));
// console.log(checkGameStatus(['X', '', 'X', 'X', 'O', 'X', 'O', 'X', 'O']));

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill("");

function toggleTurn() {
  // toggle turn
  currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

  // update turn on DOM element
  const currentTurnElement = getCurrentTurnElement();
  if (!currentTurnElement) return;

  currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
  currentTurnElement.classList.add(currentTurn);
}

function updateGameStatus(newGameStatus) {
  const gameStatusElement = getGameStatusElement();
  if (gameStatusElement) gameStatusElement.textContent = newGameStatus;
}

function showReplayButton() {
  const replayButton = getReplayButton();
  if (replayButton) replayButton.classList.add('show');
}

function hideReplayButton() {
  const replayButton = getReplayButton();
  if (replayButton) replayButton.classList.remove('show');
}

function highlightWinCells(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error('Invalid win positions');
  }
  for (const position of winPositions) {
    const cell = getCellElementAtIdx(position);
    cell.classList.add('win');
  }
}

function handleCellClick(cell, index) {
  const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
  if (isClicked || isGameEnded) return;

  // set selected cell
  cell.classList.add(currentTurn);

  // update cellValues
  cellValues[index] = currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

  // check game status
  const game = checkGameStatus(cellValues);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      isGameEnded = true;
      // update game status
      updateGameStatus(game.status);
      // show replay button
      showReplayButton();

      break;
    }

    case GAME_STATUS.O_WIN:
    case GAME_STATUS.X_WIN: {
      isGameEnded = true;
      // update game status
      updateGameStatus(game.status);
      // show replay button
      showReplayButton();
      // high light win cells
      highlightWinCells(game.winPositions);
      
      break;
    }
    
  
    default:
  }

  // toggle turn X->O or otherwise
  toggleTurn();

  // console.log("click", cell, index);
}

function resetGame() {
  // reset temp global variables
  currentTurn = TURN.CROSS;
  isGameEnded = false;
  // cellValues = new Array(9).fill("");
  cellValues = cellValues.map(() => '');

  // reset DOM elements
  // reset game status
  updateGameStatus(GAME_STATUS.PLAYING);
  // reset current turn
  const currentTurnElement = getCurrentTurnElement();
  if (!currentTurnElement) return;

  currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
  currentTurnElement.classList.add(currentTurn);
  // reset game board
  const cellElementList = getCellElementList();
  for (const cell of cellElementList) {
    cell.className = '';
  }
  // hide replay button
  hideReplayButton();
}

function initCellElementList() {
  const liList = getCellElementList();
  liList.forEach((cell, index) => {
    cell.dataset.idx = index;
  });

  // add event click for ul element
  const ulElement = getCellListElement();
  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return;

    const index = Number.parseInt(event.target.dataset.idx);
    handleCellClick(event.target, index);
  });
}

function initReplayButton() {
  const replayButton = getReplayButton();
  if (!replayButton) return;
  replayButton.addEventListener('click', resetGame);
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {  
  // bind click event for all li element
  initCellElementList();

  // bind click event for replay button
  initReplayButton();

  // ...
})();