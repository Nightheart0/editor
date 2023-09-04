import $ from 'jquery';
import * as ML from 'mathlive';
import * as DOMPurify from 'dompurify';

import { newMathField, addMathFieldEventListeners } from './math-field';
import { init as initToolbars } from './toolbars';
import { locales } from './locales';
import * as clipboard from './clipboard';
import * as utils from './utils';
import * as richText from './rich-text';

import editorStyles from './editor.module.css';
import toolbarStyles from './toolbars.module.css';

/**
 * The initial state
 */
const initialState: EditorState = {
	focus: {
		richTextEditor: false,
		mathEquation: false,
	},

	$currentEditor: null,
	$toolbar: null,
	$helpOverlay: null,

	firstCall: true,
};

const defaultOptions: EditorOptions = {
	locale: 'en',
};

window.editor2 = window.editor2 || initialState;
const state = window.editor2;

function getEditorValue(editor: HTMLDivElement): string {
	let value = '';

	editor.childNodes.forEach((child) => {
		if (child.nodeType === Node.ELEMENT_NODE && child.nodeName === 'SPAN' && (child as HTMLSpanElement).hasAttribute('data-mathfield')) {
			const span = child as HTMLSpanElement;
			const mathField: ML.MathfieldElement | null = span.querySelector('math-field') as ML.MathfieldElement | null;

			if (mathField) {
				value += `<math-field>`;

				const latex = mathField.getValue();
				value += latex;

				value += `</math-field>`
			}
		} else if (child.nodeType === Node.ELEMENT_NODE) {
			const element = child as HTMLElement;
			value += element.outerHTML;
		} else if (child.nodeType === Node.TEXT_NODE) {
			value += child.textContent;
		} 
	});

	return value;
}

function setEditorValue(editor: HTMLDivElement, value: string) {
	const cleanValue = DOMPurify.sanitize(value, { ADD_TAGS: ['math-field'] });
	const parser = new DOMParser();
	const document = parser.parseFromString(cleanValue, 'text/html');

	const mathFields = document.body.querySelectorAll('math-field');
	mathFields.forEach((mathField) => {
		const span = document.createElement('span');
		span.contentEditable = 'false';
		span.dataset.mathfield = 'true';

		if (!mathField.hasAttribute('read-only')) {
			mathField.setAttribute('read-only', '');
		} else if (mathField.getAttribute('read-only') === 'false') {
			mathField.setAttribute('read-only', '');
		}

		if (!mathField.hasAttribute('contenteditable')) {
			mathField.setAttribute('contenteditable', 'true');
		} else if (mathField.getAttribute('contenteditable') === 'false') {
			mathField.setAttribute('contenteditable', 'true');
		}

		mathField.insertAdjacentElement('beforebegin', span);

		span.appendChild(document.createTextNode(new DOMParser().parseFromString('&nbsp;', 'text/html').documentElement.textContent as string));
		span.appendChild(mathField);
		span.appendChild(document.createTextNode(new DOMParser().parseFromString('&nbsp;', 'text/html').documentElement.textContent as string));
	});

	editor.innerHTML = document.body.innerHTML;

	const $mathFields = $(editor).children('span[data-mathfield="true"]');
	for (let i = 0; i < $mathFields.length; i++) {
		const mathFieldSpan = $mathFields.get(i) as HTMLSpanElement;
		const mathFieldElement = mathFieldSpan.querySelector('math-field');

		if (mathFieldElement === null) continue;

		addMathFieldEventListeners($(editor), mathFieldSpan, mathFieldElement as ML.MathfieldElement);
	}
}

function init(div: HTMLDivElement, options: EditorOptions) {
	const strings = locales[options.locale ?? defaultOptions.locale as EditorSupportedLocale];

	if (state.firstCall) {
		state.firstCall = false;
		state.$toolbar = initToolbars() as JQuery<HTMLDivElement>;
		$('body').append(state.$toolbar);
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
						newMathField($(div));

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
			if (div.lastChild === null) div.appendChild(document.createElement('br'));
			if (div.lastChild!.nodeName !== 'BR') div.appendChild(document.createElement('br'));

			onDivInput();
		})
		.on('paste', (e) => {
			clipboard.onPaste($(div) as JQuery<HTMLDivElement>, e);
		});
	
	if (options.initialContents !== undefined) {
		setEditorValue(div, options.initialContents);
	}
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

export { init };
