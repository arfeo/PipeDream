const displayPlayerNameModal = () => {
	const appRoot = document.getElementById('root');
	const playerNameModal = document.createElement('div');

	// Reset app root element
	appRoot.innerHTML = '';

	playerNameModal.className = 'modal medium';
	playerNameModal.innerHTML = (`
		<div class="label">Set player name:</div>
		<div>
			<input id="playername-input" type="text" value="${globals.playerName}" />
		</div>
		<div class="submit-block">
			<button id="playername-contimue">Continue</button>
		</div>
	`);

	appRoot.appendChild(playerNameModal);

	document.getElementById('playername-contimue').addEventListener('click', () => {
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

	// Reset app root element
	appRoot.innerHTML = '';

	difficultyModal.className = 'modal buttons-list small';
	difficultyModal.innerHTML = (`
		<div>
			<button difficulty="0" class="fullwidth">Easy</button>
		</div>
		<div>
			<button difficulty="1" class="fullwidth">Hard</button>
		</div>
		<div>
			<button difficulty="2" class="fullwidth">Nightmare</button>
		</div>
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
			<button class="fullwidth">Scoreboard</button>
		</div>
	`);

	appRoot.appendChild(mainMenuModal);

	document.getElementById('start-new-game').addEventListener('click', startNewGame);
	document.getElementById('display-difficulty-modal').addEventListener('click', displayDifficultyModal);
	document.getElementById('display-playername-modal').addEventListener('click', displayPlayerNameModal);
};