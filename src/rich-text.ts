import * as utils from './utils';

import styles from './text-styles.module.css';

function insertLinebreak() {
	utils.insertAtCursor(document.createElement('br'));
	// TODO: Add indentation
}

function toggleBold() {
	const selection = document.getSelection();
	if (selection === null) return;

	utils.toggleStyle(selection, styles.bold);
}

function insertCharacterButonClick(e: JQuery.MouseDownEvent) {
	const character: string = e.currentTarget.innerText;
	//const command = e.currentTarget.dataset.command;
	//const useWrite = e.currentTarget.dataset.usewrite === 'true';

	if (window.editor2.$currentEditor !== null) {
		utils.insertAtCursor(character);
	}
}

export { insertLinebreak, insertCharacterButonClick, toggleBold };
