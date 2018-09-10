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

  gameInit(): void;
}

export interface IConstants {
  elementsSpec: IElementSpecItem[];
  difficultyMatrix: IDifficultyMatrixItem[];
}

export interface IElementMapItem {
  type: number;
  direction: number;
  position: IPosition;
  locked: boolean;
}

export interface IElementSpecItem {
  type: number;
  outlets: number[][];
}

export interface IDifficultyMatrixItem {
  name: string;
  speed: number;
  time: number;
  scorex: number;
}

export interface IGameScoreboardItem {
  playername: string;
  score: number;
  difficulty: number;
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
