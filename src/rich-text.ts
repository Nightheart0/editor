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

function toggleItalic() {
	const selection = document.getSelection();
	if (selection === null) return;

	utils.toggleStyle(selection, styles.italic);
}

function toggleUnderline() {
	const selection = document.getSelection();
	if (selection === null) return;

	utils.toggleStyle(selection, styles.underline);
}

function toggleStrikethrough() {
	const selection = document.getSelection();
	if (selection === null) return;

	utils.toggleStyle(selection, styles.strikethrough);
}

function toggleSubscript() {
	const selection = document.getSelection();
	if (selection === null) return;

	utils.toggleStyle(selection, styles.subscript);
}

function toggleSuperscript() {
	const selection = document.getSelection();
	if (selection === null) return;

	utils.toggleStyle(selection, styles.superscript);
}

function increaseIndent(editorDiv: HTMLDivElement, selection: Selection) {
	const range = selection.getRangeAt(0);
	const startContainer = range.startContainer;

	if (startContainer === editorDiv) {
		const startOffset = range.startOffset;
	} else if (startContainer.parentNode === editorDiv) {

	}
}

function decreaseIndent() {

}

function insertCharacterButonClick(e: JQuery.MouseDownEvent) {
	const character: string = e.currentTarget.innerText;
	//const command = e.currentTarget.dataset.command;
	//const useWrite = e.currentTarget.dataset.usewrite === 'true';

	if (window.editor2.$currentEditor !== null) {
		utils.insertAtCursor(character);
	}
}

export {
	insertLinebreak,
	insertCharacterButonClick,
	
	toggleBold,
	toggleItalic,
	toggleUnderline,
	toggleStrikethrough,
	toggleSubscript,
	toggleSuperscript,
};
