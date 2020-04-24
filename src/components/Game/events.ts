import { Menu } from '../Menu';

import { REDRAW_DELAY } from '../../constants/app';

import { drawElementInCell, scoreCounter } from './render';
import { animateElement } from './animations';
import { initializeGameState } from './state';
import { wait } from '../../utils/common';

import { IElementMapItem } from './types';

function onBoardCellClick(row: number, column: number): void {
  if (!this.isGameOver) {
    const { position } = this.startPoint;
    const searchCell: IElementMapItem = this.elementsMap.find((item: IElementMapItem) => {
      return item.position.row === row && item.position.column === column;
    });
    const isUnlockedCell = !(searchCell && searchCell.locked);
    const isStartPosition: boolean = position.row === row && position.column === column;

    if (!this.isElementRedrawing) {
      if (searchCell && !isStartPosition) {
        this.isElementRedrawing = true;

        wait(REDRAW_DELAY).then(() => {
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

async function onOpenValve(): Promise<void> {
  clearTimeout(this.gameTimer);

  scoreCounter.call(this, 0);

  await animateElement.call(
    this,
    this.startPoint.position.row,
    this.startPoint.position.column,
  );
}

function onGotoMainMenu(): void {
  if (this.elementsMap.length > 1 && !this.isGameOver) {
    if (!confirm('Are you sure you want to abort game?')) {
      return;
    }
  }

  clearTimeout(this.gameTimer);

  this.isGameOver = true;

  new Menu();
}

function onResetGame(): void {
  if (this.elementsMap.length > 1 && !this.isGameOver) {
    if (!confirm('Are you sure you want to start a new game?')) {
      return;
    }
  }

  initializeGameState.call(this);
}

export { onBoardCellClick, onGotoMainMenu, onOpenValve, onResetGame };
