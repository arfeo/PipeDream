window.onload = () => {
	if (!globals.playerName) {
		displayPlayerNameModal();
	} else {
		displayMainMenuModal();
	}
};
