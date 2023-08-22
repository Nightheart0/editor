import * as utils from './utils';

function insertCharacterButonClick(e: JQuery.MouseDownEvent) {
	const character: string = e.currentTarget.innerText;
	//const command = e.currentTarget.dataset.command;
	//const useWrite = e.currentTarget.dataset.usewrite === 'true';

	if (window.editor2.$currentEditor !== null) {
		utils.insertAtCursor(character);
	}
}

export { insertCharacterButonClick };
