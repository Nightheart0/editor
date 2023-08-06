function insertAtCursor(nodeOrString: Node | string) {
	if (window.getSelection) {
		const selection = window.getSelection();
		if (selection === null) return;

		const range = selection.getRangeAt(0);
		range.deleteContents();

		if (typeof nodeOrString === 'string') {
			range.insertNode(document.createTextNode(nodeOrString));
		} else {
			range.insertNode(nodeOrString);
		}
	}
}

export { insertAtCursor };
