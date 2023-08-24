import * as utils from './utils';

import styles from './text-styles.module.css';

function toggleBold() {
	const selection = document.getSelection();
	if (selection === null) return;

	if (selection.type === 'Range') {
		if (utils.selectionHasClass(selection, styles.bold)) {
			utils.removeClassFromSelection(selection, styles.bold);
		} else {
			utils.addClassToSelection(selection, styles.bold);
		}
	} else if (selection.type === 'Caret') {
		const range = selection.getRangeAt(0);

		if (selection.anchorNode?.parentElement?.tagName === 'SPAN' && selection.anchorNode?.parentElement?.classList?.contains(styles.bold)) {
			const parent = selection.anchorNode.parentElement;

			if (parent.textContent && (range.startOffset === parent.textContent.length)) {
				const spanElement = document.createElement('span');
				spanElement.appendChild(document.createTextNode(new DOMParser().parseFromString('&ZeroWidthSpace;', 'text/html').documentElement.textContent as string));

				parent.insertAdjacentElement('afterend', spanElement);

				range.setStartAfter(spanElement);
				range.setEndAfter(spanElement);
				range.collapse(true);
			}
		} else {
			const span = document.createElement('span');

			span.className = styles.bold;
			span.appendChild(document.createTextNode(new DOMParser().parseFromString('&ZeroWidthSpace;', 'text/html').documentElement.textContent as string));

			utils.insertAtCursor(span);

			range.selectNodeContents(span);

			span.focus();
		}
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
