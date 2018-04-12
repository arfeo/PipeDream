const globals = {
	expectedElements: [],
	startPoint: {},
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
	for (let i = 0; i < 70; i += 1) {
		const boardCell = document.createElement('canvas');

		boardCell.id = `cell-${i + 1}`;
		boardCell.className = 'board__cell';
		boardCell.width = 100;
		boardCell.height = 100;

		appBoard.appendChild(boardCell);

		boardCell.addEventListener('click', () => onBoardCellClick(i + 1));
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
	
	// Generate start point
	globals.startPoint.position = randomNum(1, 70);
	let isStartPointChosen = false;

	while (!isStartPointChosen) {
		globals.startPoint.direction = randomNum(0, 3);

		// Prevent dead-end
		switch (globals.startPoint.position) {
			case 1:
			{
				if (globals.startPoint.direction !== 0 && globals.startPoint.direction !== 3) {
					isStartPointChosen = true;
				}
				break;
			}
			case 10:
			{
				if (globals.startPoint.direction !== 0 && globals.startPoint.direction !== 1) {
					isStartPointChosen = true;
				}
				break;
			}
			case 61:
			{
				if (globals.startPoint.direction !== 2 && globals.startPoint.direction !== 3) {
					isStartPointChosen = true;
				}
				break;
			}
			case 70:
			{
				if (globals.startPoint.direction !== 1 && globals.startPoint.direction !== 2) {
					isStartPointChosen = true;
				}
				break;
			}
			case 11:
			case 21:
			case 31:
			case 41:
			case 51:
			{
				if (globals.startPoint.direction !== 3) {
					isStartPointChosen = true;
				}
				break;
			}
			case 20:
			case 30:
			case 40:
			case 50:
			case 60:
			{
				if (globals.startPoint.direction !== 1) {
					isStartPointChosen = true;
				}
				break;
			}
			default:
			{
				if (globals.startPoint.position >= 2 && globals.startPoint.position <= 9) {
					if (globals.startPoint.direction !== 0) {
						isStartPointChosen = true;
					}
				} else if (globals.startPoint.position >= 62 && globals.startPoint.position <= 69) {
					if (globals.startPoint.direction !== 2) {
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
	const startCell = document.getElementById(`cell-${globals.startPoint.position}`);
	
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

const onBoardCellClick = (cell) => {
	if (cell !== globals.startPoint.position) {
		const currentCell = document.getElementById(`cell-${cell}`);
		const nextElement = globals.expectedElements[0];
			
		ctx = currentCell.getContext('2d');
		ctx.fillStyle = 'black';

		drawElementByType(globals.expectedElements[0].type, ctx, currentCell);

		currentCell.style.transform = `rotate(${globals.expectedElements[0].direction * 90}deg)`;

		globals.expectedElements.shift();
		
		pushNewExpectedElement();
	}
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
