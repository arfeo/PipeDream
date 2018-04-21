const displayMainMenuModal = () => {
    const appRoot = document.getElementById('root');
    const mainMenuModal = document.createElement('div');

    // Reset app root element
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

    document.getElementById('start-new-game').addEventListener('click', startNewGame);
    document.getElementById('display-difficulty-modal').addEventListener('click', displayDifficultyModal);
    document.getElementById('display-playername-modal').addEventListener('click', displayPlayerNameModal);
    document.getElementById('display-scoreboard-modal').addEventListener('click', displayScoreboardModal);
    document.getElementById('display-rules-modal').addEventListener('click', displayRulesModal);
};

const displayPlayerNameModal = () => {
    const appRoot = document.getElementById('root');
    const playerNameModal = document.createElement('div');

    // Reset app root element
    appRoot.innerHTML = '';

    playerNameModal.className = 'modal small';
    playerNameModal.innerHTML = (`
		<div class="label">Set player name:</div>
		<div>
			<input id="playername-input" type="text" value="${globals.playerName}" />
		</div>
		<div class="submit-block">
			<button id="playername-continue">Continue</button>
		</div>
	`);

    appRoot.appendChild(playerNameModal);

    document.getElementById('playername-continue').addEventListener('click', () => {
        const playerName = document.getElementById('playername-input').value;

        if (playerName !== '') {
            globals.playerName = playerName;
            saveData('playername', playerName);
            displayMainMenuModal();
        }
    });
};

const displayDifficultyModal = () => {
	const appRoot = document.getElementById('root');
	const difficultyModal = document.createElement('div');

	const buildDifficultyList = () => {
		const difficulties = constants.difficultyMatrix;
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

	// Reset app root element
	appRoot.innerHTML = '';

	difficultyModal.className = 'modal buttons-list small';
	difficultyModal.innerHTML = (`
		${buildDifficultyList()}
	`);

	appRoot.appendChild(difficultyModal);

	[...document.getElementsByTagName('button')].map((btn) => {
		btn.addEventListener('click', (e) => {
			const difficulty = parseInt(e.currentTarget.getAttribute('difficulty'));

			globals.gameDifficulty = difficulty;
			saveData('difficulty', difficulty);
			displayMainMenuModal();
		});
	});
};

const displayGameResultModal = (result) => {
    const appRoot = document.getElementById('root');
    const modalContainer = document.createElement('div');
    const modalOverlay = document.createElement('div');
    const gameResultModal = document.createElement('div');

    modalContainer.className = 'modal-container';
    modalOverlay.className = 'modal-overlay';
    gameResultModal.className = 'modal medium';
    gameResultModal.innerHTML = (`
    	<div id="game-result-message">${result ? 'You have won!' : 'Game over'}</div>
    	<div class="submit-block">
    		<button id="return-to-menu">Go to menu</button>
			<button id="play-again">Play gain</button>
		</div>
    `);

    appRoot.appendChild(modalContainer);
    modalContainer.appendChild(modalOverlay);
    modalContainer.appendChild(gameResultModal);

    document.getElementById('return-to-menu').addEventListener('click', displayMainMenuModal);
    document.getElementById('play-again').addEventListener('click', startNewGame);
};

const displayScoreboardModal = () => {
    const appRoot = document.getElementById('root');
    const scoreboardModal = document.createElement('div');

    const clearScores = () => {
        if (confirm('Are you sure you want to clear scores?')) {
            globals.gameScoreboard = [];

            saveData('scoreboard', globals.gameScoreboard);

            displayScoreboardModal();
        }
    };

    const buildScoreList = () => {
        const scoreArray = sortArrayByKey(globals.gameScoreboard, 'score');
        let scoreList = '';

        if (globals.gameScoreboard.length === 0) {
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

    // Reset app root element
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

    document.getElementById('clear-scores').addEventListener('click', clearScores);
    document.getElementById('return-to-menu').addEventListener('click', displayMainMenuModal);
};

const displayRulesModal = () => {
    const appRoot = document.getElementById('root');
    const rulesModal = document.createElement('div');

    // Reset app root element
    appRoot.innerHTML = '';

    rulesModal.className = 'modal medium';
    rulesModal.innerHTML = (`
    	<div>
    		<p>Using a variety of pipe pieces presented randomly in a queue, the player must construct a path from the start piece for the onrushing sewer slime, or "flooz", which begins flowing after a time delay from the start of the round.</p>
    		<p>Pieces may not be rotated; they must be placed as presented in the queue.</p>
    		<p>The player can replace a previously laid piece by clicking on it, as long as the flooz has not yet reached it; however, doing so causes a short time delay before the next piece can be laid.</p>
    		<p>The flooz is required to pass through a given number of pipe pieces.</p>
    	</div>
    	<div class="submit-block">
    		<button id="return-to-menu">Go to menu</button>
		</div>
    `);

    appRoot.appendChild(rulesModal);

    document.getElementById('return-to-menu').addEventListener('click', displayMainMenuModal);
};

const startNewGame = () => {
    createGameWorkspace();
    setNewGameState();
};
