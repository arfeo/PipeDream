import { Page } from '../../components/Page';

import { createGameGameboard, setNewGameState } from './gameboard';

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

    this.onMount().catch(() => console.error('Could not initialize game board'));
  }

  private async onMount() {
    createGameGameboard.call(this);

    await setNewGameState.call(this);
  }
}

export { Game };
