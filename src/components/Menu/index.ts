import { Page } from '../Page';

import { displayMainMenuModal, displayPlayerNameModal } from './modals';

class Menu extends Page {
  constructor() {
    super();

    this.render();
  }

  render() {
    if (!this.playerName) {
      displayPlayerNameModal.call(this);

      return;
    }

    displayMainMenuModal.call(this);
  }
}

export { Menu };
