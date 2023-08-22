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

	if (selection.anchorNode.parentElement === selection.focusNode.parentElement && selection.anchorNode.parentElement.nodeName.toLowerCase() === 'span') {
		const span = selection.anchorNode.parentElement;

		if (span.textContent == null) return;

		if (span.classList.contains(cssClass)) {
			if (span.classList.length === 1) {
				span.insertAdjacentText('beforebegin', span.textContent);
				span.remove();
			} else {
				span.classList.remove(cssClass);
			}
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
