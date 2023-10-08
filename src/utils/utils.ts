function insertAtCursor(nodeOrString: Node | string) {
	const state = window.sunstar.editorState;
	const activeEditor = state.activeEditor;
	const $currentEditor = state.$currentEditor;

	if (activeEditor === null || $currentEditor === null) return;

	const shadow = activeEditor.shadowRoot as ShadowRoot;
	const editorDiv: HTMLDivElement = $currentEditor.get(0)!;

	const selection: Selection = (shadow as any).getSelection !== undefined ? (shadow as any).getSelection() : window.getSelection()!;

	const range = selection.getRangeAt(0);
	range.deleteContents();

	editorDiv.focus();
	if (typeof nodeOrString === 'string') {
		const textNode = document.createTextNode(nodeOrString);

		range.insertNode(textNode);

		const windowSelection = window.getSelection();
		if (windowSelection) {
			const windowRange = windowSelection.getRangeAt(0);

			windowRange.setStartAfter(textNode);
			windowRange.setEndAfter(textNode);
			windowRange.collapse();
		}
	} else {
		range.insertNode(nodeOrString);
		
		const windowSelection = window.getSelection();
		if (windowSelection) {
			const windowRange = windowSelection.getRangeAt(0);

			windowRange.setStartAfter(nodeOrString);
			windowRange.setEndAfter(nodeOrString);
			windowRange.collapse();
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
			// The selection spans across element boundaries
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

	if (selection.anchorNode.parentElement === selection.focusNode.parentElement) {
		if (selection.anchorNode.parentElement.nodeName.toLowerCase() === 'span') {
			const span = selection.anchorNode.parentElement;

			if (span.classList.contains(cssClass)) {
				return true;
			} else {
				return false;
			}
		} else {
			return null;
		}
	} else {
		if (selection.anchorNode.parentElement.nodeName.toLowerCase() === 'span' && selection.focusNode.parentElement.nodeName.toLowerCase() === 'span') {
			const anchorSpan = selection.anchorNode.parentElement;
			const focusSpan = selection.focusNode.parentElement;

			if (anchorSpan.classList.contains(cssClass) && focusSpan.classList.contains(cssClass)) {
				return true;
			} else {
				return false;
			}
		} else {
			return null;
		}
	}
}

function toggleStyle(selection: Selection, cssClass: string) {
	if (selection.type === 'Caret') {
		const range = selection.getRangeAt(0);

		if (selection.anchorNode?.parentElement?.tagName === 'SPAN' && selection.anchorNode?.parentElement?.classList?.contains(cssClass)) {
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
				newSpan.classList.remove(cssClass);
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

			span.className = cssClass;
			span.appendChild(document.createTextNode(new DOMParser().parseFromString('&ZeroWidthSpace;', 'text/html').documentElement.textContent as string));

			insertAtCursor(span);

			range.selectNodeContents(span);

			span.focus();
		}
	}
}

function getParagraph(node: Node): HTMLParagraphElement | null {
	const searchParent = (searchNode: Node): HTMLParagraphElement | null => {
		const parent = searchNode.parentNode;

		if (parent === null) return null;
		if (parent.nodeName === 'BODY') return null;

		if (parent.nodeName === 'P') {
			return parent as HTMLParagraphElement;
		} else {
			return searchParent(parent);
		}
	}

	if (node.nodeName === 'P') {
		return node as HTMLParagraphElement;
	} else {
		return searchParent(node);
	}
}

function createParagraph(withContent?: string | Node) {
	const pElement = document.createElement('p');
	const brElement = document.createElement('br');

	if (withContent) {
		if (typeof withContent === 'string') {
			pElement.innerText = withContent;
		} else {
			pElement.appendChild(withContent);
		}
	}
	pElement.appendChild(brElement);

	return pElement;
}

export {
	insertAtCursor,
	addClassToSelection,
	removeClassFromSelection,
	selectionHasClass,
	toggleStyle,

	getParagraph,
	createParagraph,
};
