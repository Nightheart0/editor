import $ from 'jquery';
import * as ML from 'mathlive';
import * as DOMPurify from 'dompurify';

import * as rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';

import * as mathField from './math-field';
import { init as initToolbars } from './toolbars';
import { init as initHelpDialog } from './help-dialog';
import { locales } from './locales';
import * as clipboard from './clipboard';
import * as utils from './utils';
import * as richText from './rich-text';

import editorStyles from './editor.module.css';
import toolbarStyles from './toolbars.module.css';
import textStyles from './text-styles.module.css';

(rangy as any).init();

/**
 * The initial state
 */
const initialState: EditorState = {
	focus: {
		richTextEditor: false,
		mathEquation: false,
	},

	styleAppliers: {
		bold: (rangy as any).createClassApplier(textStyles.bold),
		italic: (rangy as any).createClassApplier(textStyles.italic),
		underline: (rangy as any).createClassApplier(textStyles.underline),
		strikethrough: (rangy as any).createClassApplier(textStyles.strikethrough),
		subscript: (rangy as any).createClassApplier(textStyles.subscript),
		superscript: (rangy as any).createClassApplier(textStyles.superscript),
	},

	$currentEditor: null,
	$toolbar: null,
	$helpDialog: null,

	firstCall: true,
};

const defaultOptions: EditorOptions = {
	locale: 'en',
};

window.sunstarEditor = window.sunstarEditor || initialState;
const state = window.sunstarEditor;

function getEditorValue(editor: HTMLDivElement): string {
	let value = '';

	editor.childNodes.forEach((child) => {
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

function setEditorValue(editor: HTMLDivElement, value: string) {
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

	editor.innerHTML = document.body.innerHTML;

	const mathFields2 = editor.querySelectorAll('span[data-mathfield="true"]');
	for (let i = 0; i < mathFields2.length; i++) {
		const mathFieldSpan = mathFields2[i] as HTMLSpanElement;
		const mathFieldElement = mathFieldSpan.querySelector('math-field');

		if (mathFieldElement === null) continue;

		mathField.initializeLaTeXEditor(mathFieldSpan, mathFieldElement as ML.MathfieldElement);
		mathField.addMathFieldEventListeners($(editor), mathFieldSpan, mathFieldElement as ML.MathfieldElement);
	}
}

function init(div: HTMLDivElement, options: EditorOptions): EditorObject {
	const strings = locales[options.locale ?? defaultOptions.locale as EditorSupportedLocale];

	if (state.firstCall) {
		state.firstCall = false;

		state.$toolbar = initToolbars() as JQuery<HTMLDivElement>;
		state.$helpDialog = initHelpDialog() as JQuery<HTMLDialogElement>;

		$('body').append(state.$toolbar);
		$('body').append(state.$helpDialog);
	}

	const onDivInput = () => {
		const value = getEditorValue(div);

		if (options.onInput) {
			options.onInput(value);
		}
	};

	$(div)
		.attr({
			contenteditable: true,
			spellcheck: false,
			'data-js': 'sunstar-editor',
		})
		.append(document.createElement('br'))
		.addClass(editorStyles['sunstar-editor'])
		.on('keydown', (e) => {
			if (e.ctrlKey) {
				switch (e.code) {
					case 'KeyE':
						e.preventDefault();
						mathField.newMathField($(div));

						break;
					case 'KeyB':
						e.preventDefault();
						richText.toggleBold();

						break;
					case 'KeyI':
						e.preventDefault();
						richText.toggleItalic();

						break;
					case 'KeyU':
						e.preventDefault();
						richText.toggleUnderline();

						break;
					case 'KeyD':
						e.preventDefault();
						richText.toggleStrikethrough();

						break;
					case 'Comma':
						e.preventDefault();
						richText.toggleSubscript();

						break;
					case 'Period':
						e.preventDefault();
						richText.toggleSuperscript();

						break;
					default:
						// Do nothing
				}
			}

			if (e.code === 'Enter') {
				e.preventDefault();
				richText.insertLinebreak();
			}
		})
		.on('focus', (e) => {
			onFocus($(div));
		})
		.on('blur', (e) => {
			onBlur($(div));
		})
		.on('input', (e) => {
			if (div.lastChild === null) createInitialParagraph(div);
			//if (div.lastChild!.nodeName !== 'BR') div.appendChild(document.createElement('br'));

			onDivInput();
		})
		.on('copy', (ev) => {
			if (ev.originalEvent === null) return;
			const event = ev.originalEvent as ClipboardEvent;

			clipboard.onCopy($(div), event);
		})
		.on('paste', (e) => {
			clipboard.onPaste($(div) as JQuery<HTMLDivElement>, e);
		});
	
	if (options.initialValue !== undefined && options.initialValue !== '') {
		setEditorValue(div, options.initialValue);
	} else {
		createInitialParagraph(div);
	}

	return {
		getValue: () => {
			const value = getEditorValue(div);
			return value;
		},
	};
}

function onFocus($editorElement: JQuery<HTMLDivElement>) {
	state.$currentEditor = $editorElement;
	toggleRichTextToolbarAnimation();
	toggleRichTextToolbar(true, state.$currentEditor);
}

function onBlur($editorElement: JQuery<HTMLDivElement>) {
    toggleRichTextToolbar(false, $editorElement)
    toggleRichTextToolbarAnimation()
    //focus.richText = false
}

function toggleRichTextToolbar(isVisible: boolean, $editor: JQuery<HTMLDivElement>) {
	$('body').toggleClass(toolbarStyles['rich-text-editor-focus'], isVisible);
	$editor.toggleClass('rich-text-focused', isVisible);
}

function toggleRichTextToolbarAnimation() {
	const animatingClass = toolbarStyles['tools--animating'];

	if (state.$toolbar === null) return;

	state.$toolbar
		.addClass(animatingClass)
		.one('transitionend transitioncancel', () => state.$toolbar!.removeClass(animatingClass));
}

function createInitialParagraph(div: HTMLDivElement) {
	const textNode = document.createTextNode(new DOMParser().parseFromString('&ZeroWidthSpace;', 'text/html').documentElement.textContent as string);
	const paragraph = utils.createParagraph(textNode);

	div.appendChild(paragraph);

	const selection = document.getSelection();
	if (!selection) return;

	try {
		const range = selection.getRangeAt(0);
		range.selectNode(textNode);
	} catch {
		console.log('Couldn\'t select node.');
	}
}

export { init };
