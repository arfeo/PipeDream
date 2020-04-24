import { difficultyMatrix } from '../../constants/common';

import { drawStartPoint, pushNewExpectedElement, timeTicker } from './render';

async function clearGameState(): Promise<void> {
  this.expectedElements = [];
  this.elementsMap = [];
  this.startPoint.position = null;
  this.isGameOver = false;
  this.animationPromisesCount = 0;

  clearTimeout(this.gameTimer);

  await timeTicker.call(this, difficultyMatrix[this.gameDifficulty].time);

  for (let row = 1; row <= 7; row += 1) {
    for (let column = 1; column <= 10; column += 1) {
      const cell: HTMLCanvasElement = document.getElementById(
        `cell-${row}-${column}`,
      ) as HTMLCanvasElement;
      const cellAnimation: any = document.getElementById(`cell-animation-${row}-${column}`);
      const ctx: CanvasRenderingContext2D = cell.getContext('2d');
      const ctxAnimation: CanvasRenderingContext2D = cellAnimation.getContext('2d');

      ctx.clearRect(0, 0, 100, 100);
      ctxAnimation.clearRect(0, 0, 100, 100);
    }
  }
}

function initializeGameState(): void {
  clearGameState.call(this).then(() => {
    for (let i = 0; i < 5; i += 1) {
      pushNewExpectedElement.call(this);
    }

    drawStartPoint.call(this);
  });
}

export { clearGameState, initializeGameState };
