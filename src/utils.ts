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

export { insertAtCursor };
