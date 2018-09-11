import { getData } from '../utils/storage';

import { IGameScoreboardItem } from '../types/global';

class Page {
  protected playerName: string;
  protected gameDifficulty: number;
  protected gameScoreboard: IGameScoreboardItem[];
  protected appRoot: HTMLElement;

  constructor() {
    this.playerName = getData('playername') || '';
    this.gameDifficulty = parseInt(getData('difficulty')) || 0;
    this.gameScoreboard = getData('scoreboard') || [];
    this.appRoot = document.getElementById('root');
  }
}

export { Page };
