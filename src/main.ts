import { displayMainMenuModal, displayPlayerNameModal } from './modals';
import { globals } from './globals';

window.onload = () => {
	if (!globals.playerName) {
		displayPlayerNameModal();

		return;
	}

	displayMainMenuModal();
};
