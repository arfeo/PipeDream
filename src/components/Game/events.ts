import { find, isEqual } from 'lodash';

import { Menu } from '../Menu';

import { APP } from '../../constants/app';

import { drawElementInCell, scoreCounter } from './render';
import { animateElement } from './animation';
import { initializeGameState } from './state';
import { wait } from '../../utils/common';

import { IElementMapItem } from './types';

/**
 * Game board cell click handler
 *
 * @param row
 * @param column
 */
function onBoardCellClick(row: number, column: number) {
  if (!this.isGameOver) {
    const searchCell: IElementMapItem = find<IElementMapItem>(this.elementsMap, { position: { row, column }});
    const isUnlockedCell: boolean = !(searchCell && searchCell.locked);
    const isStartPosition: boolean = isEqual({ row, column }, this.startPoint.position);

    if (!this.isElementRedrawing) {
      if (searchCell && !isStartPosition) {
        this.isElementRedrawing = true;

        wait(APP.REDRAW_DELAY).then(() => {
          this.isElementRedrawing = false;

          drawElementInCell.call(this, row, column);
        });

        return;
      }

      if (isUnlockedCell && !isStartPosition) {
        drawElementInCell.call(this, row, column);
      }
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
