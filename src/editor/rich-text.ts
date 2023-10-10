import { SunstarEditorElement } from '@/editor-element';
import * as utils from '@/utils/utils';

import styles from '@/styles/text-styles.module.css';

function insertLinebreak() {
	const state = window.sunstar.editorState;
	const activeEditor = state.activeEditor;

	if (activeEditor === null) return;

	const selection = utils.getSelection(activeEditor);

	if (selection === null) return;
	if (selection.focusNode === null) return;

	const focusNode = selection.focusNode;
	const paragraph = utils.getParagraph(focusNode);

	if (paragraph) {
		const newParagraph = utils.createParagraph();

		paragraph.insertAdjacentElement('afterend', newParagraph);

		const windowSelection = window.getSelection();
		if (windowSelection) {
			const windowRange = windowSelection.getRangeAt(0);

			windowRange.selectNodeContents(newParagraph);
		}
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

function increaseIndent(editor: SunstarEditorElement) {
	const selection = utils.getSelection(editor);
	if (selection === null) return;

	const focusNode = selection.focusNode;
	if (focusNode === null) return;

	const paragraph = utils.getParagraph(focusNode);
	if (paragraph) {
		if (paragraph.style.paddingLeft !== undefined && paragraph.style.paddingLeft !== null && paragraph.style.paddingLeft !== '') {
			const existingPadding = Number.parseInt(paragraph.style.paddingLeft.replaceAll('px', ''));
			paragraph.style.paddingLeft = (existingPadding + 20).toString() + 'px';
		} else {
			paragraph.style.paddingLeft = '20px';
		}
	}
}

function decreaseIndent(editor: SunstarEditorElement) {
	const selection = utils.getSelection(editor);
	if (selection === null) return;

	const focusNode = selection.focusNode;
	if (focusNode === null) return;

	const paragraph = utils.getParagraph(focusNode);
	if (paragraph) {
		if (paragraph.style.paddingLeft !== undefined && paragraph.style.paddingLeft !== null && paragraph.style.paddingLeft !== '') {
			const existingPadding = Number.parseInt(paragraph.style.paddingLeft.replaceAll('px', ''));

			if (existingPadding - 20 <= 0) {
				paragraph.style.paddingLeft = '';
			} else {
				paragraph.style.paddingLeft = (existingPadding - 20).toString() + 'px';
			}
		}
	}
}

function insertCharacterButonClick(ev: JQuery.MouseDownEvent) {
	const character: string = ev.currentTarget.innerText;
	utils.insertAtCursor(character);
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

	increaseIndent,
	decreaseIndent,
};
