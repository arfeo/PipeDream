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
