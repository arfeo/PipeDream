/*
 *	Directions:
 *	0 -> N
 *	1 -> E
 *	2 -> S
 *	3 -> W
 */

const constants = {
	elementsSpec: [
		{
			/*
			 *       ______
			 *      |      |
			 *      |_    _|
			 *        |  |
			 *        |  |
			 */
			type: 0,
			outlets: [
				[ 0 ],
				[ 1 ],
				[ 2 ],
				[ 3 ],
			],
		},
		{
			/*
			 *        |  |
			 *        |  |
			 *        |  |
			 *        |  |
			 *        |  |
			 */
			type: 1,
			outlets: [
				[ 0, 2 ],
				[ 1, 3 ],
				[ 2, 0 ],
				[ 3, 1 ],
			],
		},
		{
			/*
			 *        |  |
			 *        |  |
			 *        |__|
			 *
			 *
			 */
			type: 2,
			outlets: [
				[ 0 ],
				[ 1 ],
				[ 2 ],
				[ 3 ],
			],
		},
		{
			/*
			 *        |  |
			 *    ____|  |____
			 *    ____    ____
			 *        |  |
			 *        |  |
			 */
			type: 3,
			outlets: [
				[ 0, 1, 2, 3 ],
				[ 1, 2, 3, 0 ],
				[ 2, 3, 0, 1 ],
				[ 3, 0, 1, 2 ],
			],
		},
		{
			/*
			 *        |  |
			 *    ____|  |____
			 *    ____________
			 *
			 *
			 */
			type: 4,
			outlets: [
				[ 0, 1, 3 ],
				[ 0, 1, 2 ],
				[ 1, 2, 3 ],
				[ 2, 3, 0 ],
			],
		},
		{
			/*
			 *        |  |
			 *        |  |____
			 *        |_______
			 *
			 *
			 */
			type: 5,
			outlets: [
				[ 0, 1 ],
				[ 1, 2 ],
				[ 2, 3 ],
				[ 3, 0 ],
			],
		},
	],
	difficultyMatrix: [
		{
			name: 'Easy',
			speed: 100,
			time: 180,
			scorex: 1,
		},
		{
			name: 'Hard',
			speed: 60,
			time: 120,
			scorex: 2,
		},
		{
			name: 'Nightmare',
			speed: 20,
			time: 60,
			scorex: 3,
		},
	],
};

const storageData = {
	playername: getData('playername') || '',
	difficulty: parseInt(getData('difficulty')) || 0,
};

const globals = {
	playerName: storageData.playername,
	expectedElements: [],
	startPoint: {
		position: {},
	},
	elementsMap: [],
	gameDifficulty: storageData.difficulty,
	isGameOver: false,
	gameTimer: null,
	gameScoreCounter: null,
	animationPromisesCount: 0,
};

function getData(item) {
  try {
    const data = JSON.parse(localStorage.getItem(item));
    return data;
  } catch (error) {
    console.error(error);
  }
}

function saveData(item, data) {
  try {
    localStorage.setItem(item, JSON.stringify(data));
    return data;
  } catch (error) {
  	console.error(error);
  }
}

const timeTicker = (ticker) => {
	const gameTimeTicker = document.getElementById('game-time-ticker');

	if (gameTimeTicker) {
		const min = parseInt(ticker / 60);
		const sec = parseInt(ticker - min * 60);

		if (min === 0 && sec === 0) {
			onOpenValve();
		}

		const timeString = (min < 10 ? `0${min}` : min) + ':' + (sec < 10 ? `0${sec}` : sec);

		gameTimeTicker.innerHTML = (min === 0 && sec <= 10) ? `<span class="orangered">${timeString}</span>` : timeString;

		if (ticker > 0) {
			globals.gameTimer = setTimeout(() => timeTicker(ticker - 1), 1000);
		}
	}
};

const scoreCounter = (score) => {
	const gameScoreCounter = document.getElementById('game-score-counter');

	if (globals.isGameOver) {
		clearTimeout(globals.gameScoreCounter);
	} else {
		gameScoreCounter.innerHTML = score * constants.difficultyMatrix[globals.gameDifficulty].scorex;

		globals.gameScoreCounter = setTimeout(() => scoreCounter(score + 1), 100);
	}
};

const randomNum = (min = 1, max = 1) => {
	return Math.floor(min + Math.random() * (max + 1 - min));
};

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

const createGameWorkspace = () => {
	const appRoot = document.getElementById('root');
	const gameStatusPanel = document.createElement('div');
	const gameBoard = document.createElement('div');
	const gameToolbox = document.createElement('div');
	const toolboxExpected = document.createElement('div');

	// Reset app root element
	appRoot.innerHTML = '';

	// Create the workspace
	gameStatusPanel.className = 'status-panel';
	gameStatusPanel.innerHTML = (`
		<div><span>Score:</span><strong id="game-score-counter">0</strong></div>
		<div><span>Time:</span><strong id="game-time-ticker"></strong></div>
		<div><span>Difficulty:</span><strong>${constants.difficultyMatrix[globals.gameDifficulty].name}</strong></div>
	`);
	gameBoard.className = 'board';
	gameToolbox.className = 'toolbox';
	gameToolbox.innerHTML = (`
		<div class="toolbox__buttons">
			<button id="open-valve-button" class="open-valve-button">▶</button>
			<button id="reset-game-button" class="reset-game-button">⟲</button>
			<button id="main-menu-button" class="main-menu-button fullwidth">Menu</button>
		</div>
	`);
	toolboxExpected.className = 'toolbox__expected';

	appRoot.appendChild(gameStatusPanel);
	appRoot.appendChild(gameBoard);
	appRoot.appendChild(gameToolbox);
	gameToolbox.appendChild(toolboxExpected);

	// Create game board cell containers
	for (let row = 1; row <= 7; row += 1) {
		for (let column = 1; column <= 10; column += 1) {
			const boardCellContainer = document.createElement('div');

			boardCellContainer.className = 'board__cell-container';
			boardCellContainer.innerHTML = (`
				<canvas id="cell-${row}-${column}" class="board__cell" width="100" height="100"></canvas>
				<canvas id="cell-animation-${row}-${column}" class="board__cell-animation" width="100" height="100"></canvas>
			`);

			gameBoard.appendChild(boardCellContainer);

			document.getElementById(`cell-animation-${row}-${column}`)
				.addEventListener('click', () => onBoardCellClick(row, column));
		}
	}

	// Create expected elements view
	for (let i = 0; i < 5; i += 1) {
		const toolboxExpectedElement = document.createElement('canvas');

		toolboxExpectedElement.id = `element-${i}`;
		toolboxExpectedElement.className = 'toolbox__expected-element';
		toolboxExpectedElement.width = 100;
		toolboxExpectedElement.height = 100;

		toolboxExpected.appendChild(toolboxExpectedElement);
	}

	document.getElementById('open-valve-button').addEventListener('click', onOpenValve);
	document.getElementById('reset-game-button').addEventListener('click', onResetGame);
	document.getElementById('main-menu-button').addEventListener('click', onGotoMainMenu);
};

const clearGameState = () => {
	globals.expectedElements = [];
	globals.elementsMap = [];
	globals.startPoint.position = {};
	globals.isGameOver = false;
	globals.animationPromisesCount = 0;

	clearTimeout(globals.gameTimer);
	timeTicker(constants.difficultyMatrix[globals.gameDifficulty].time);

	for (let row = 1; row <= 7; row += 1) {
		for (let column = 1; column <= 10; column += 1) {
			const cell = document.getElementById(`cell-${row}-${column}`);
			const cellAnimation = document.getElementById(`cell-animation-${row}-${column}`);
			const ctx = cell.getContext('2d');
			const ctxAnimation = cellAnimation.getContext('2d');

			ctx.clearRect(0, 0, 100, 100);
			ctxAnimation.clearRect(0, 0, 100, 100);
		}
	}
};

const setNewGameState = () => {
	clearGameState();

	for (let i = 0; i < 5; i += 1) {
		pushNewExpectedElement();
	}

	drawStartPoint();
};

const drawStartPoint = () => {
	globals.startPoint.position.row = randomNum(1, 7);
	globals.startPoint.position.column = randomNum(1, 10);

	// Generate start point
	let isStartPointChosen = false;

	while (!isStartPointChosen) {
		globals.startPoint.direction = randomNum(0, 3);

		// Prevent dead-end
		switch (globals.startPoint.position.row) {
			case 1:
			{
				if (globals.startPoint.position.column === 1) {
					if (globals.startPoint.direction !== 0 && globals.startPoint.direction !== 3) {
						isStartPointChosen = true;
					}
				} else if (globals.startPoint.position.column === 10) {
					if (globals.startPoint.direction !== 0 && globals.startPoint.direction !== 1) {
						isStartPointChosen = true;
					}
				} else {
					if (globals.startPoint.direction !== 0) {
						isStartPointChosen = true;
					}
				}
				break;
			}
			case 7:
			{
				if (globals.startPoint.position.column === 1) {
					if (globals.startPoint.direction !== 2 && globals.startPoint.direction !== 3) {
						isStartPointChosen = true;
					}
				} else if (globals.startPoint.position.column === 10) {
					if (globals.startPoint.direction !== 1 && globals.startPoint.direction !== 2) {
						isStartPointChosen = true;
					}
				} else {
					if (globals.startPoint.direction !== 2) {
						isStartPointChosen = true;
					}
				}
				break;
			}
			default:
			{
				if (globals.startPoint.position.column === 1) {
					if (globals.startPoint.direction !== 3) {
						isStartPointChosen = true;
					}
				} else if (globals.startPoint.position.column === 10) {
					if (globals.startPoint.direction !== 1) {
						isStartPointChosen = true;
					}
				} else {
					isStartPointChosen = true;
				}
				break;
			}
		}
	}

	// Draw start point
	const startCell = document.getElementById(`cell-${globals.startPoint.position.row}-${globals.startPoint.position.column}`);
	const ctx = startCell.getContext('2d');

	ctx.fillStyle = 'black';
	ctx.fillRect(startCell.width / 2 - startCell.width / 8, 0, startCell.width / 4, startCell.height / 2);
	ctx.beginPath();
	ctx.arc(startCell.width / 2, startCell.height / 2, 25, 0, 2 * Math.PI, false);
	ctx.fill();

	ctx.fillStyle = 'lightblue';
	ctx.beginPath();
	ctx.arc(startCell.width / 2, startCell.height / 2, 12, 0, 2 * Math.PI, false);
	ctx.fill();

	startCell.style.transform = `rotate(${globals.startPoint.direction * 90}deg)`;

	updateElementsMap(
		0,
		globals.startPoint.position.row,
		globals.startPoint.position.column,
		globals.startPoint.direction,
		false,
	);
};

const drawExpectedElements = () => {
	for (el in globals.expectedElements) {
		const expectedElement = document.getElementById(`element-${el}`);
		const ctx = expectedElement.getContext('2d');

		ctx.fillStyle = 'white';

		drawElementByType(globals.expectedElements[el].type, ctx, expectedElement);

		expectedElement.style.transform = `rotate(${globals.expectedElements[el].direction * 90}deg)`;
	}
};

const drawElementByType = (type, ctx, item) => {
	ctx.clearRect(0, 0, item.width, item.height);

	switch (type) {
		case 1:
		{
			ctx.fillRect(item.width / 2 - item.width / 8, 0, item.width / 4, item.height);
			break;
		}
		case 2:
		{
			ctx.fillRect(item.width / 2 - item.width / 8, 0, item.width / 4, item.height / 2);
			ctx.beginPath();
			ctx.arc(item.width / 2, item.height / 2, 12, 0, 2 * Math.PI, false);
			ctx.fill();
			break;
		}
		case 3:
		{
			ctx.fillRect(item.width / 2 - item.width / 8, 0, item.width / 4, item.height);
			ctx.fillRect(0, item.height / 2 - item.height / 8, item.width, item.height / 4);
			break;
		}
		case 4:
		{
			ctx.fillRect(item.width / 2 - item.width / 8, 0, item.width / 4, item.height / 2);
			ctx.fillRect(0, item.height / 2 - item.height / 8, item.width, item.height / 4);
			break;
		}
		case 5:
		{
			ctx.fillRect(item.width / 2 - item.width / 8, 0, item.width / 4, item.height / 2);
			ctx.fillRect(item.width / 2 - item.width / 8, item.height / 2 - item.height / 8, item.width, item.height / 4);
			break;
		}
	}
};

const pushNewExpectedElement = () => {
	const type = randomNum(1, 5);
	const direction = randomNum(0, 3);

	globals.expectedElements.push({ type, direction });

	drawExpectedElements();
};

const updateElementsMap = (type, row, column, direction, locked) => {
	globals.elementsMap = [
		...globals.elementsMap.filter(e => JSON.stringify({ row, column }) !== JSON.stringify(e.position)),
		{
			position: { row, column },
			type,
			direction,
			locked,
		},
	];
};

const onBoardCellClick = (row, column) => {
	if (!globals.isGameOver) {
		const searchCell = globals.elementsMap.filter(e => JSON.stringify({ row, column }) === JSON.stringify(e.position))[0];

		if ((!searchCell || (searchCell && searchCell.locked === false)) && JSON.stringify({ row, column }) !== JSON.stringify(globals.startPoint.position)) {
			const currentCell = document.getElementById(`cell-${row}-${column}`);
			const nextElement = globals.expectedElements[0];
			const ctx = currentCell.getContext('2d');

			ctx.fillStyle = 'black';

			drawElementByType(globals.expectedElements[0].type, ctx, currentCell);
			currentCell.style.transform = `rotate(${globals.expectedElements[0].direction * 90}deg)`;

			updateElementsMap(globals.expectedElements[0].type, row, column, globals.expectedElements[0].direction, false);

			globals.expectedElements.shift();
			pushNewExpectedElement();
		}
	}
};

const animateComponent = (type, row, column, ent) => {
	return new Promise((resolve) => {
		const cell = document.getElementById(`cell-animation-${row}-${column}`);

		if (cell) {
			let interval = null;
			let i = 0;
			let s = 0;

			switch (type) {
				case 'pump':
				{
					i = 13;
					s = 21;
					break;
				}
				case 'pipe-out':
				{
					i = 10;
					s = 50;
					break;
				}
				case 'pipe-in':
				{
					i = 0;
					s = 59;
					break;
				}
			}

			interval = setInterval(() => {
				i += 1;

				if (i > s) {
					clearInterval(interval);
					resolve();
				} else {
					const ctx = cell.getContext('2d');

					ctx.fillStyle = 'lightblue';

					switch (type) {
						case 'pump':
						{
							ctx.beginPath();
							ctx.arc(cell.width / 2, cell.height / 2, i, 0, 2 * Math.PI, false);
							ctx.fill();
							break;
						}
						case 'pipe-in':
						{
							switch (ent) {
								case 0:
								{
									ctx.fillRect(cell.width / 2 - cell.width / 8 + 4, 0, cell.width / 4 - 8, i);
									break;
								}
								case 1:
								{
									ctx.fillRect(100 - i, cell.height / 2 - cell.height / 8 + 4, 100, cell.height / 4 - 8);
									break;
								}
								case 2:
								{
									ctx.fillRect(cell.width / 2 - cell.width / 8 + 4, 100 - i, cell.width / 4 - 8, 100 - i);
									break;
								}
								case 3:
								{
									ctx.fillRect(0, cell.height / 2 - cell.height / 8 + 4, i, cell.height / 4 - 8);
									break;
								}
							}
							break;
						}
						case 'pipe-out':
						{
							switch (ent) {
								case 0:
								{
									ctx.fillRect(cell.width / 2 - cell.width / 8 + 4, 50 - i, cell.width / 4 - 8, i);
									break;
								}
								case 1:
								{
									ctx.fillRect(50, cell.height / 2 - cell.height / 8 + 4, i, cell.height / 4 - 8);
									break;
								}
								case 2:
								{
									ctx.fillRect(cell.width / 2 - cell.width / 8 + 4, 50, cell.width / 4 - 8, i);
									break;
								}
								case 3:
								{
									ctx.fillRect(50 - i, cell.height / 2 - cell.height / 8 + 4, i, cell.height / 4 - 8);
									break;
								}
							}
							break;
						}
					}
				}
			}, constants.difficultyMatrix[globals.gameDifficulty].speed);
		}
	});
};

const animateElement = async (row, column, ent) => {
	if (!globals.isGameOver) {
		globals.animationPromisesCount += 1;

		const element = globals.elementsMap.filter(e => JSON.stringify({ row, column }) === JSON.stringify(e.position))[0] || {};

		switch (element.type) {
			case 0:
			{
				await Promise.all([
					animateComponent('pump', row, column, element.direction),
					animateComponent('pipe-out', row, column, element.direction),
				]);

				const next = getNextElement(row, column, element.direction);

				const { nextRow, nextColumn, nextEnt } = next;

				if (!next) {
					globals.isGameOver = true;
					console.log('GAME OVER!');

					return Promise.reject(false);
				}

				await animateElement(nextRow, nextColumn, nextEnt);
				break;
			}
			default:
			{
				await animateComponent('pipe-in', row, column, ent);

				const spec = constants.elementsSpec.filter(e => e.type === element.type)[0];
				const outlets = spec.outlets[element.direction].filter(e => e !== ent);

				console.log(outlets);

				await Promise.all(outlets.map(out => animateComponent('pipe-out', row, column, out)));

				const nextElements = [];

				for (out of outlets) {
					const next = getNextElement(row, column, out);

					if (next) {
						nextElements.push(next);
					}
				}

				console.log(nextElements);

				await Promise.all(nextElements.map(n => animateElement(n.nextRow, n.nextColumn, n.nextEnt)));
				break;
			}
		}

		updateElementsMap(element.type, row, column, element.direction, true);

		globals.animationPromisesCount -= 1;

		console.log(globals.animationPromisesCount);

		if (!globals.isGameOver && globals.animationPromisesCount === 0) {
			globals.isGameOver = true;
			console.log('SUCCESS!');
		}

		return Promise.resolve();
	}
};

const getNextElement = (row, column, ent) => {
	let nextRow = 0;
	let nextColumn = 0;
	let nextEnt = 0;

	switch (ent) {
		case 0:
		{
			nextRow = row - 1;
			nextColumn = column;
			nextEnt = 2;
			break;
		}
		case 1:
		{
			nextRow = row;
			nextColumn = column + 1;
			nextEnt = 3;
			break;
		}
		case 2:
		{
			nextRow = row + 1;
			nextColumn = column;
			nextEnt = 0;
			break;
		}
		case 3:
		{
			nextRow = row;
			nextColumn = column - 1;
			nextEnt = 1;
			break;
		}
	}

	if (globals.elementsMap.filter((e) => {
		const nextSpec = constants.elementsSpec.filter(s => s.type === e.type)[0];

		if (nextSpec && nextSpec.outlets[e.direction].indexOf(nextEnt) === -1) {
			return null;
		}

		return JSON.stringify({ row: nextRow, column: nextColumn }) === JSON.stringify(e.position) && !e.locked
	}).length > 0) {
		return { nextRow, nextColumn, nextEnt };
	}

	return false;
};

const onOpenValve = () => {
	clearTimeout(globals.gameTimer);

	scoreCounter(0);

	animateElement(globals.startPoint.position.row, globals.startPoint.position.column);
};

const onResetGame = () => {
	if (globals.elementsMap.length > 1 && !globals.isGameOver) {
		if (!confirm('Are you sure you want start a new game?')) {
			return;
		}
	}

	setNewGameState();
};

const onGotoMainMenu = () => {
	if (globals.elementsMap.length > 1 && !globals.isGameOver) {
		if (!confirm('Are you sure you want to abort game?')) {
			return;
		}
	}

	displayMainMenuModal();
}

const startNewGame = () => {
	createGameWorkspace();
	setNewGameState();
};

window.onload = () => {
	if (!globals.playerName) {
		displayPlayerNameModal();
	} else {
		displayMainMenuModal();
	}
}
