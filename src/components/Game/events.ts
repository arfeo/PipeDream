import { Menu } from '../Menu';

import { drawElementByType, pushNewExpectedElement, scoreCounter, updateElementsMap } from './render';
import { animateElement } from './animation';
import { initializeGameState } from './state';

import { IElementMapItem } from './types';

/**
 * Game board cell click handler
 *
 * @param row
 * @param column
 */
function onBoardCellClick(row: number, column: number) {
  if (!this.isGameOver) {
    const searchCell: IElementMapItem = this.elementsMap.filter((item: IElementMapItem) => {
      return JSON.stringify({ row, column }) === JSON.stringify(item.position);
    })[0] || null;
    const isUnlockedCell: boolean = !(searchCell && searchCell.locked);
    const isStartPosition: boolean = JSON.stringify({ row, column }) !== JSON.stringify(this.startPoint.position);

    if (isUnlockedCell && isStartPosition) {
      const currentCell: HTMLCanvasElement = document.getElementById(
        `cell-${row}-${column}`,
      ) as HTMLCanvasElement;
      const ctx: CanvasRenderingContext2D = currentCell.getContext('2d');

      ctx.fillStyle = 'black';

      drawElementByType.call(
        this,
        this.expectedElements[0].type,
        ctx,
        currentCell,
      );

      currentCell.style.transform = `rotate(${this.expectedElements[0].direction * 90}deg)`;

      updateElementsMap.call(
        this,
        this.expectedElements[0].type,
        row,
        column,
        this.expectedElements[0].direction,
        false,
      );

      this.expectedElements.shift();

      pushNewExpectedElement.call(this);
    }
  }
}

/**
 * Start the game
 */
async function onOpenValve() {
  clearTimeout(this.gameTimer);

  scoreCounter.call(this, 0);

  await animateElement.call(
    this,
    this.startPoint.position.row,
    this.startPoint.position.column,
  );
}

/**
 * Goto main menu button click handler
 */
function onGotoMainMenu() {
  if (this.elementsMap.length > 1 && !this.isGameOver) {
    if (!confirm('Are you sure you want to abort game?')) {
      return;
    }
  }

  clearTimeout(this.gameTimer);

  this.isGameOver = true;

  new Menu();
}

/**
 * Reset game button click handler
 */
function onResetGame() {
  if (this.elementsMap.length > 1 && !this.isGameOver) {
    if (!confirm('Are you sure you want to start a new game?')) {
      return;
    }
  }

  initializeGameState.call(this);
}

export { onBoardCellClick, onGotoMainMenu, onOpenValve, onResetGame };
