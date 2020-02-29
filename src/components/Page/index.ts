import { getStorageData } from '../../utils/storage';

import { IGameScoreboardItem } from '../../types/global';

abstract class Page {
  protected playerName: string;
  protected gameDifficulty: number;
  protected gameScoreboard: IGameScoreboardItem[];
  protected appRoot: HTMLElement;

  abstract render(): void;

  protected constructor() {
    this.playerName = getStorageData('playername') || '';
    this.gameDifficulty = parseInt(getStorageData('difficulty'), 10) || 0;
    this.gameScoreboard = getStorageData('scoreboard') || [];
    this.appRoot = document.getElementById('root');
  }
}

export { Page };
