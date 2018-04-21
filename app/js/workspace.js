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
