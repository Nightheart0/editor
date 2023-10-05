import * as ML from 'mathlive';

import { initCore } from '@/editor/editor-core';

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
	private editorDiv: HTMLDivElement;

	constructor() {
		super();

		this.attachShadow({ mode: 'open', delegatesFocus: true });

		const styleElement = document.createElement('style');
		styleElement.textContent = styles;

		this.editorDiv = document.createElement('div');

		this.editorDiv.spellcheck = false;
		this.editorDiv.dataset.js = 'sunstar-editor';
		this.editorDiv.classList.add('sunstar-editor');

		this.shadowRoot!.append(styleElement, this.editorDiv);

		initCore(this, this.editorDiv);
	}

	get value(): string {
		let value = '';

		this.editorDiv.childNodes.forEach((child) => {
			if (child.nodeType === Node.ELEMENT_NODE && child.nodeName === 'P') {
				const pElement = child as HTMLParagraphElement;
				const pChildren = pElement.childNodes;
	
				for (let i = 0; i < pChildren.length; i++) {
					const pChild = pChildren[i];
	
					if (pChild.nodeType === Node.ELEMENT_NODE) {
						if (pChild.nodeName === 'SPAN' && (pChild as HTMLSpanElement).hasAttribute('data-mathfield')) {
							const span = pChild as HTMLSpanElement;
							const mathField: ML.MathfieldElement | null = span.querySelector('math-field') as ML.MathfieldElement | null;
	
							if (mathField) {
								value += `<math-field>`;
				
								const latex = mathField.getValue();
								value += latex;
				
								value += `</math-field>`
							}
						} else {
							const element = pChild as HTMLElement;
							value += element.outerHTML;
						}
					} else if (pChild.nodeType === Node.TEXT_NODE) {
						value += pChild.textContent;
					}
				}
	
				value += '\n';
			} else if (child.nodeType === Node.TEXT_NODE) {
				value += child.textContent;
			}
		});

		return value;
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
