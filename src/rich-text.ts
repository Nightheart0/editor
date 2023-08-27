import * as utils from './utils';

import styles from './text-styles.module.css';

function insertLinebreak() {
	utils.insertAtCursor(document.createElement('br'));
	// TODO: Add indentation
}

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

			if (parent.textContent === null) {
				parent.remove();

				return;
			}

			const textContent = parent.textContent;

			if (range.startOffset === textContent.length) {
				const spanElement = document.createElement('span');
				spanElement.appendChild(document.createTextNode(new DOMParser().parseFromString('&ZeroWidthSpace;', 'text/html').documentElement.textContent as string));

				parent.insertAdjacentElement('afterend', spanElement);

				range.setStartAfter(spanElement);
				range.setEndAfter(spanElement);
				range.collapse(true);
			} else {
				const contentBefore = textContent.substring(0, range.startOffset);
				const contentAfter = textContent.substring(range.startOffset);

				const spanBefore = document.createElement('span');
				spanBefore.classList.add(parent.classList.value);
				spanBefore.textContent = contentBefore;

				const newSpan = document.createElement('span');
				newSpan.classList.add(parent.classList.value);
				newSpan.classList.remove(styles.bold);
				newSpan.appendChild(document.createTextNode(new DOMParser().parseFromString('&ZeroWidthSpace;', 'text/html').documentElement.textContent as string));

				const spanAfter = document.createElement('span');
				spanAfter.classList.add(parent.classList.value);
				spanAfter.textContent = contentAfter;

				parent.insertAdjacentElement('afterend', spanBefore);
				parent.remove();
				spanBefore.insertAdjacentElement('afterend', newSpan);
				newSpan.insertAdjacentElement('afterend', spanAfter);

				range.selectNodeContents(newSpan);
				range.collapse();
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

export { insertLinebreak, insertCharacterButonClick, toggleBold };
