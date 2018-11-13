// tslint:disable:max-file-line-count
import { isEqual } from 'lodash';

import { Menu } from '../Menu';
import { Game } from '../Game';

import { difficultyMatrix } from '../../constants/common';

import { onBoardCellClick, onGotoMainMenu, onOpenValve, onResetGame } from './events';
import { randomNum } from '../../utils/common';

import { IElementMapItem } from './types';

/**
 * Render the game board
 */
function createGameBoard() {
  const gameStatusPanel: HTMLElement = document.createElement('div');
  const gameBoard: HTMLElement = document.createElement('div');
  const gameToolbox: HTMLElement = document.createElement('div');
  const toolboxExpected: HTMLElement = document.createElement('div');

  // Reset src root element
  this.appRoot.innerHTML = '';

  // Create the game board
  gameStatusPanel.className = 'status-panel';
  gameStatusPanel.innerHTML = (`
    <div><span>Score:</span><strong id="game-score-counter">0</strong></div>
    <div><span>Time:</span><strong id="game-time-ticker"></strong></div>
    <div><span>Difficulty:</span><strong>${difficultyMatrix[this.gameDifficulty].name}</strong></div>
  `);
  gameBoard.className = 'board';
  gameToolbox.className = 'toolbox';
  gameToolbox.innerHTML = (`
    <div class="toolbox__buttons">
      <button id="open-valve-button" class="open-valve-button">▶</button>
      <button id="reset-game-button" class="reset-game-button">⟲</button>
      <button id="main-menu-button" class="main-menu-button fullwidth">Menu</button>
    </div>
  `);
  toolboxExpected.className = 'toolbox__expected';

  this.appRoot.appendChild(gameStatusPanel);
  this.appRoot.appendChild(gameBoard);
  this.appRoot.appendChild(gameToolbox);
  gameToolbox.appendChild(toolboxExpected);

  // Create game board cell containers
  for (let row = 1; row <= 7; row += 1) {
    for (let column = 1; column <= 10; column += 1) {
      const boardCellContainer: HTMLElement = document.createElement('div');

      boardCellContainer.className = 'board__cell-container';
      boardCellContainer.innerHTML = (`
				<canvas id="cell-${row}-${column}" class="board__cell" width="100" height="100"></canvas>
				<canvas id="cell-animation-${row}-${column}" class="board__cell-animation" width="100" height="100"></canvas>
			`);

      gameBoard.appendChild(boardCellContainer);

      document
        .getElementById(`cell-animation-${row}-${column}`)
        .addEventListener('click', onBoardCellClick.bind(this, row, column));
    }
  }

  // Create expected elements view
  for (let i = 0; i < 5; i += 1) {
    const toolboxExpectedElement: HTMLCanvasElement = document.createElement('canvas');

    toolboxExpectedElement.id = `element-${i}`;
    toolboxExpectedElement.className = 'toolbox__expected-element';
    toolboxExpectedElement.width = 100;
    toolboxExpectedElement.height = 100;

    toolboxExpected.appendChild(toolboxExpectedElement);
  }

  document
    .getElementById('open-valve-button')
    .addEventListener('click', onOpenValve.bind(this));
  document
    .getElementById('reset-game-button')
    .addEventListener('click', onResetGame.bind(this));
  document
    .getElementById('main-menu-button')
    .addEventListener('click', onGotoMainMenu.bind(this));
}

/**
 * Draw the start point (pump)
 */
function drawStartPoint() {
  this.startPoint.position = {
    row: randomNum(1, 7),
    column: randomNum(1, 10),
  };

  // Generate start point
  let isStartPointChosen = false;

  while (!isStartPointChosen) {
    this.startPoint.direction = randomNum(0, 3);

    const { direction, position } = this.startPoint;

    // Prevent dead-end
    switch (position.row) {
      case 1: {
        if (position.column === 1) {
          if (direction !== 0 && direction !== 3) {
            isStartPointChosen = true;
          }
        } else if (position.column === 10) {
          if (direction !== 0 && direction !== 1) {
            isStartPointChosen = true;
          }
        } else {
          if (direction !== 0) {
            isStartPointChosen = true;
          }
        }
        break;
      }
      case 7: {
        if (position.column === 1) {
          if (direction !== 2 && direction !== 3) {
            isStartPointChosen = true;
          }
        } else if (position.column === 10) {
          if (direction !== 1 && direction !== 2) {
            isStartPointChosen = true;
          }
        } else {
          if (direction !== 2) {
            isStartPointChosen = true;
          }
        }
        break;
      }
      default: {
        if (position.column === 1) {
          if (direction !== 3) {
            isStartPointChosen = true;
          }
        } else if (position.column === 10) {
          if (direction !== 1) {
            isStartPointChosen = true;
          }
        } else {
          isStartPointChosen = true;
        }
        break;
      }
    }
  }

  // Draw start point
  const startCell: HTMLCanvasElement = document.getElementById(
    `cell-${this.startPoint.position.row}-${this.startPoint.position.column}`,
  ) as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = startCell.getContext('2d');

  ctx.fillStyle = 'black';
  ctx.fillRect(
    startCell.width / 2 - startCell.width / 8,
    0,
    startCell.width / 4,
    startCell.height / 2,
  );
  ctx.beginPath();
  ctx.arc(
    startCell.width / 2,
    startCell.height / 2,
    25,
    0,
    Math.PI * 2,
    false,
  );
  ctx.fill();

  ctx.fillStyle = 'lightblue';
  ctx.beginPath();
  ctx.arc(
    startCell.width / 2,
    startCell.height / 2,
    12,
    0,
    Math.PI * 2,
    false,
  );
  ctx.fill();

  startCell.style.transform = `rotate(${this.startPoint.direction * 90}deg)`;

  updateElementsMap.call(
    this,
    0,
    this.startPoint.position.row,
    this.startPoint.position.column,
    this.startPoint.direction,
    false,
  );
}

/**
 * Render the queue of expected elements
 */
function drawExpectedElements() {
  for (const el in this.expectedElements) {
    const expectedElement: HTMLCanvasElement = document.getElementById(
      `element-${el}`,
    ) as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = expectedElement.getContext('2d');

    ctx.fillStyle = 'white';

    drawElementByType.call(this, this.expectedElements[el].type, ctx, expectedElement);

    expectedElement.style.transform = `rotate(${this.expectedElements[el].direction * 90}deg)`;
  }
}

/**
 * Render a game element
 *
 * @param type
 * @param ctx
 * @param item
 */
function drawElementByType(type: number, ctx: CanvasRenderingContext2D, item: HTMLCanvasElement) {
  ctx.clearRect(0, 0, item.width, item.height);

  switch (type) {
    case 1: {
      ctx.fillRect(
        item.width / 2 - item.width / 8,
        0,
        item.width / 4,
        item.height,
      );
      break;
    }
    case 2: {
      ctx.fillRect(
        item.width / 2 - item.width / 8,
        0,
        item.width / 4,
        item.height / 2,
      );
      ctx.beginPath();
      ctx.arc(
        item.width / 2,
        item.height / 2,
        12,
        0,
        Math.PI * 2,
        false,
      );
      ctx.fill();
      break;
    }
    case 3: {
      ctx.fillRect(
        item.width / 2 - item.width / 8,
        0,
        item.width / 4,
        item.height,
      );
      ctx.fillRect(
        0,
        item.height / 2 - item.height / 8,
        item.width,
        item.height / 4,
      );
      break;
    }
    case 4: {
      ctx.fillRect(
        item.width / 2 - item.width / 8,
        0,
        item.width / 4,
        item.height / 2,
      );
      ctx.fillRect(
        0,
        item.height / 2 - item.height / 8,
        item.width,
        item.height / 4,
      );
      break;
    }
    case 5: {
      ctx.fillRect(
        item.width / 2 - item.width / 8,
        0,
        item.width / 4,
        item.height / 2,
      );
      ctx.fillRect(
        item.width / 2 - item.width / 8,
        item.height / 2 - item.height / 8,
        item.width,
        item.height / 4,
      );
      break;
    }
    default:
      break;
  }
}

/**
 * Push a new element to the queue
 */
function pushNewExpectedElement() {
  const type: number = randomNum(1, 5);
  const direction: number = randomNum(0, 3);

  this.expectedElements.push({ type, direction });

  drawExpectedElements.call(this);
}

/**
 * Render the game timer
 *
 * @param ticker
 */
async function timeTicker(ticker: number) {
  const gameTimeTicker: HTMLElement = document.getElementById('game-time-ticker');

  if (gameTimeTicker) {
    const min: number = Math.floor(ticker / 60);
    const sec: number = Math.floor(ticker - min * 60);

    const timeString = `${(min < 10 ? `0${min}` : min)}:${(sec < 10 ? `0${sec}` : sec)}`;

    gameTimeTicker.innerHTML = (min === 0 && sec <= 10) ? `<span class="orangered">${timeString}</span>` : timeString;

    if (min === 0 && sec === 0) {
      await onOpenValve.call(this);

      return;
    }

    if (ticker >= 0) {
      this.gameTimer = setTimeout(timeTicker.bind(this, ticker - 1), 1000);
    }
  }
}

/**
 * Render the game score board
 *
 * @param score
 */
function scoreCounter(score: number) {
  const gameScoreCounter: HTMLElement = document.getElementById('game-score-counter');

  if (this.isGameOver) {
    clearTimeout(this.gameScoreCounter);
  } else {
    gameScoreCounter.innerHTML = (score * difficultyMatrix[this.gameDifficulty].scorex).toString();

    this.gameScoreCounter = setTimeout(() => scoreCounter.call(this, score + 1), 100);
  }
}

/**
 * Render modal dialog on the game end
 *
 * @param result
 */
function displayGameResultModal(result: boolean) {
  if (!document.getElementById('game-result-modal')) {
    const modalContainer: HTMLElement = document.createElement('div');
    const modalOverlay: HTMLElement = document.createElement('div');
    const gameResultModal: HTMLElement = document.createElement('div');

    modalContainer.id = 'game-result-modal';
    modalContainer.className = 'modal-container';
    modalOverlay.className = 'modal-overlay';
    gameResultModal.className = 'modal medium';
    gameResultModal.innerHTML = (`
      <div id="game-result-message">${result ? 'You have won!' : 'Game over'}</div>
      <div class="submit-block">
        <button id="return-to-menu">Go to menu</button>
        <button id="play-again">Play gain</button>
      </div>
    `);

    this.appRoot.appendChild(modalContainer);
    modalContainer.appendChild(modalOverlay);
    modalContainer.appendChild(gameResultModal);

    document
      .getElementById('return-to-menu')
      .addEventListener('click', () => new Menu());
    document
      .getElementById('play-again')
      .addEventListener('click', () => new Game());
  }
}

/**
 * Update the game elements map
 *
 * @param type
 * @param row
 * @param column
 * @param direction
 * @param locked
 */
function updateElementsMap(type: number, row: number, column: number, direction: number, locked: boolean) {
  this.elementsMap = [
    ...this.elementsMap.filter((item: IElementMapItem) => {
      return !isEqual({ row, column }, item.position);
    }),
    {
      position: { row, column },
      type,
      direction,
      locked,
    },
  ];
}

export {
  createGameBoard,
  displayGameResultModal,
  drawElementByType,
  drawStartPoint,
  pushNewExpectedElement,
  scoreCounter,
  timeTicker,
  updateElementsMap,
};
