import { IGameScoreboardItem } from '../../types/global';

export interface IMenu {
  playerName: string;
  gameDifficulty: number;
  gameScoreboard: IGameScoreboardItem[];

  onMount(): void;
  displayMainMenuModal(): void;
  displayPlayerNameModal(): void;
  displayDifficultyModal(): void;
  displayScoreboardModal(): void;
  displayRulesModal(): void;
  startNewGame(): void;
}
