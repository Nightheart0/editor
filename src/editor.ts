import $ from 'jquery';
import * as ML from 'mathlive';
import * as DOMPurify from 'dompurify';

import { newMathField, addMathFieldEventListeners } from './math-field';
import { init as initToolbars } from './toolbars';
import { locales } from './locales';
import * as clipboard from './clipboard';
import * as utils from './utils';
import * as richText from './rich-text';

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

function init(div: HTMLDivElement, options: EditorOptions) {
	const strings = locales[options.locale ?? defaultOptions.locale as EditorSupportedLocale];

	if (state.firstCall) {
		state.firstCall = false;
		state.$toolbar = initToolbars() as JQuery<HTMLDivElement>;
		$('body').append(state.$toolbar);
	}

	const onDivInput = () => {
		let innerHTML = '';

		div.childNodes.forEach((child) => {
			if (child.nodeType === Node.ELEMENT_NODE && child.nodeName === 'SPAN') {
				let span = child as HTMLSpanElement;
				let spanHTML = '<span'

				const attributeNames = span.getAttributeNames();
				attributeNames.forEach((name) => {
					const attributeValue = span.getAttribute(name);

					if (attributeValue === null) {
						spanHTML += ` ${name}`;
					} else {
						spanHTML += ` ${name}="${attributeValue}"`;
					}
				});

				spanHTML += '>';

				if (span.hasAttribute('data-mathfield')) {
					const mathField: ML.MathfieldElement | null = span.querySelector('math-field') as ML.MathfieldElement | null;

					if (mathField) {
						spanHTML += `&nbsp;`;
						spanHTML += `<math-field`;

						const mathAttributeNames = mathField.getAttributeNames();
						mathAttributeNames.forEach((name) => {
							const attributeValue = span.getAttribute(name);

							if (attributeValue === null) {
								spanHTML += ` ${name}`;
							} else {
								spanHTML += ` ${name}="${attributeValue}"`;
							}
						});

						spanHTML += '>';

						const latex = mathField.getValue();

						spanHTML += latex;
						spanHTML += `</math-field>`
						spanHTML += `&nbsp;`;
					}
				} else {
					spanHTML += span.innerHTML;
				}

				spanHTML += '</span>';
				innerHTML += spanHTML;
			} else if (child.nodeType === Node.ELEMENT_NODE) {
				const element = child as HTMLElement;
				innerHTML += element.outerHTML;
			} else if (child.nodeType === Node.TEXT_NODE) {
				innerHTML += child.textContent;
			}
		});

		if (options.onInput) {
			options.onInput(innerHTML);
		}
	};

	$(div)
		.attr({
			contenteditable: true,
			spellcheck: false,
			'data-js': 'mistyeditor',
		})
		.append(document.createElement('br'))
		.addClass('rich-text-editor')
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
		const cleanContents = DOMPurify.sanitize(options.initialContents, { ADD_TAGS: ['math-field'] });

		div.innerHTML = cleanContents;

		const $mathFields = $(div).children('span[data-mathfield="true"]');
		for (let i = 0; i < $mathFields.length; i++) {
			const mathFieldSpan = $mathFields.get(i) as HTMLSpanElement;
			const mathFieldElement = mathFieldSpan.querySelector('math-field');

			if (mathFieldElement === null) continue;
			if (!mathFieldElement.hasAttribute('read-only')) {
				mathFieldElement.setAttribute('read-only', '');
			} else if (mathFieldElement.getAttribute('read-only') === 'false') {
				mathFieldElement.setAttribute('read-only', '');
			}

			mathFieldSpan.contentEditable = 'false';

			addMathFieldEventListeners($(div), mathFieldSpan, mathFieldElement as ML.MathfieldElement);
		}
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
