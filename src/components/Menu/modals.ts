import { Game } from '../Game';

import { difficultyMatrix } from '../../constants/common';

import { saveStorageData } from '../../utils/storage';
import { sortArrayByKey } from '../../utils/common';

import { IDifficultyMatrixItem, IGameScoreboardItem } from '../../types/global';

function displayMainMenuModal(): void {
  const mainMenuModal: HTMLElement = document.createElement('div');

  // Reset src root element
  this.appRoot.innerHTML = '';

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

  this.appRoot.appendChild(mainMenuModal);

  document
    .getElementById('start-new-game')
    .addEventListener('click', () => new Game());
  document
    .getElementById('display-difficulty-modal')
    .addEventListener('click', displayDifficultyModal.bind(this));
  document
    .getElementById('display-playername-modal')
    .addEventListener('click', displayPlayerNameModal.bind(this));
  document
    .getElementById('display-scoreboard-modal')
    .addEventListener('click', displayScoreboardModal.bind(this));
  document
    .getElementById('display-rules-modal')
    .addEventListener('click', displayRulesModal.bind(this));
}

function displayPlayerNameModal(): void {
  const playerNameModal: HTMLElement = document.createElement('div');

  // Reset src root element
  this.appRoot.innerHTML = '';

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

  this.appRoot.appendChild(playerNameModal);

  document
    .getElementById('playername-continue')
    .addEventListener('click', () => {
      const playerNameInput: HTMLInputElement = document.getElementById(
        'playername-input',
      ) as HTMLInputElement;
      const playerName: string = playerNameInput.value;

      if (playerName) {
        this.playerName = playerName;

        saveStorageData('playername', playerName);

        displayMainMenuModal.call(this);
      }
    });
}

function displayDifficultyModal(): void {
  const difficultyModal: HTMLElement = document.createElement('div');

  const buildDifficultyList = (): string => {
    const difficulties: IDifficultyMatrixItem[] = difficultyMatrix;
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
  this.appRoot.innerHTML = '';

  difficultyModal.className = 'modal buttons-list small';
  difficultyModal.innerHTML = buildDifficultyList();

  this.appRoot.appendChild(difficultyModal);

  const buttons: HTMLCollectionOf<HTMLButtonElement> = document.getElementsByTagName('button');

  Array.from(buttons).map((currentButton: HTMLButtonElement) => {
    currentButton.addEventListener('click', (event: Event) => {
      const currentTarget: HTMLElement = event.currentTarget as HTMLElement;
      const difficulty = parseInt(currentTarget.getAttribute('difficulty'), 10);

      this.gameDifficulty = difficulty;

      saveStorageData('difficulty', difficulty);

      displayMainMenuModal.call(this);
    });
  });
}

function displayScoreboardModal(): void {
  const scoreboardModal: HTMLElement = document.createElement('div');

  const clearScores = (): void => {
    if (confirm('Are you sure you want to clear scores?')) {
      this.gameScoreboard = [];

      saveStorageData('scoreboard', this.gameScoreboard);

      displayScoreboardModal.call(this);
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
            <td>${difficultyMatrix[scoreArray[i].difficulty].name}</td>
            <td>${scoreArray[i].score}</td>
          </tr>
        `);
      }
    }

    return scoreList;
  };

  // Reset src root element
  this.appRoot.innerHTML = '';

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

  this.appRoot.appendChild(scoreboardModal);

  document
    .getElementById('clear-scores')
    .addEventListener('click', clearScores);
  document
    .getElementById('return-to-menu')
    .addEventListener('click', displayMainMenuModal.bind(this));
}

/**
 * Rules modal dialog
 */
function displayRulesModal(): void {
  const rulesModal: HTMLElement = document.createElement('div');

  // Reset src root element
  this.appRoot.innerHTML = '';

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

  this.appRoot.appendChild(rulesModal);

  document
    .getElementById('return-to-menu')
    .addEventListener('click', displayMainMenuModal.bind(this));
}

export { displayMainMenuModal, displayPlayerNameModal };
