import * as utils from './utils';

import styles from './text-styles.module.css';

function toggleBold() {
	const selection = document.getSelection();
	if (selection === null) return;

	if (utils.selectionHasClass(selection, styles.bold)) {
		utils.removeClassFromSelection(selection, styles.bold);
	} else {
		utils.addClassToSelection(selection, styles.bold);
	}
}

function insertCharacterButonClick(e: JQuery.MouseDownEvent) {
	const character: string = e.currentTarget.innerText;
	//const command = e.currentTarget.dataset.command;
	//const useWrite = e.currentTarget.dataset.usewrite === 'true';

	if (window.editor2.$currentEditor !== null) {
		utils.insertAtCursor(character);
	}
}

export { insertCharacterButonClick, toggleBold };
