import { displayMainMenuModal, displayPlayerNameModal } from './modals';
import { getData } from '../utils/storage';

import {
  IGame,
  IElementMapItem,
  IExpectedElements,
  IGameScoreboardItem,
  IPosition,
} from '../types';

class Game implements IGame {
  playerName: string;
  expectedElements: IExpectedElements[];
  startPoint: {
    position: IPosition;
    direction: number;
  };
  elementsMap: IElementMapItem[];
  gameDifficulty: number;
  isGameOver: boolean;
  gameTimer: number;
  gameScoreCounter: number;
  animationPromisesCount: number;
  gameScoreboard: IGameScoreboardItem[];

  constructor() {
    this.playerName = '';
    this.playerName = '';
    this.expectedElements = [];
    this.startPoint = {
      position: {
        row: 0,
        column: 0,
      },
      direction: null,
    };
    this.elementsMap = [];
    this.gameDifficulty = 0;
    this.gameDifficulty = 0;
    this.isGameOver = false;
    this.gameTimer = null;
    this.gameScoreCounter = null;
    this.animationPromisesCount = 0;
    this.gameScoreboard = null;
    this.gameScoreboard = [];

    this.gameInit();
  }

  gameInit = () => {
    this.playerName = getData('playername') || '';
    this.gameDifficulty = parseInt(getData('difficulty')) || 0;
    this.gameScoreboard = getData('scoreboard') || [];

    if (!this.playerName) {
      displayPlayerNameModal.call(this);

      return;
    }

    displayMainMenuModal.call(this);
  }
}

export { Game };
