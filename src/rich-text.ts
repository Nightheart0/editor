import * as utils from './utils';

import styles from './text-styles.module.css';

function insertLinebreak() {
	const selection = document.getSelection();

	if (selection?.anchorNode?.parentElement?.tagName === 'SPAN') {
		const br = document.createElement('br');
		const parentElement: HTMLSpanElement = selection.anchorNode.parentElement as HTMLSpanElement;
		parentElement.insertAdjacentElement('afterend', br);

		const range = selection.getRangeAt(0);
		range.insertNode(br);
		range.setStartAfter(br);
		range.setEndAfter(br);
	} else {
		utils.insertAtCursor(document.createElement('br'));
	}
}

function toggleBold() {
	const applier = window.sunstarEditor.styleAppliers.bold;
	applier.toggleSelection();
}

function toggleItalic() {
	const applier = window.sunstarEditor.styleAppliers.italic;
	applier.toggleSelection();
}

function toggleUnderline() {
	const applier = window.sunstarEditor.styleAppliers.underline;
	applier.toggleSelection();
}

function toggleStrikethrough() {
	const applier = window.sunstarEditor.styleAppliers.strikethrough;
	applier.toggleSelection();
}

function toggleSubscript() {
	const applier = window.sunstarEditor.styleAppliers.subscript;
	applier.toggleSelection();
}

function toggleSuperscript() {
	const applier = window.sunstarEditor.styleAppliers.superscript;
	applier.toggleSelection();
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
