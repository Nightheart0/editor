function insertAtCursor(nodeOrString: Node | string) {
	if (window.getSelection) {
		const selection = window.getSelection();
		if (selection === null) return;

		const range = selection.getRangeAt(0);
		range.deleteContents();

		if (typeof nodeOrString === 'string') {
			const textNode = document.createTextNode(nodeOrString);

			range.insertNode(textNode);
			range.setStartAfter(textNode);
			range.setEndAfter(textNode);
		} else {
			range.insertNode(nodeOrString);
			range.setStartAfter(nodeOrString);
			range.setEndAfter(nodeOrString);
		}
	}
}

function addClassToSelection(selection: Selection, cssClass: string): void {
	if (selection.anchorNode?.nodeName !== '#text' || selection.focusNode?.nodeName !== '#text') return;
	if (selection.anchorNode.parentElement === null || selection.focusNode.parentElement === null) return;

	const range = selection.getRangeAt(0);

	if (selection.anchorNode.parentElement === selection.focusNode.parentElement && selection.anchorNode.parentElement.nodeName.toLowerCase() === 'span') {
		const span = selection.anchorNode.parentElement;

		if (span.textContent == null) return;

		if (!span.classList.contains(cssClass)) {
			span.classList.add(cssClass);
		}
	} else {
		const spanElement = document.createElement('span');
		spanElement.classList.add(cssClass);

		try {
			range.surroundContents(spanElement);
		} catch {
			// Unhandled for now
		}
	}
}

function removeClassFromSelection(selection: Selection, cssClass: string): void {
	if (selection.anchorNode?.nodeName !== '#text' || selection.focusNode?.nodeName !== '#text') return;
	if (selection.anchorNode.parentElement === null || selection.focusNode.parentElement === null) return;

	const range = selection.getRangeAt(0);

	if (selection.anchorNode.parentElement === selection.focusNode.parentElement && selection.anchorNode.parentElement.nodeName.toLowerCase() === 'span') {
		const span = selection.anchorNode.parentElement;

		if (span.textContent == null) return;

		if (range.startOffset === 0 && range.endOffset === span.textContent.length) {
			if (span.classList.contains(cssClass)) {
				if (span.classList.length === 1) {
					span.insertAdjacentText('beforebegin', span.textContent);
					span.remove();
				} else {
					span.classList.remove(cssClass);
				}
			}
		} else {
			const textBefore = span.textContent.substring(0, range.startOffset);
			const textInRange = span.textContent.substring(range.startOffset, range.endOffset);
			const textAfter = span.textContent.substring(range.endOffset);

			const oldClasses = span.classList.value;

			let textBeforeSpan: HTMLSpanElement | null = null;
			if (textBefore.length > 0) {
				textBeforeSpan = document.createElement('span');

				textBeforeSpan.classList.add(oldClasses);
				textBeforeSpan.textContent = textBefore;

				span.insertAdjacentElement('afterend', textBeforeSpan);
			}

			const newSpan = document.createElement('span');

			if (span.classList.length > 1) {
				newSpan.classList.add(oldClasses);
				newSpan.classList.remove(cssClass);
			}
			newSpan.innerText = textInRange;

			if (textBeforeSpan !== null) {
				textBeforeSpan.insertAdjacentElement('afterend', newSpan);
			} else {
				span.insertAdjacentElement('afterend', newSpan);
			}

			if (textAfter.length > 0) {
				const textAfterSpan = document.createElement('span');

				textAfterSpan.classList.add(oldClasses);
				textAfterSpan.textContent = textAfter;

				newSpan.insertAdjacentElement('afterend', textAfterSpan);
			}

			span.remove();
			range.selectNodeContents(newSpan);
		}
	}
}

function selectionHasClass(selection: Selection, cssClass: string): boolean | null {
	if (selection.anchorNode?.nodeName !== '#text' || selection.focusNode?.nodeName !== '#text') return null;
	if (selection.anchorNode.parentElement === null || selection.focusNode.parentElement === null) return null;

	if (selection.anchorNode.parentElement === selection.focusNode.parentElement && selection.anchorNode.parentElement.nodeName.toLowerCase() === 'span') {
		const span = selection.anchorNode.parentElement;

		if (span.classList.contains(cssClass)) {
			return true;
		} else {
			return false;
		}
	}

	return null;
}

export { insertAtCursor, addClassToSelection, removeClassFromSelection, selectionHasClass };
