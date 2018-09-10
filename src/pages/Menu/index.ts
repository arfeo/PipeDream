import { Game } from '../Game';

import { constants } from '../../constants';

import { sortArrayByKey } from '../../utils/common';
import { getData, saveData } from '../../utils/storage';

import { IDifficultyMatrixItem, IGameScoreboardItem } from '../../types/global';
import { IMenu } from './types';

class Menu implements IMenu {
  playerName: string;
  gameDifficulty: number;
  gameScoreboard: IGameScoreboardItem[];

  constructor() {
    this.onMount();
  }

  onMount = () => {
    this.playerName = getData('playername') || '';
    this.gameDifficulty = parseInt(getData('difficulty')) || 0;
    this.gameScoreboard = getData('scoreboard') || [];

    if (!this.playerName) {
      this.displayPlayerNameModal();

      return;
    }

    this.displayMainMenuModal();
  };

  displayMainMenuModal = () => {
    const appRoot: HTMLElement = document.getElementById('root');
    const mainMenuModal: HTMLElement = document.createElement('div');

    // Reset src root element
    appRoot.innerHTML = '';

    mainMenuModal.className = 'modal buttons-list small';
    mainMenuModal.innerHTML = (`
    <div>
      <button id="start-new-game" class="fullwidth">Play</button>
    </div>
    <div>
      <button id="display-difficulty-modal" class="fullwidth">Choose difficulty</button>
    </div>
    <div>
      <button id="display-playername-modal" class="fullwidth">Change player name</button>
    </div>
    <div>
      <button id="display-scoreboard-modal" class="fullwidth">Scoreboard</button>
    </div>
    <div>
      <button id="display-rules-modal" class="fullwidth">Rules</button>
    </div>
  `);

    appRoot.appendChild(mainMenuModal);

    document
      .getElementById('start-new-game')
      .addEventListener('click', this.startNewGame);
    document
      .getElementById('display-difficulty-modal')
      .addEventListener('click', this.displayDifficultyModal);
    document
      .getElementById('display-playername-modal')
      .addEventListener('click', this.displayPlayerNameModal);
    document
      .getElementById('display-scoreboard-modal')
      .addEventListener('click', this.displayScoreboardModal);
    document
      .getElementById('display-rules-modal')
      .addEventListener('click', this.displayRulesModal);
  };

  displayPlayerNameModal = () => {
    const appRoot: HTMLElement = document.getElementById('root');
    const playerNameModal: HTMLElement = document.createElement('div');

    // Reset src root element
    appRoot.innerHTML = '';

    playerNameModal.className = 'modal small';
    playerNameModal.innerHTML = (`
    <div class="label">Set player name:</div>
    <div>
      <input id="playername-input" type="text" value="${this.playerName}" />
    </div>
    <div class="submit-block">
      <button id="playername-continue">Continue</button>
    </div>
  `);

    appRoot.appendChild(playerNameModal);

    document
      .getElementById('playername-continue')
      .addEventListener('click', () => {
        const playerNameInput: HTMLInputElement = document.getElementById(
          'playername-input',
        ) as HTMLInputElement;
        const playerName: string = playerNameInput.value;

        if (playerName) {
          this.playerName = playerName;

          saveData('playername', playerName);

          this.displayMainMenuModal();
        }
      });
  };

  displayDifficultyModal = () => {
    const appRoot: HTMLElement = document.getElementById('root');
    const difficultyModal: HTMLElement = document.createElement('div');

    const buildDifficultyList = (): string => {
      const difficulties: IDifficultyMatrixItem[] = constants.difficultyMatrix;
      let difficultyList = '';

      for (let i = 0; i < difficulties.length; i += 1) {
        difficultyList += (`
				<div>
					<button difficulty="${i}" class="fullwidth">${difficulties[i].name}</button>
				</div>
			`);
      }

      return difficultyList;
    };

    // Reset src root element
    appRoot.innerHTML = '';

    difficultyModal.className = 'modal buttons-list small';
    difficultyModal.innerHTML = (`
		${buildDifficultyList()}
	`);

    appRoot.appendChild(difficultyModal);

    const buttons: NodeListOf<HTMLButtonElement> = document.getElementsByTagName('button');

    Array.from(buttons).map((currentButton: HTMLButtonElement) => {
      currentButton.addEventListener('click', (event: Event) => {
        const currentTarget: HTMLElement = event.currentTarget as HTMLElement;
        const difficulty = parseInt(currentTarget.getAttribute('difficulty'));

        this.gameDifficulty = difficulty;

        saveData('difficulty', difficulty);

        this.displayMainMenuModal();
      });
    });
  };

  displayScoreboardModal = () => {
    const appRoot: HTMLElement = document.getElementById('root');
    const scoreboardModal: HTMLElement = document.createElement('div');

    const clearScores = () => {
      if (confirm('Are you sure you want to clear scores?')) {
        this.gameScoreboard = [];

        saveData('scoreboard', this.gameScoreboard);

        this.displayScoreboardModal();
      }
    };

    const buildScoreList = (): string => {
      const scoreArray: IGameScoreboardItem[] = sortArrayByKey(this.gameScoreboard, 'score');
      let scoreList = '';

      if (this.gameScoreboard.length === 0) {
        return (`
        <tr>
          <td colspan="3" class="center">
            <em>Scoreboard is empty at the moment.</em>
          </td>
        </tr>
      `);
      }

      for (let i = 0; i < 10; i += 1) {
        if (scoreArray[i]) {
          scoreList += (`
          <tr>
            <td>${scoreArray[i].playername}</td>
            <td>${constants.difficultyMatrix[scoreArray[i].difficulty].name}</td>
            <td>${scoreArray[i].score}</td>
          </tr>
        `);
        }
      }

      return scoreList;
    };

    // Reset src root element
    appRoot.innerHTML = '';

    scoreboardModal.className = 'modal large';
    scoreboardModal.innerHTML = (`
    <table class="game-scoreboard">
      <thead>
        <tr>
          <th class="player">Player</th>
          <th class="difficulty">Difficulty</th>
          <th class="score">Score</th>
        </tr>	
      </thead>
      <tbody>
        ${buildScoreList()}
      </tbody>
    </table>
      <div class="submit-block">
        <button id="clear-scores">Clear scores</button>
      <button id="return-to-menu">Go to menu</button>
    </div>
  `);

    appRoot.appendChild(scoreboardModal);

    document
      .getElementById('clear-scores')
      .addEventListener('click', clearScores);
    document
      .getElementById('return-to-menu')
      .addEventListener('click', this.displayMainMenuModal);
  };

  displayRulesModal = () => {
    const appRoot: HTMLElement = document.getElementById('root');
    const rulesModal: HTMLElement = document.createElement('div');

    // Reset src root element
    appRoot.innerHTML = '';

    rulesModal.className = 'modal medium';
    rulesModal.innerHTML = (`
    <div>
      <p>
        Using a variety of pipe pieces presented randomly in a queue,
        the player must construct a path from the start piece for the onrushing sewer slime,
        or "flooz", which begins flowing after a time delay from the start of the round.
      </p>
      <p>Pieces may not be rotated; they must be placed as presented in the queue.</p>
      <p>
        The player can replace a previously laid piece by clicking on it,
        as long as the flooz has not yet reached it; however,
        doing so causes a short time delay before the next piece can be laid.
      </p>
      <p>The flooz is required to pass through a given number of pipe pieces.</p>
    </div>
    <div class="submit-block">
      <button id="return-to-menu">Go to menu</button>
    </div>
  `);

    appRoot.appendChild(rulesModal);

    document
      .getElementById('return-to-menu')
      .addEventListener('click', this.displayMainMenuModal);
  };

  startNewGame = () => {
    new Game();
  };
}

export { Menu };
