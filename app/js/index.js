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
};

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
};
