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
                    onGameStop(false);

					return Promise.reject();
				}

				await animateElement(nextRow, nextColumn, nextEnt);
				break;
			}
			default:
			{
				await animateComponent('pipe-in', row, column, ent);

				const spec = constants.elementsSpec.filter(e => e.type === element.type)[0];
				const outlets = spec.outlets[element.direction].filter(e => e !== ent);

				await Promise.all(outlets.map(out => animateComponent('pipe-out', row, column, out)));

				updateElementsMap(element.type, row, column, element.direction, true);

				const nextElements = [];

				for (out of outlets) {
					const next = getNextElement(row, column, out);

					if (next === false) {
                        onGameStop(false);

						return Promise.reject();
					}

					if (next) {
						nextElements.push(next);
					}
				}

				await Promise.all(nextElements.map(n => animateElement(n.nextRow, n.nextColumn, n.nextEnt)));
				break;
			}
		}

		globals.animationPromisesCount -= 1;

		if (!globals.isGameOver && globals.animationPromisesCount === 0) {
            onGameStop(true);
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

	let next = false;

	globals.elementsMap.map((e) => {
		if (JSON.stringify({ row: nextRow, column: nextColumn }) === JSON.stringify(e.position)) {
			const nextSpec = constants.elementsSpec.filter(s => s.type === e.type)[0];

			if (nextSpec && nextSpec.outlets[e.direction].indexOf(nextEnt) !== -1 && !e.locked) {
				next = { nextRow, nextColumn, nextEnt };
			}

			if (e.locked) {
				next = null;
			}
		}

		return;
	});

	return next;
};

const onGameStop = (result) => {
    globals.isGameOver = true;

    if (result) {
        const gameScoreCounter = parseInt(document.getElementById('game-score-counter').innerText);

    	const score = {
    		playername: globals.playerName,
			difficulty: globals.gameDifficulty,
			score: gameScoreCounter,
			date: (new Date()).getTime(),
		};

		globals.gameScoreboard.push(score);

        saveData('scoreboard', globals.gameScoreboard);
	}

    displayGameResultModal(result);
};
