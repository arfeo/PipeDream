import { difficultyMatrix, elements } from '../../constants/common';

import { saveStorageData } from '../../utils/storage';
import { displayGameResultModal, updateElementsMap } from './render';

import { IElement } from '../../types/global';
import { IElementMapItem, INextElement } from './types';

function animateComponent(type: string, row: number, column: number, ent: number): Promise<void> {
  return new Promise((resolve) => {
    const cell: HTMLCanvasElement = document.getElementById(
      `cell-animation-${row}-${column}`,
    ) as HTMLCanvasElement;

    if (cell) {
      let a = 0;
      let b = 0;

      switch (type) {
        case 'pump': {
          a = 13;
          b = 21;
          break;
        }
        case 'pipe-out': {
          a = 10;
          b = 50;
          break;
        }
        case 'pipe-in': {
          a = 0;
          b = 59;
          break;
        }
        default:
          break;
      }

      const interval = setInterval(() => {
        a += 1;

        if (a > b) {
          clearInterval(interval);
          resolve();
        } else {
          const ctx: CanvasRenderingContext2D = cell.getContext('2d');

          ctx.fillStyle = 'lightblue';

          switch (type) {
            case 'pump': {
              ctx.beginPath();
              ctx.arc(
                cell.width / 2,
                cell.height / 2,
                a,
                0,
                Math.PI * 2,
                false,
              );
              ctx.fill();
              break;
            }
            case 'pipe-in': {
              switch (ent) {
                case 0: {
                  ctx.fillRect(
                    cell.width / 2 - cell.width / 8 + 4,
                    0,
                    cell.width / 4 - 8,
                    a,
                  );
                  break;
                }
                case 1: {
                  ctx.fillRect(
                    100 - a,
                    cell.height / 2 - cell.height / 8 + 4,
                    100,
                    cell.height / 4 - 8,
                  );
                  break;
                }
                case 2: {
                  ctx.fillRect(
                    cell.width / 2 - cell.width / 8 + 4,
                    100 - a,
                    cell.width / 4 - 8,
                    100 - a,
                  );
                  break;
                }
                case 3: {
                  ctx.fillRect(
                    0,
                    cell.height / 2 - cell.height / 8 + 4,
                    a,
                    cell.height / 4 - 8,
                  );
                  break;
                }
                default:
                  break;
              }
              break;
            }
            case 'pipe-out': {
              switch (ent) {
                case 0: {
                  ctx.fillRect(
                    cell.width / 2 - cell.width / 8 + 4,
                    50 - a,
                    cell.width / 4 - 8,
                    a,
                  );
                  break;
                }
                case 1: {
                  ctx.fillRect(
                    50,
                    cell.height / 2 - cell.height / 8 + 4,
                    a,
                    cell.height / 4 - 8,
                  );
                  break;
                }
                case 2: {
                  ctx.fillRect(
                    cell.width / 2 - cell.width / 8 + 4,
                    50,
                    cell.width / 4 - 8,
                    a,
                  );
                  break;
                }
                case 3: {
                  ctx.fillRect(
                    50 - a,
                    cell.height / 2 - cell.height / 8 + 4,
                    a,
                    cell.height / 4 - 8,
                  );
                  break;
                }
                default:
                  break;
              }
              break;
            }
            default:
              break;
          }
        }
      }, difficultyMatrix[this.gameDifficulty].speed);
    }
  });
}

async function animateElement(row: number, column: number, ent?: number): Promise<void> {
  if (!this.isGameOver) {
    this.animationPromisesCount += 1;

    const element: IElementMapItem = this.elementsMap.find((item: IElementMapItem) => {
      return item.position.row === row && item.position.column === column;
    });

    if (!element) {
      return;
    }

    switch (element.type) {
      case 0: {
        await Promise.all([
          animateComponent.call(this, 'pump', row, column, element.direction),
          animateComponent.call(this, 'pipe-out', row, column, element.direction),
        ]);

        const next: INextElement | boolean = getNextElement.call(this, row, column, element.direction);
        const { nextRow, nextColumn, nextEnt } = next as INextElement;

        if (!next) {
          onGameStop.call(this, false);

          return Promise.reject();
        }

        await animateElement.call(this, nextRow, nextColumn, nextEnt);
        break;
      }
      default: {
        await animateComponent.call(this, 'pipe-in', row, column, ent);

        const spec: IElement = elements.filter((item: IElement) => {
          return item.type === element.type;
        })[0] || null;
        const outlets: number[] = spec.outlets[element.direction].filter((item: number) => {
          return item !== ent;
        });

        await Promise.all(outlets.map((out: number) => {
          return animateComponent.call(this, 'pipe-out', row, column, out);
        }));

        updateElementsMap.call(this, element.type, row, column, element.direction, true);

        const nextElements: INextElement[] = [];

        for (const out of outlets) {
          const next: INextElement | boolean = getNextElement.call(this, row, column, out);

          if (next === false) {
            onGameStop.call(this, false);

            return Promise.reject();
          }

          if (next) {
            nextElements.push(next as INextElement);
          }
        }

        await Promise.all(
          nextElements.map((item: INextElement) => {
            return animateElement.call(this, item.nextRow, item.nextColumn, item.nextEnt);
          }),
        );
        break;
      }
    }

    this.animationPromisesCount -= 1;

    if (!this.isGameOver && this.animationPromisesCount === 0) {
      onGameStop.call(this, true);
    }

    return Promise.resolve();
  }
}

function getNextElement(row: number, column: number, ent: number): INextElement | boolean {
  let nextRow = 0;
  let nextColumn = 0;
  let nextEnt = 0;

  switch (ent) {
    case 0: {
      nextRow = row - 1;
      nextColumn = column;
      nextEnt = 2;
      break;
    }
    case 1: {
      nextRow = row;
      nextColumn = column + 1;
      nextEnt = 3;
      break;
    }
    case 2: {
      nextRow = row + 1;
      nextColumn = column;
      nextEnt = 0;
      break;
    }
    case 3: {
      nextRow = row;
      nextColumn = column - 1;
      nextEnt = 1;
      break;
    }
    default:
      break;
  }

  let next: INextElement | boolean = false;

  this.elementsMap.map((item: IElementMapItem) => {
    if (item.position.row === nextRow && item.position.column === nextColumn) {
      const nextSpec: IElement = elements.filter(element => element.type === item.type)[0] || null;

      if (nextSpec && nextSpec.outlets[item.direction].indexOf(nextEnt) !== -1 && !item.locked) {
        next = { nextRow, nextColumn, nextEnt };
      }

      if (item.locked) {
        next = null;
      }
    }
  });

  return next;
}

function onGameStop(result: boolean): void {
  this.isGameOver = true;

  if (result) {
    const gameScoreCounter: number = parseInt(document.getElementById('game-score-counter').innerText, 10);

    const score = {
      playername: this.playerName,
      difficulty: this.gameDifficulty,
      score: gameScoreCounter,
      date: (new Date()).getTime(),
    };

    this.gameScoreboard.push(score);

    saveStorageData('scoreboard', this.gameScoreboard);
  }

  displayGameResultModal.call(this, result);
}

export { animateElement };
