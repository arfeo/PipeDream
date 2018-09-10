import { IGameScoreboardItem } from '../../types/global';

export interface IGame {
  playerName: string;
  expectedElements: IExpectedElements[];
  startPoint: {
    position: IPosition;
    direction: number;
  },
  elementsMap: IElementMapItem[];
  gameDifficulty: number;
  isGameOver: boolean;
  gameTimer: number;
  gameScoreCounter: number;
  animationPromisesCount: number;
  gameScoreboard: IGameScoreboardItem[];

  onMount(): void;
}

export interface IElementMapItem {
  type: number;
  direction: number;
  position: IPosition;
  locked: boolean;
}

export interface INextElement {
  nextRow: number;
  nextColumn: number;
  nextEnt: number;
}

export interface IPosition {
  row: number;
  column: number;
}

export interface IExpectedElements {
  type: number;
  direction: number;
}
