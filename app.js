const globals = {
	expectedElements: [],
	startPoint: {
		position: {},
	},
	elementsMap: [],
};

const randomNum = (min = 1, max = 1) => {
	return Math.floor(min + Math.random() * (max + 1 - min));
};

const createWorkspace = () => {
	const appRoot = document.getElementById('root');
	const appBoard = document.createElement('div');
	const appTools = document.createElement('div');
	const toolboxNext = document.createElement('div');

	// Create the workspace
	appBoard.className = 'board';
	appTools.className = 'toolbox';
	toolboxNext.className = 'toolbox__expected';

	appRoot.appendChild(appBoard);
	appRoot.appendChild(appTools);
	appTools.appendChild(toolboxNext);

	// Create game board cells
	for (let row = 1; row <= 7; row += 1) {
		for (let column = 1; column <= 10; column += 1) {
			const boardCell = document.createElement('canvas');

			boardCell.id = `cell-${row}-${column}`;
			boardCell.className = 'board__cell';
			boardCell.width = 100;
			boardCell.height = 100;

			appBoard.appendChild(boardCell);

			boardCell.addEventListener('click', () => onBoardCellClick(row, column));
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
};

const drawStartPoint = () => {
	globals.startPoint.position.row = randomNum(1, 7);
	globals.startPoint.position.column = randomNum(1, 10);
	
	// Generate start point
	let isStartPointChosen = false;

	while (!isStartPointChosen) {
		globals.startPoint.direction = randomNum(0, 3);

		// Prevent dead-end
		if (globals.startPoint.position.row === 1) {
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
		} else if (globals.startPoint.position.row === 7) {
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
		} else {
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
		}
	}

	// Draw start point
	const startCell = document.getElementById(`cell-${globals.startPoint.position.row}-${globals.startPoint.position.column}`);
	
	ctx = startCell.getContext('2d');
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
};

const drawExpectedElements = () => {
	for (el in globals.expectedElements) {
		const expectedElement = document.getElementById(`element-${el}`);
		
		ctx = expectedElement.getContext('2d');
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

			/*
			 *			| |
			 *			| |
			 *			| |
			 *			| |
			 *			| |
			 */

			ctx.fillRect(item.width / 2 - item.width / 8, 0, item.width / 4, item.height);
			break;
		}
		case 2:
		{

			/*
			 *			
			 *			 _	
			 *			| |
			 *			| |
			 *			| |
			 */

			ctx.fillRect(item.width / 2 - item.width / 8, 0, item.width / 4, item.height / 2);
			ctx.beginPath();
			ctx.arc(item.width / 2, item.height / 2, 12, 0, 2 * Math.PI, false);
			ctx.fill();
			break;
		}
		case 3:
		{

			/*
			 *			| |
			 *		____| |____
			 *		____   ____
			 *			| |
			 *			| |
			 */

			ctx.fillRect(item.width / 2 - item.width / 8, 0, item.width / 4, item.height);
			ctx.fillRect(0, item.height / 2 - item.height / 8, item.width, item.height / 4);
			break;
		}
		case 4:
		{

			/*
			 *			| |
			 *		____| |____
			 *		___________
			 *
			 *
			 */

			ctx.fillRect(item.width / 2 - item.width / 8, 0, item.width / 4, item.height / 2);
			ctx.fillRect(0, item.height / 2 - item.height / 8, item.width, item.height / 4);
			break;
		}
		case 5:
		{

			/*
			 *			| |
			 *			| |____
			 *			|______
			 *
			 *
			 */

			ctx.fillRect(item.width / 2 - item.width / 8, 0, item.width / 4, item.height / 2);
			ctx.fillRect(item.width / 2 - item.width / 8, item.height / 2 - item.height / 8, item.width, item.height / 4);
			break;
		}
		default:
		{
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

const updateElementsMap = (row, column, type, direction) => {
	globals.elementsMap = [
		...globals.elementsMap.filter(e => JSON.stringify({ row, column }) !== JSON.stringify(e.position)),
		{
			position: {
				row,
				column,
			},
			type,
			direction,
		},
	];
};

const onBoardCellClick = (row, column) => {
	if (JSON.stringify({ row, column }) !== JSON.stringify(globals.startPoint.position)) {
		const currentCell = document.getElementById(`cell-${row}-${column}`);
		const nextElement = globals.expectedElements[0];
			
		ctx = currentCell.getContext('2d');
		ctx.fillStyle = 'black';

		drawElementByType(globals.expectedElements[0].type, ctx, currentCell);
		currentCell.style.transform = `rotate(${globals.expectedElements[0].direction * 90}deg)`;

		globals.expectedElements.shift();
		pushNewExpectedElement();

		updateElementsMap(row, column, globals.expectedElements[0].type, globals.expectedElements[0].direction);
	}
};

const animateComponent = (ctx, type, cell) => {
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
		case 'halfpipe':
		{
			i = 0;
			s = 50;
			break;
		}
		default:
		{
			break;
		}
	}

	interval = setInterval(animate.bind(null, s), 100);

	function animate(stop) {
		i += 1;

		if (i > stop) {
			clearInterval(interval);
		} else {
			switch (type) {
				case 'pump':
				{
					ctx.beginPath();
					ctx.arc(cell.width / 2, cell.height / 2, i, 0, 2 * Math.PI, false);
					ctx.fill();
					break;
				}
				case 'halfpipe':
				{
					ctx.fillRect(cell.width / 2 - cell.width / 8 + 4, 50 - i, cell.width / 4 - 8, i);
					break;
				}
				default:
				{
					break;
				}
			}
		}
	}
};

const openValve = () => {
	const startCell = document.getElementById(`cell-${globals.startPoint.position.row}-${globals.startPoint.position.column}`);

	ctx = startCell.getContext('2d');
	ctx.fillStyle = 'lightblue';

	animateComponent(ctx, 'pump', startCell);
	animateComponent(ctx, 'halfpipe', startCell);
};

const startNewGame = () => {
	createWorkspace();
	drawStartPoint();

	for (let i = 0; i < 5; i += 1) {
		pushNewExpectedElement();
	}
};

window.onload = () => {
	startNewGame();
}
