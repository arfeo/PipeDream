/* tslint:disable:max-file-line-count */
import { displayGameResultModal } from './modals';
import { updateElementsMap } from './state';
import { saveData } from './storage';

import { globals } from './globals';
import { constants } from './constants';

import { IElementMapItem, IElementSpecItem, INextElement } from './types';

export const animateComponent = (type: string, row: number, column: number, ent: number): Promise<void> => {
	return new Promise((resolve) => {
		const cell: HTMLCanvasElement = document.getElementById(
			`cell-animation-${row}-${column}`
		) as HTMLCanvasElement;

		if (cell) {
			let interval: number = null;
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
				default: break;
			}

			interval = setInterval(() => {
				i += 1;

				if (i > s) {
					clearInterval(interval);
					resolve();
				} else {
					const ctx: CanvasRenderingContext2D = cell.getContext('2d');

					ctx.fillStyle = 'lightblue';

					switch (type) {
						case 'pump':
						{
							ctx.beginPath();
							ctx.arc(
								cell.width / 2,
								cell.height / 2, i,
								0,
								Math.PI * 2,
								false,
							);
							ctx.fill();
							break;
						}
						case 'pipe-in':
						{
							switch (ent) {
								case 0:
								{
									ctx.fillRect(
										cell.width / 2 - cell.width / 8 + 4,
										0,
										cell.width / 4 - 8,
										i,
									);
									break;
								}
								case 1:
								{
									ctx.fillRect(
										100 - i,
										cell.height / 2 - cell.height / 8 + 4,
										100,
										cell.height / 4 - 8,
									);
									break;
								}
								case 2:
								{
									ctx.fillRect(
										cell.width / 2 - cell.width / 8 + 4,
										100 - i,
										cell.width / 4 - 8,
										100 - i,
									);
									break;
								}
								case 3:
								{
									ctx.fillRect(
										0,
										cell.height / 2 - cell.height / 8 + 4,
										i,
										cell.height / 4 - 8,
									);
									break;
								}
								default: break;
							}
							break;
						}
						case 'pipe-out':
						{
							switch (ent) {
								case 0:
								{
									ctx.fillRect(
										cell.width / 2 - cell.width / 8 + 4,
										50 - i,
										cell.width / 4 - 8,
										i,
									);
									break;
								}
								case 1:
								{
									ctx.fillRect(
										50,
										cell.height / 2 - cell.height / 8 + 4,
										i,
										cell.height / 4 - 8,
									);
									break;
								}
								case 2:
								{
									ctx.fillRect(
										cell.width / 2 - cell.width / 8 + 4,
										50,
										cell.width / 4 - 8,
										i,
									);
									break;
								}
								case 3:
								{
									ctx.fillRect(
										50 - i,
										cell.height / 2 - cell.height / 8 + 4,
										i,
										cell.height / 4 - 8,
									);
									break;
								}
								default: break;
							}
							break;
						}
						default: break;
					}
				}
			}, constants.difficultyMatrix[globals.gameDifficulty].speed);
		}
	});
};

export const animateElement = async (row: number, column: number, ent?: number): Promise<void> => {
	if (!globals.isGameOver) {
		globals.animationPromisesCount += 1;

		const element: IElementMapItem = globals.elementsMap.filter((item: IElementMapItem) => {
			return JSON.stringify({ row, column }) === JSON.stringify(item.position)
    })[0] || null;

		switch (element.type) {
			case 0:
			{
				await Promise.all([
					animateComponent('pump', row, column, element.direction),
					animateComponent('pipe-out', row, column, element.direction),
				]);

				const next: INextElement | boolean = getNextElement(row, column, element.direction);
				const { nextRow, nextColumn, nextEnt } = next as INextElement;

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

				const spec: IElementSpecItem = constants.elementsSpec.filter((item: IElementSpecItem) => {
					return item.type === element.type;
        })[0] || null;
				const outlets: number[] = spec.outlets[element.direction].filter((item: number) => {
					return item !== ent;
        });

				await Promise.all(outlets.map((out: number) => {
					return animateComponent('pipe-out', row, column, out);
        }));

				updateElementsMap(element.type, row, column, element.direction, true);

				const nextElements: INextElement[] = [];

				for (const out of outlets) {
					const next = getNextElement(row, column, out);

          if (next === false) {
            onGameStop(false);

            return Promise.reject();
          }

          if (next) {
            nextElements.push(next as INextElement);
          }
				}

				await Promise.all(
					nextElements.map((item: INextElement) => {
						return animateElement(item.nextRow, item.nextColumn, item.nextEnt)
        	})
				);
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

export const getNextElement = (row: number, column: number, ent: number): INextElement | boolean => {
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
		default: break;
	}

	let next: INextElement | boolean = false;

	globals.elementsMap.map((item: IElementMapItem) => {
		if (JSON.stringify({ row: nextRow, column: nextColumn }) === JSON.stringify(item.position)) {
			const nextSpec = constants.elementsSpec.filter(s => s.type === item.type)[0] || null;

			if (nextSpec && nextSpec.outlets[item.direction].indexOf(nextEnt) !== -1 && !item.locked) {
				next = { nextRow, nextColumn, nextEnt };
			}

			if (item.locked) {
				next = null;
			}
		}

		return;
	});

	return next;
};

export const onGameStop = (result: boolean) => {
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
