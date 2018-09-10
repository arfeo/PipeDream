import { drawStartPoint, pushNewExpectedElement, timeTicker } from './gameboard';

import { constants } from '../constants';

import { IElementMapItem } from '../types';

export async function clearGameState() {
  this.expectedElements = [];
  this.elementsMap = [];
  this.startPoint.position = null;
  this.isGameOver = false;
  this.animationPromisesCount = 0;

  clearTimeout(this.gameTimer);

  await timeTicker.call(this, constants.difficultyMatrix[this.gameDifficulty].time);

  for (let row = 1; row <= 7; row += 1) {
    for (let column = 1; column <= 10; column += 1) {
      const cell: HTMLCanvasElement = document.getElementById(
        `cell-${row}-${column}`
      ) as HTMLCanvasElement;
      const cellAnimation: any = document.getElementById(`cell-animation-${row}-${column}`);
      const ctx: CanvasRenderingContext2D = cell.getContext('2d');
      const ctxAnimation: CanvasRenderingContext2D = cellAnimation.getContext('2d');

      ctx.clearRect(0, 0, 100, 100);
      ctxAnimation.clearRect(0, 0, 100, 100);
    }
  }
}

export async function setNewGameState() {
  await clearGameState.call(this);

  for (let i = 0; i < 5; i += 1) {
    pushNewExpectedElement.call(this);
  }

  drawStartPoint.call(this);
}

export function updateElementsMap(type: number, row: number, column: number, direction: number, locked: boolean) {
  this.elementsMap = [
    ...this.elementsMap.filter((item: IElementMapItem) => {
      return JSON.stringify({ row, column }) !== JSON.stringify(item.position);
    }),
    {
      position: { row, column },
      type,
      direction,
      locked,
    },
  ];
}

export async function onResetGame() {
  if (this.elementsMap.length > 1 && !this.isGameOver) {
    if (!confirm('Are you sure you want start a new game?')) {
      return;
    }
  }

  await setNewGameState.call(this);
}
