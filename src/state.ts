import { globals } from './globals';
import { constants } from './constants';

import { drawStartPoint, pushNewExpectedElement, timeTicker } from './workspace';

import { IElementMapItem } from './types';

export const clearGameState = async () => {
	globals.expectedElements = [];
	globals.elementsMap = [];
	globals.startPoint.position = null;
	globals.isGameOver = false;
	globals.animationPromisesCount = 0;

	clearTimeout(globals.gameTimer);
	await timeTicker(constants.difficultyMatrix[globals.gameDifficulty].time);

	for (let row = 1; row <= 7; row += 1) {
		for (let column = 1; column <= 10; column += 1) {
			const cell: HTMLCanvasElement = document.getElementById(
				`cell-${row}-${column}`
			) as HTMLCanvasElement;
			const cellAnimation: any = document.getElementById(`cell-animation-${row}-${column}`);
			const ctx: CanvasRenderingContext2D = cell.getContext('2d');
			const ctxAnimation: CanvasRenderingContext2D = cellAnimation.getContext('2d');

			ctx.clearRect(0, 0, 100, 100);
			ctxAnimation.clearRect(0, 0, 100, 100);
		}
	}
};

export const setNewGameState = async () => {
	await clearGameState();

	for (let i = 0; i < 5; i += 1) {
		pushNewExpectedElement();
	}

	drawStartPoint();
};

export const updateElementsMap = (type: number, row: number, column: number, direction: number, locked: boolean) => {
	globals.elementsMap = [
		...globals.elementsMap.filter((item: IElementMapItem) => {
			return JSON.stringify({ row, column }) !== JSON.stringify(item.position);
    }),
		{
			position: { row, column },
			type,
			direction,
			locked,
		},
	];
};
