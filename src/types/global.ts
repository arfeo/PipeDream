export interface IElement {
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
