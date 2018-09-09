import { getData } from './storage';

import { IGlobals, IStorage } from './types';

export const storage: IStorage = {
	playername: getData('playername') || '',
	difficulty: parseInt(getData('difficulty')) || 0,
	scoreboard: getData('scoreboard') || [],
};

export const globals: IGlobals = {
	playerName: storage.playername,
	expectedElements: [],
	startPoint: {
		position: {
			row: 0,
			column: 0,
		},
		direction: null,
	},
	elementsMap: [],
	gameDifficulty: storage.difficulty,
	isGameOver: false,
	gameTimer: null,
	gameScoreCounter: null,
	animationPromisesCount: 0,
	gameScoreboard: storage.scoreboard,
};
