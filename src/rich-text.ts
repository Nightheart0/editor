import * as utils from './utils';

import styles from './text-styles.module.css';

function insertLinebreak() {
	const selection = document.getSelection();

	if (selection === null) return;
	if (selection.focusNode === null) return;

	const range = selection.getRangeAt(0);

	const focusNode = selection.focusNode;
	const paragraph = utils.getParagraph(focusNode);

	if (paragraph) {
		const textNode = document.createTextNode(new DOMParser().parseFromString('&ZeroWidthSpace;', 'text/html').documentElement.textContent as string);
		const newParagraph = utils.createParagraph(textNode);

		paragraph.insertAdjacentElement('afterend', newParagraph);
		range.setStartAfter(textNode);
		range.setEndAfter(textNode);
		range.selectNode(textNode);
	}
}

function toggleBold() {
	const selection = window.getSelection();

	if (selection === null) return;

	if (selection.type === 'Caret') {
		utils.toggleStyle(selection, styles.bold);
	} else {
		const applier = window.sunstarEditor.styleAppliers.bold;
		applier.toggleSelection();
	}
}

function toggleItalic() {
	const selection = window.getSelection();

	if (selection === null) return;

	if (selection.type === 'Caret') {
		utils.toggleStyle(selection, styles.italic);
	} else {
		const applier = window.sunstarEditor.styleAppliers.italic;
		applier.toggleSelection();
	}
}

function toggleUnderline() {
	const selection = window.getSelection();

	if (selection === null) return;

	if (selection.type === 'Caret') {
		utils.toggleStyle(selection, styles.underline);
	} else {
		const applier = window.sunstarEditor.styleAppliers.underline;
		applier.toggleSelection();
	}
}

function toggleStrikethrough() {
	const selection = window.getSelection();

	if (selection === null) return;

	if (selection.type === 'Caret') {
		utils.toggleStyle(selection, styles.strikethrough);
	} else {
		const applier = window.sunstarEditor.styleAppliers.strikethrough;
		applier.toggleSelection();
	}
}

function toggleSubscript() {
	const selection = window.getSelection();

	if (selection === null) return;

	if (selection.type === 'Caret') {
		utils.toggleStyle(selection, styles.subscript);
	} else {
		const applier = window.sunstarEditor.styleAppliers.subscript;
		applier.toggleSelection();
	}
}

function toggleSuperscript() {
	const selection = window.getSelection();

	if (selection === null) return;

	if (selection.type === 'Caret') {
		utils.toggleStyle(selection, styles.superscript);
	} else {
		const applier = window.sunstarEditor.styleAppliers.superscript;
		applier.toggleSelection();
	}
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

	if (window.sunstarEditor.$currentEditor !== null) {
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
