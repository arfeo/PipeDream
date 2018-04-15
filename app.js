const globals = {
	expectedElements: [],
	startPoint: {
		position: {},
	},
	elementsMap: [],
	animationSpeed: 20,
	isGameOver: false,
};

const constants = {
	elementsSpec: [
		{
			type: 0,
			outlets: [
				[ 0 ], [ 1 ], [ 2 ], [ 3 ],
			],
		},
		{
			/*
			 *			| |
			 *			| |
			 *			| |
			 *			| |
			 *			| |
			 */

			type: 1,
			outlets: [
				[ 0, 2 ], [ 1, 3 ], [ 2, 0 ], [ 3, 1 ],
			],
		},
		{
			/*
			 *			| |
			 *			| |
			 *			|_|
			 *				
			 *			
			 */

			type: 2,
			outlets: [
				[ 0 ], [ 1 ], [ 2 ], [ 3 ],
			],
		},
		{
			/*
			 *			| |
			 *		____| |____
			 *		____   ____
			 *			| |
			 *			| |
			 */

			type: 3,
			outlets: [
				[ 0, 1, 2, 3 ], [ 1, 2, 3, 0 ], [ 2, 3, 0, 1 ], [ 3, 0, 1, 2 ],
			],
		},
		{
			/*
			 *			| |
			 *		____| |____
			 *		___________
			 *
			 *
			 */

			type: 4,
			outlets: [
				[ 0, 1, 3 ], [ 0, 1, 2 ], [ 1, 2, 3 ], [ 2, 3, 0 ],
			],
		},
		{
			/*
			 *			| |
			 *			| |____
			 *			|______
			 *
			 *
			 */

			type: 5,
			outlets: [
				[ 0, 1 ], [ 1, 2 ], [ 2, 3 ], [ 3, 0 ],
			],
		},
	],
};

const randomNum = (min = 1, max = 1) => {
	return Math.floor(min + Math.random() * (max + 1 - min));
};

const createWorkspace = () => {
	const appRoot = document.getElementById('root');
	const appBoard = document.createElement('div');
	const appToolbox = document.createElement('div');
	const toolboxNext = document.createElement('div');
	const toolboxButtons = document.createElement('div');
	const openValveButton = document.createElement('button');
	const resetGameButton = document.createElement('button');

	// Create the workspace
	appBoard.className = 'board';
	appToolbox.className = 'toolbox';
	toolboxNext.className = 'toolbox__expected';
	toolboxButtons.className = 'toolbox__buttons';
	openValveButton.className = 'open-valve-button';
	resetGameButton.className = 'reset-game-button';

	appRoot.appendChild(appBoard);
	appRoot.appendChild(appToolbox);
	appToolbox.appendChild(toolboxNext);
	appToolbox.appendChild(toolboxButtons);

	// Create game board cell containers
	for (let row = 1; row <= 7; row += 1) {
		for (let column = 1; column <= 10; column += 1) {
			const boardCellContainer = document.createElement('div');
			const boardCell = document.createElement('canvas');
			const boardCellAnimation = document.createElement('canvas');

			boardCellContainer.className = 'board__cell-container';

			boardCell.id = `cell-${row}-${column}`;
			boardCell.className = 'board__cell';
			boardCell.width = 100;
			boardCell.height = 100;

			boardCellAnimation.id = `cell-animation-${row}-${column}`;
			boardCellAnimation.className = 'board__cell-animation';
			boardCellAnimation.width = 100;
			boardCellAnimation.height = 100;

			appBoard.appendChild(boardCellContainer);
			boardCellContainer.appendChild(boardCell);
			boardCellContainer.appendChild(boardCellAnimation);

			boardCellAnimation.addEventListener('click', () => onBoardCellClick(row, column));
		}
	}

	// Create expected elements view
	for (let i = 0; i < 5; i += 1) {
		const toolboxNextElement = document.createElement('canvas');

		toolboxNextElement.id = `element-${i}`;
		toolboxNextElement.className = 'toolbox__expected-element';
		toolboxNextElement.width = 100;
		toolboxNextElement.height = 100;

		toolboxNext.appendChild(toolboxNextElement);
	}

	// Create open valve button
	openValveButton.innerHTML = '▶';
	toolboxButtons.appendChild(openValveButton);
	openValveButton.addEventListener('click', onOpenValve);

	resetGameButton.innerHTML = '⟲';
	toolboxButtons.appendChild(resetGameButton);
	resetGameButton.addEventListener('click', onResetGame);
};

const clearGameState = () => {
	globals.expectedElements = [];
	globals.elementsMap = [];
	globals.startPoint.position = {};
	globals.isGameOver = false;

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
			position: {
				row,
				column,
			},
			type,
			direction,
			locked,
		},
	];
};

const onBoardCellClick = (row, column) => {
	const searchCell = globals.elementsMap.filter(e => {
		return JSON.stringify({ row, column }) === JSON.stringify(e.position);
	})[0];

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
};

const animateComponent = (type, row, column, ent) => {
	return new Promise((resolve, reject) => {
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
			}, globals.animationSpeed);
		}
	});
};

const animateElement = (row, column, ent) => {
	return new Promise(async (resolve) => {
		if (!globals.isGameOver) {
			const element = globals.elementsMap.filter(e => JSON.stringify({ row, column }) === JSON.stringify(e.position))[0] || {};
			
			switch (element.type) {
				case 0:
				{
					await Promise.all([
						animateComponent('pump', row, column, element.direction),
						animateComponent('pipe-out', row, column, element.direction),
					]);
					
					const { nextRow, nextColumn, nextEnt } = await getNextElement(row, column, element.direction);

					await animateElement(nextRow, nextColumn, nextEnt);
					break;
				}
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				{
					const animatePromises = [];
					const nextPromises = [];

					updateElementsMap(element.type, row, column, element.direction, true);

					await animateComponent('pipe-in', row, column, ent);

					const spec = constants.elementsSpec.filter(e => e.type === element.type)[0];
					const outlets = spec.outlets[element.direction].filter(e => e !== ent);
					
					for (const out of outlets) {
						animatePromises.push(animateComponent('pipe-out', row, column, out));
					}

					await Promise.all(animatePromises);

					for (const out of outlets) {
						const next = await getNextElement(row, column, out);

						if (next) {
							const { nextRow, nextColumn, nextEnt } = next;
							
							nextPromises.push(animateElement(nextRow, nextColumn, nextEnt));
						} else {
							globals.isGameOver = true;
							console.log('GAME OVER!');
						}
					}

					await Promise.all(nextPromises);
					break;
				}
			}

			resolve();
		}
	});
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
		return JSON.stringify({ row: nextRow, column: nextColumn }) === JSON.stringify(e.position) && e.locked === false
	}).length > 0) {
		return {
			nextRow,
			nextColumn,
			nextEnt,
		};
	}

	return false;
};

const onOpenValve = () => {
	animateElement(globals.startPoint.position.row, globals.startPoint.position.column);
};

const onResetGame = () => {
	setNewGameState();
};

const startNewGame = () => {
	createWorkspace();
	setNewGameState();
};

window.onload = () => {
	startNewGame();
}
