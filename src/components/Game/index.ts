import { Page } from '../Page';

import { createGameBoard } from './render';
import { initializeGameState } from './state';

import {
  IElementMapItem,
  IExpectedElements,
  IPosition,
} from './types';

class Game extends Page {
  expectedElements: IExpectedElements[];
  startPoint: { position: IPosition; direction: number };
  elementsMap: IElementMapItem[];
  isGameOver: boolean;
  gameTimer: number;
  gameScoreCounter: number;
  animationPromisesCount: number;
  isElementRedrawing: boolean;

  constructor() {
    super();

    this.expectedElements = [];
    this.startPoint = {
      position: {
        row: 0,
        column: 0,
      },
      direction: null,
    };
    this.elementsMap = [];
    this.isGameOver = false;
    this.gameTimer = null;
    this.gameScoreCounter = null;
    this.animationPromisesCount = 0;
    this.isElementRedrawing = false;

    this.render();
  }

  render() {
    createGameBoard.call(this);
    initializeGameState.call(this);
  }
}

export { Game };
