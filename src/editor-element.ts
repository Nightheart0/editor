import $ from 'jquery';
import * as ML from 'mathlive';
import * as DOMPurify from 'dompurify';

import { initCore } from '@/editor/editor-core';
import * as mathField from '@/editor/math-field';

// @ts-ignore
import styles from '@/styles/sunstar-editor.css?raw';

const elementAttributes: Record<
	'fontsDirectory',
	string
> = {
	fontsDirectory: 'fonts-directory', // MathLive fonts directory
};

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

		if (this.getAttribute(elementAttributes.fontsDirectory) !== null) {
			this._fontsDirectory = this.getAttribute(elementAttributes.fontsDirectory);
			ML.MathfieldElement.fontsDirectory = this._fontsDirectory;
		}

		this.attachShadow({ mode: 'open', delegatesFocus: true });

		const styleElement = document.createElement('style');
		styleElement.textContent = styles;

		this.editorDiv = document.createElement('div');

		this.editorDiv.spellcheck = false;
		this.editorDiv.dataset.js = 'sunstar-editor';
		this.editorDiv.classList.add('sunstar-editor');

		this.shadowRoot!.append(styleElement, this.editorDiv);

		initCore(this, this.editorDiv);

		this.editorDiv.addEventListener('input', (ev) => {
			const event = new Event('input');
			this.dispatchEvent(event);
		});
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
		const cleanValue = DOMPurify.sanitize(value, { ADD_TAGS: ['math-field'] });
		let valueWithParagraphs = '';

		const lines = cleanValue.split('\n');
		if (lines.length > 1) {
			for (const line of lines) {
				valueWithParagraphs += `<p>${line}</p>`;
			}
		} else {
			valueWithParagraphs = cleanValue;
		}

		const parser = new DOMParser();
		const document = parser.parseFromString(valueWithParagraphs, 'text/html');

		const mathFields = document.body.querySelectorAll('math-field');
		mathFields.forEach((mfe) => {
			const span = document.createElement('span');
			mathField.initializeSpan(span);

			if (!mfe.hasAttribute('read-only')) {
				mfe.setAttribute('read-only', '');
			} else if (mfe.getAttribute('read-only') === 'false') {
				mfe.setAttribute('read-only', '');
			}

			if (!mfe.hasAttribute('contenteditable')) {
				mfe.setAttribute('contenteditable', 'true');
			} else if (mfe.getAttribute('contenteditable') === 'false') {
				mfe.setAttribute('contenteditable', 'true');
			}

			mfe.insertAdjacentElement('beforebegin', span);

			//span.appendChild(document.createTextNode(new DOMParser().parseFromString('&nbsp;', 'text/html').documentElement.textContent as string));
			span.appendChild(mfe);
			//span.appendChild(document.createTextNode(new DOMParser().parseFromString('&nbsp;', 'text/html').documentElement.textContent as string));
		});

		this.editorDiv.innerHTML = document.body.innerHTML;

		const mathFields2 = this.editorDiv.querySelectorAll('span[data-mathfield="true"]');
		for (let i = 0; i < mathFields2.length; i++) {
			const mathFieldSpan = mathFields2[i] as HTMLSpanElement;
			const mathFieldElement = mathFieldSpan.querySelector('math-field');

			if (mathFieldElement === null) continue;

			mathField.initializeLaTeXEditor(mathFieldSpan, mathFieldElement as ML.MathfieldElement);
			mathField.addMathFieldEventListeners(this, $(this.editorDiv), mathFieldSpan, mathFieldElement as ML.MathfieldElement);
		}
	}

	get length(): number {
		return 0;
	}

	get lengthWithoutWhitespace(): number {
		return 0;
	}

	/** @internal */
	private _fontsDirectory: string | null = './fonts';

	/**
	 * MathLive fonts directory
	 */
	get fontsDirectory(): string | null {
		return this._fontsDirectory;
	}
	set fontsDirectory(value: string | null) {
		if (value !== this._fontsDirectory) {
			this._fontsDirectory = value;
			ML.MathfieldElement.fontsDirectory = this._fontsDirectory;
		}
	}

	/**
	* Custom elements lifecycle hooks
	* @internal
	*/
	static get observedAttributes(): readonly string[] {
		return [
			...Object.values(elementAttributes),
		];
	}

	/**
	* Custom elements lifecycle hooks
	* @internal
	*/
	attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown): void {
		if (oldValue === newValue) return;

		const hasValue: boolean = newValue !== null;

		switch (name) {
			case 'fonts-directory':
				if (typeof newValue === 'string') this._fontsDirectory = newValue;
			default:
		}
	}
}

export { SunstarEditorElement };
