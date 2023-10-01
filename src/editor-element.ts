// @ts-ignore
import styles from '@/styles/sunstar-editor.css?raw';

/**
 * The `SunstarEditorElement` class is the DOM element responsible for displaying the editor.
 * 
 * This is the main entry point of the library.
 * 
 * Inherits from [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) and as such methods and properties
 * like `addEventListener()` and `dataset` are available.
 * 
 * @extends HTMLElement
 */
class SunstarEditorElement extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({ mode: 'open', delegatesFocus: true });
		if (!this.shadowRoot) return;

		const styleElement = document.createElement('style');
		styleElement.textContent = styles;

		const editorDiv = document.createElement('div');

		editorDiv.contentEditable = 'true';
		editorDiv.spellcheck = false;
		editorDiv.dataset.js = 'sunstar-editor';
		editorDiv.classList.add('sunstar-editor');

		this.shadowRoot.append(styleElement, editorDiv);
	}

	get value(): string {
		return '';
	}
	set value(value: string) {

	}

	get length(): number {
		return 0;
	}

	get lengthWithoutWhitespace(): number {
		return 0;
	}
}

export { SunstarEditorElement };
